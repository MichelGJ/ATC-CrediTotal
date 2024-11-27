/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React, { useEffect } from 'react';
import Head from 'next/head';
import { useInjectLogoutButton } from '../../hooks/useInjectLogoutButton';
import { useAuth } from '../../services/auth';

const MenuIncidencias = () => {
    const {user, isLoggedIn, logout, protectPage } = useAuth();

    useEffect(() => {
        protectPage();
        const enableOptionButton = async () => {

            if (user) {
                const userPermisos = user.roleDetails.permisos || [];
                const buttonsContainer = document.querySelector(".buttons-container");

                userPermisos.forEach(permission => {
                    const button = document.getElementById(`${permission.valueOf()}-button`);

                    if (!button) {
                        return;
                    }

                    if (userPermisos.includes(permission)) {
                        buttonsContainer.insertBefore(button, buttonsContainer.firstChild);
                        button.style.visibility = "visible";
                    } else {
                        button.style.display = "hidden";
                    }
                });
            } else {
                console.error('User is missing');
            }
        };

        enableOptionButton();

        const gestionIncidenciasButton = document.getElementById('gestionIncidencias-button');
        const reportarButton = document.getElementById('reportar-button');
        const listaTicketsButton = document.getElementById('listaTickets-button');

        const handleGestionIncidenciasClick = () => {
            if (isLoggedIn()) {
                window.location.href = '/incidencias/list-tipoIncidencia';
            } else {
                logout(); // Logout if token is expired
            }
        };

        const handleReportarClick = () => {
            if (isLoggedIn()) {
                window.location.href = '/incidencias/add-ticketSoporte';
            } else {
                logout(); // Logout if token is expired
            }
        };

        const handleListaTicketsClick = () => {
            if (isLoggedIn()) {
                window.location.href = '/incidencias/list-ticketSoporte';
            } else {
                logout(); // Logout if token is expired
            }
        };

        gestionIncidenciasButton.addEventListener('click', handleGestionIncidenciasClick);
        reportarButton.addEventListener('click', handleReportarClick);
        listaTicketsButton.addEventListener('click', handleListaTicketsClick);

        return () => {
            gestionIncidenciasButton.removeEventListener('click', handleGestionIncidenciasClick);
            reportarButton.removeEventListener('click', handleReportarClick);
            listaTicketsButton.removeEventListener('click', handleListaTicketsClick);
        };
    }, [user, isLoggedIn, logout, protectPage]);

    useInjectLogoutButton();

    return (
        <div>
            <Head>
                <title>CrediTotal</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>

            <div className="top-bar">
                <img src="/images/banner.png" alt="Company Logo" className="logo" />
            </div>

            <div className="buttons-container">
                <div className="option-button atp-option hidden" id="reportar-button">
                    <div className="text-overlay">Abrir Ticket de Soporte</div>
                    <img src="/images/incident.png" className="reportar-logo" />
                </div>
                <div className="option-button atp-option hidden" id="listaTickets-button">
                    <div className="text-overlay">Lista de Tickets</div>
                    <img src="/images/listaTicket.png" className="listaTicket-logo" />
                </div>
                <div className="option-button reportar-option hidden" id="gestionIncidencias-button">
                    <div className="text-overlay">Gestión de Incidencias</div>
                    <img src="/images/settings.png" className="gestionIncidencias-logo" />
                </div>
            </div>
        </div>
    );
};

export default MenuIncidencias;