/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '../../services/auth';
import { useInjectLogoutButton } from '../../hooks/useInjectLogoutButton';

const Desk1 = () => {
    const [mesa, setMesa] = useState('');
    const router = useRouter();
    const { protectPage } = useAuth();

    useEffect(() => {
        protectPage();
    }, [protectPage]);


    const handleSubmit = (event) => {
        event.preventDefault();
        router.push(`/atp/desk2?mesa=${mesa}`);
    }

    useInjectLogoutButton();

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
                    <span id="lbl-new-desk-title" className="display-4">
                        Ingrese Número de Mesa
                    </span>
                    <div className="mb-3 cedula-input">
                        <input
                            name="mesa"
                            type="text"
                            className="form-control"
                            placeholder="Mesa"
                            value={mesa}
                            onChange={(e) => setMesa(e.target.value)}
                            autoFocus
                            required
                        />
                        <button id="generateTicketBtn" className="generarButton btn btn-secondary btn-lg w-40">
                            Ingresar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Desk1;