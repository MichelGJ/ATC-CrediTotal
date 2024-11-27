/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/style.css';

const NewTicket = () => {
    const [userId, setUserId] = useState('');
    const [prefix, setPrefix] = useState('V');
    const [ticket, setTicket] = useState(null);
    const [cedula, setCedula] = useState('');
    const [resultVisible, setResultVisible] = useState(false);
    let timeoutId;

    useEffect(() => {
        getLastTicket();
    }, []);

    const getLastTicket = async () => {
        try {
            await fetch('http://localhost:3000/api/ticket/last').then(resp => resp.json());
            // Handle the last ticket data if needed
        } catch (error) {
            console.error('Error fetching the last ticket:', error);
        }
    };

    const createTicket = async () => {
        const fullId = prefix + userId;

        if (!userId) {
            alert('Por favor, ingrese su cédula de identidad.');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/ticket', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ cedula: fullId })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Error creating ticket');
            }

            setTicket(result.number);
            setCedula(result.cedula);
            setResultVisible(true);

            if (timeoutId) {
                clearTimeout(timeoutId);
            }

            timeoutId = setTimeout(() => {
                setTicket(null);
                setCedula('');
                setResultVisible(false);
            }, 5000);

        } catch (error) {
            console.error('Error creando el ticket:', error);
            alert(`Error creando el ticket: ${error.message}`);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        createTicket();
    };

    return (
        <div className="body-index">
            <Head>
                <title>Nuevo Ticket</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>

            <div className="top-bar" id="top-bar-new-ticket">
                <img src="/images/banner.png" alt="Company Logo" className="logo" />
            </div>

            <div id="new-ticket-container" className="container text-center mt-5">
                <form onSubmit={handleSubmit}>
                    <span id="lbl-new-ticket-title" className="display-4">
                        Ingrese su cédula de identidad
                    </span>
                    <div className="mb-3 cedula-input input-group">
                        <div className="input-group-prepend">
                            <select
                                id="prefixDropdown"
                                className="form-select"
                                value={prefix}
                                onChange={(e) => setPrefix(e.target.value)}
                            >
                                <option value="V">V-</option>
                                <option value="E">E-</option>
                            </select>
                        </div>
                        <input
                            type="text"
                            id="userId"
                            className="form-control"
                            placeholder="Cédula"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            autoFocus
                            required
                        />
                    </div>
                    <button id="generateTicketBtn" className="generarButton btn btn-secondary btn-lg">
                        Generar nuevo ticket
                    </button>
                </form>
                <br />
                {resultVisible && (
                    <div id="result-ticket" className="mt-4">
                        <span id="lbl-new-ticket" className="display-4">Ticket número: {ticket}</span>
                        <br />
                        <span id="lbl-new-cedula" className="display-4">Cédula: {cedula}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NewTicket;