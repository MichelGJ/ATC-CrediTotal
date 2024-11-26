/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/style.css';
import { useAuth } from '../services/auth';
import { useInjectLogoutButton } from '../hooks/useInjectLogoutButton';
import {jwtDecode} from 'jwt-decode';

const Desk2 = () => {
    const [mesaNumber, setMesaNumber] = useState('....');
    const [ticketNumber, setTicketNumber] = useState('....');
    const [dynamicOptions1, setDynamicOptions1] = useState([]);
    const [dynamicOptions2, setDynamicOptions2] = useState([]);
    const [dynamicOptions3, setDynamicOptions3] = useState([]);
    const [descripcion, setDescripcion] = useState('');
    const [pendingTickets, setPendingTickets] = useState(0);
    const [workingTicket, setWorkingTicket] = useState(null);
    const [personInfo, setPersonInfo] = useState('');
    const [envsData, setEnvsData] = useState({});
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [isDescripcionDisabled, setIsDescripcionDisabled] = useState(true);
    const router = useRouter();
    const { protectPage } = useAuth();

    const connectToWebSockets = useCallback(() => {
        const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
        const host = 'localhost:3000';
        const wsUrl = `${protocol}${host}/ws`;

        const socket = new WebSocket(wsUrl);

        socket.onmessage = (event) => {
            try {
                const { type, payload } = JSON.parse(event.data);
                if (type !== 'on-ticket-count-changed') return;
                setPendingTickets(payload);
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
            }
        };

        socket.onclose = () => {
            setTimeout(() => {
                connectToWebSockets();
            }, 1500);
        };

        socket.onopen = () => {
            console.log('Connected');
        };
    }, []);

    useEffect(() => {
        protectPage();
        const searchParams = new URLSearchParams(window.location.search);
        if (!searchParams.has('mesa')) {
            router.push('/');
            throw new Error('Mesa es requerida');
        }
        const deskNumber = searchParams.get('mesa');
        setMesaNumber(deskNumber);
        loadInitialCount();
        loadEnvs();
        connectToWebSockets();
    }, [protectPage, router, connectToWebSockets]);

    const loadInitialCount = async () => {
        const pendingTickets = await fetch('http://localhost:3000/api/ticket/pending').then(resp => resp.json());
        setPendingTickets(pendingTickets.length);
    };

    const loadEnvs = async () => {
        const envs = await fetch(`http://localhost:3000/api/envs/`);
        const data = await envs.json();
        setEnvsData(data);
    };

    const getTicket = async () => {
        const { status, ticket, message } = await fetch(`http://localhost:3000/api/ticket/draw/${mesaNumber}`).then(resp => resp.json());
        if (status === 'error') {
            setTicketNumber(message);
            setPersonInfo('....');
            return;
        }

        await registerTicket(ticket.cedula);
        const response = await getClient(ticket.cedula);

        if (!response.ok) {
            setPersonInfo('Error obteniendo informacion del cliente');
        } else {
            const cliente = await response.json();
            if (!cliente.code) {
                setPersonInfo(`
                    <h4>Cédula: ${cliente.person.code_identity || ''}${cliente.person.identity || ''}</h4>
                    <h4>Nombre: ${cliente.person.name.toUpperCase() || ''} ${cliente.person.second_name?.toUpperCase() || ''} ${cliente.person.lastName.toUpperCase() || ''}  
                    ${cliente.person.second_lastName?.toUpperCase() || ''}</h4>
                    ${cliente.domiciled ?
                        `<h5>Domiciliado</h5>
                        <h5>Banco: ${cliente.domiciled_bank.name || ''}</h5>`
                        : ''}
                    <h5>Link Backoffice: 
                        <a href="${envsData.CONSOLA_URL}${cliente.person.code || ''}" target="_blank">
                            ${cliente.person.code ? 'Ver Perfil' : ''}
                        </a>
                    </h5>
                    <h5>Correo: ${cliente.person.contacts[1].contact.toLowerCase() || ''}</h5>
                `);
            } else {
                setPersonInfo('Cliente no registrado');
            }
        }

        setWorkingTicket(ticket);
        setTicketNumber(`ticket ${ticket.number}`);
        setDescripcion('');
        setIsDescripcionDisabled(false);
        populateTipoDropdowns();
        populateFixedDropdown();
    };

    const finishTicket = async () => {
        if (!workingTicket) return;
        const { status, message } = await fetch(`http://localhost:3000/api/ticket/done/${workingTicket.id}`, {
            method: 'PUT'
        }).then(resp => resp.json());
        if (status === 'error') {
            setTicketNumber(message);
            return;
        }

        const updateStatus = await updateTicket();

        if (updateStatus === 'ok') {
            setWorkingTicket(null);
            setTicketNumber('....');
            setPersonInfo('');
            setDescripcion('');
            setIsDescripcionDisabled(true);
        }
        clearDropdowns();
    };

    const getClient = async (cedula) => {
        const response = await fetch(envsData.API_URL + cedula, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': envsData.AUTH_API
            },
        });

        return response;
    };

    const registerTicket = async (cedula) => {
        const cedulaCliente = cedula.trim();
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.name || [];

        const ticketData = {
            cedulaCliente: cedulaCliente,
            user: userId,
        };

        try {
            const response = await fetch(`http://localhost:3000/api/atp/registerTicketPresencial`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(ticketData),
            });

            const result = await response.json();

            const idField = document.getElementById('ticket-id');
            idField.value = result.user.id;

            if (response.ok) {
                console.log('Registro exitoso');
            } else {
                console.error('Error en el registro:', result);
            }
        } catch (error) {
            console.error('Error en el registro:', error);
            alert('Hubo un error en el registro. Intente nuevamente más tarde.');
        }
    };

    const updateTicket = async () => {
        const resultado = document.getElementById('dynamic-dropdown-tipo3').value;
        const id = document.getElementById('ticket-id').value;

        const ticketData = {
            id: id,
            resultado: resultado,
            descripcion: descripcion,
        };

        try {
            const response = await fetch(`http://localhost:3000/api/atp/updateTicketPresencial`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(ticketData),
            });

            const result = await response.json();
            if (response.ok) {
                console.log('Actualización exitosa:', result);
                return 'ok';
            } else {
                console.error('Error en la actualización:', result);
                return 'error';
            }
        } catch (error) {
            console.error('Error en la actualización:', error);
            alert('Hubo un error en la actualización. Intente nuevamente más tarde.');
            return 'error';
        }
    };

    const populateTipoDropdowns = async () => {
        try {
            const tipoResponse = await fetch('http://localhost:3000/api/incidencia/getAllTipoIncidencia');
            const { listaTipos } = await tipoResponse.json();
            setDynamicOptions1(listaTipos.map(tipo => ({ value: tipo.id, label: tipo.name })));
        } catch (error) {
            console.error('Error fetching dropdown data:', error);
        }
    };

    const handleTipoChange = async (event) => {
        const idTipo = event.target.value;
        setDynamicOptions2([]); // Clear the subtipo dropdown

        try {
            const subtipoResponse = await fetch(`http://localhost:3000/api/incidencia/getAllSubTipoIncidenciaByTipoIncidencia?idTipo=${idTipo}`);
            const { listaSubTipos } = await subtipoResponse.json();
            setDynamicOptions2(listaSubTipos.map(subtipo => ({ value: subtipo.id, label: subtipo.name })));
        } catch (error) {
            console.error('Error fetching subtipo data:', error);
        }
    };

    const populateFixedDropdown = () => {
        const fixedValues = [
            { value: 'Resuelto', text: 'Resuelto' },
            { value: 'Se fue', text: 'Se fue' },
            { value: 'No Resuelto', text: 'No Resuelto' }
        ];
        setDynamicOptions3(fixedValues);
    };

    const clearDropdowns = () => {
        setDynamicOptions1([]);
        setDynamicOptions2([]);
        setDynamicOptions3([]);
    };

    const handleDrawTicket = () => {
        if (personInfo) {
            if (validateForm()) {
                finishTicket();
                getTicket();
            }
        } else {
            getTicket();
        }
    };

    const handleCloseTicket = () => {
        if (validateForm()) {
            finishTicket();
        }
    };

    const validateForm = () => {
        const tipo1 = document.getElementById('dynamic-dropdown-tipo1').value;
        const tipo2 = document.getElementById('dynamic-dropdown-tipo2').value;
        const tipo3 = document.getElementById('dynamic-dropdown-tipo3').value;

        if (!tipo1 || !tipo2 || !tipo3 || !descripcion) {
            alert('Todos los campos son obligatorios.');
            return false;
        }
        return true;
    };

    useInjectLogoutButton();

    return (
        <div className="body-index">
            <Head>
                <title>ATC CrediTotal</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>

            <div className="top-bar" id="top-bar-desk">
                <img src="/images/banner.png" alt="Company Logo" className="logo" />
            </div>

            <div className="container" id="desk-container">
                <h1 className="mt-3" id="mesa">Mesa <span id="mesaNumber">{mesaNumber}</span></h1>
                <hr id="separador" />
                <div className="row">
                    <div className="col-8">
                        <h4 id="ticket">Atendiendo a <span id="ticketNumber">{ticketNumber}</span></h4>
                    </div>

                    <div className="col-4 text-center">
                        <h4 id="cola">En cola</h4>
                        <div className={`alert alert-info mt-1 ${pendingTickets === 0 ? '' : 'd-none'}`}>
                            <span>Ya no hay más tickets</span>
                        </div>
                        <h1 id="lbl-pending" className={pendingTickets === 0 ? 'd-none' : ''}>{pendingTickets}</h1>
                    </div>
                </div>
                <div id="person-info" style={{ display: personInfo ? 'block' : 'none' }} dangerouslySetInnerHTML={{ __html: personInfo }}></div>

                <div className="row mt-1">
                    <input type="hidden" id="ticket-id" name="ticket-id" />
                    <div className="col-4">
                        <select className="form-select" id="dynamic-dropdown-tipo1" required onChange={handleTipoChange}>
                            <option value="">Seleccione un tipo</option>
                            {dynamicOptions1.map((option, index) => (
                                <option key={index} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-4">
                        <select className="form-select" id="dynamic-dropdown-tipo2" required>
                            <option value="">Seleccione un subtipo</option>
                            {dynamicOptions2.map((option, index) => (
                                <option key={index} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-4">
                        <select className="form-select" id="dynamic-dropdown-tipo3" required>
                            <option value="">Seleccione un estatus</option>
                            {dynamicOptions3.map((option, index) => (
                                <option key={index} value={option.value}>{option.text}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="row mt-1">
                    <div className="col-12">
                        <label htmlFor="descripcion" className="form-label">Descripción</label>
                        <textarea
                            className="form-control"
                            id="descripcion"
                            rows="3"
                            placeholder="Ingrese detalle"
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            required
                            disabled={isDescripcionDisabled}
                        ></textarea>
                    </div>
                </div>
                <div className="buttons-container" id="desk-buttons-container">
                    <button id="btn-draw" className="btn btn-primary" onClick={handleDrawTicket}>
                        Atender siguiente ticket
                    </button>
                    <button id="btn-done" className="btn btn-primary" onClick={handleCloseTicket}>
                        Cerrar ticket
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Desk2;