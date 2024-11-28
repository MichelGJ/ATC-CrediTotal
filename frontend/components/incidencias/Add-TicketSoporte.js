/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../../services/auth';
import { useInjectLogoutButton } from '../../hooks/useInjectLogoutButton';

const AddTicketSoporte = () => {
    const [tipo, setTipo] = useState('');
    const [subtipo, setSubtipo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [cedulaCliente, setCedulaCliente] = useState('');
    const [cedulaHelp, setCedulaHelp] = useState('');
    const [tipos, setTipos] = useState([]);
    const [subtipos, setSubtipos] = useState([]);
    const [tipoText, setTipoText] = useState('');
    const [subTipoText, setSubtipoText] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);
    const { user, isLoggedIn, logout, protectPage } = useAuth();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    useEffect(() => {
        protectPage();
        // Fetch tipos and subtipos from the backend
        const fetchTipos = async () => {
            try {
                const response = await fetch(`${backendUrl}/api/incidencia/getAllTipoIncidencia`);
                const data = await response.json();
                setTipos(data.listaTipos);
            } catch (error) {
                console.error('Error fetching tipos:', error);
            }
        };

        fetchTipos();
    }, [backendUrl, protectPage]);

    const fetchSubtipos = async (idTipo) => {
        try {
            const response = await fetch(`${backendUrl}/api/incidencia/getAllSubTipoIncidenciaByTipoIncidencia?idTipo=${idTipo}`);
            const data = await response.json();
            setSubtipos(data.listaSubTipos);
        } catch (error) {
            console.error('Error fetching subtipos:', error);
        }
    };

    const handleTipoChange = (e) => {
        const selectedTipoId = e.target.value;
        const selectedTipoText = e.target.options[e.target.selectedIndex].text;
        setTipo(selectedTipoId);
        setTipoText(selectedTipoText);
        setSubtipo('');
        setSubtipos([]);
        if (selectedTipoId) {
            fetchSubtipos(selectedTipoId);
        }
        validateFormTicket(selectedTipoText, subtipo, descripcion, cedulaCliente, cedulaHelp);
    };

    const handleSubtipoChange = (e) => {
        const selectedSubtipoId = e.target.value;
        const selectedSubtipoText = e.target.options[e.target.selectedIndex].text;
        setSubtipo(selectedSubtipoId);
        setSubtipoText(selectedSubtipoText);
        validateFormTicket(tipo, selectedSubtipoText, descripcion, cedulaCliente, cedulaHelp);
    };

    const handleDescripcionChange = (e) => {
        setDescripcion(e.target.value);
        validateFormTicket();
    };

    const handleCedulaChange = (e) => {
        const value = e.target.value;
        if (/^\d{0,8}$/.test(value)) {
            setCedulaCliente(value);
            setCedulaHelp('');
        } else {
            setCedulaHelp('Cédula debe ser numérica y tener un máximo de 8 dígitos.');
        }
        validateFormTicket();
    };

    const validateFormTicket = () => {
        const isValid = descripcion.trim() && cedulaCliente.trim() && tipo !== "" && subtipo !== "" && !cedulaHelp;
        setIsFormValid(isValid);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const token = localStorage.getItem('token');
        const decodedToken = jwtDecode(token);
       
        const userId = decodedToken.name;

        const ticketData = {
            tipoIncidenciaId: tipoText,
            subTipoIncidenciaId: subTipoText,
            descripcion: descripcion,
            cedulaCliente: cedulaCliente,
            estatus: "Abierto",
            userId: userId,
        };

        try {
            const response = await fetch(`${backendUrl}/api/incidencia/registerTicketSoporte`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(ticketData),
            });

            if (response.ok) {
                alert('Ticket Abierto!');
                // Clear form fields
                setTipo('');
                setSubtipo('');
                setDescripcion('');
                setCedulaCliente('');
            } else {
                const result = await response.json();
                alert(`Error registrando el ticket: ${result.error || 'Error desconocido'}`);
            }
        } catch (error) {
            console.error('Error registrando el ticket:', error);
            alert('Hubo un error registrando el ticket. Intente nuevamente más tarde.');
        }
    };

    useInjectLogoutButton(logout);

    return (
        <div>
            <Head>
                <title>Registro de Ticket Soporte</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>

            <div className="top-bar" id="top-bar-register">
                <img src="/images/banner.png" alt="Company Logo" className="logo" />
            </div>

            <div className="registration-container">
                <form id="register-form" onSubmit={handleSubmit}>
                    <h3 className="mb-4 text-center">Ticket</h3>
                    <div className="mb-3">
                        <select
                            id="dynamic-dropdown-tipo"
                            className="form-select"
                            value={tipo}
                            onChange={handleTipoChange}
                            required
                        >
                            <option value="">Seleccione un Tipo</option>
                            {tipos.map((tipo) => (
                                <option key={tipo.id} value={tipo.id}>
                                    {tipo.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <select
                            id="dynamic-dropdown-subtipo"
                            className="form-select"
                            value={subtipo}
                            onChange={handleSubtipoChange}
                            required
                        >
                            <option value="">Seleccione Subtipo</option>
                            {subtipos.map((subtipo) => (
                                <option key={subtipo.id} value={subtipo.id}>
                                    {subtipo.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <textarea
                            className="form-control"
                            id="descripcion"
                            placeholder="Descripción"
                            rows="3"
                            value={descripcion}
                            onChange={handleDescripcionChange}
                            required
                        ></textarea>
                    </div>
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control"
                            id="cedulaCliente"
                            placeholder="Cédula del cliente"
                            value={cedulaCliente}
                            onChange={handleCedulaChange}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary btn-register w-100" disabled={!isFormValid}>
                        Registrar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddTicketSoporte;