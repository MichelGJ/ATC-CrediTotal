/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useAuth } from '../../services/auth';
import { useInjectLogoutButton } from '../../hooks/useInjectLogoutButton';

const ListTicketsSoporte = () => {
    const [tickets, setTickets] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [userPermisos, setUserPermisos] = useState([]);

    const limit = 10; // Default tickets per page
    const { user, isLoggedIn, logout, protectPage } = useAuth();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    const populateTicketsTable = useCallback(async (page = 1, searchQuery = '') => {

        const fetchTickets = async (page = 1, search = '') => {
            try {
                const response = await fetch(`${backendUrl}/api/incidencia/getAllTicketSoporte?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`);
                if (!response.ok) {
                    throw new Error(`Fetch failed with status ${response.status}`);
                }
                const data = await response.json();
                return data;
            } catch (error) {
                console.error('Error fetching data:', error);
                return { listaTickets: [], currentPage: 1, totalPages: 1 };
            }
        };
        try {
            const { listaTickets, currentPage, totalPages } = await fetchTickets(page, searchQuery);
            setUserPermisos(user.roleDetails.permisos || []);
            setTickets(listaTickets);
            setCurrentPage(currentPage);
            setTotalPages(totalPages);
        } catch (error) {
            console.error('Error populating tickets table:', error);
        }
    }, [backendUrl, user]);

    const connectToWebSockets = useCallback(() => {
        const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
        const host = 'localhost:3000';
        const wsUrl = `${protocol}${host}/ws`;

        const socket = new WebSocket(wsUrl);

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.type === 'newTicket') {
                populateTicketsTable();
            }
        };

        socket.onclose = () => {
            setTimeout(() => {
                console.log('retrying to connect');
                connectToWebSockets();
            }, 1500);
        };

        socket.onopen = () => {
            console.log('Connected');
        };

        socket.onerror = (event) => {
            console.error('WebSocket error observed:', event);
        };
    }, [populateTicketsTable]);

    useEffect(() => {
        protectPage();
        if (user) {
            populateTicketsTable();
            connectToWebSockets();
        }
    }, [populateTicketsTable, connectToWebSockets, protectPage, user]);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        populateTicketsTable(1, event.target.value);
    };

    const handleGoBack = () => {
        if (isLoggedIn()) {
            window.location.href = 'menu-incidencias.html';
        } else {
            logout();
        }
    };

    const closeTicket = async (id) => {
        try {
            const response = await fetch(`${backendUrl}/api/incidencia/closeTicketSoporte/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            }, []);
            if (response.ok) {
                alert('Ticket Cerrado!');
                populateTicketsTable();
            } else {
                const result = await response.json();
                alert(`Error en actualizacion: ${result.error || 'Error desconocido'}`);
            }
        } catch (error) {
            console.error('Error closing ticket:', error);
            alert('Hubo un error cerrando el ticket. Intente nuevamente más tarde.');
        }
    };

    const appendPageButton = useCallback((pageNumber) => {
        const paginationElement = document.getElementById('pagination');
        const pageButton = document.createElement('button');
        pageButton.classList.add('btn', 'btn-secondary', 'mx-1', 'btn-pagination');
        pageButton.innerText = pageNumber;

        if (pageNumber === currentPage) {
            pageButton.classList.add('active');
        }

        pageButton.addEventListener('click', () => {
            populateTicketsTable(pageNumber, searchTerm);
        });

        paginationElement.appendChild(pageButton);
    }, [currentPage, populateTicketsTable, searchTerm]);

    const updatePaginationControls = useCallback(() => {
        const paginationElement = document.getElementById('pagination');
        paginationElement.innerHTML = '';

        const maxVisiblePages = 5;
        const halfVisible = Math.floor(maxVisiblePages / 2);

        let startPage = Math.max(currentPage - halfVisible, 1);
        let endPage = Math.min(currentPage + halfVisible, totalPages);

        if (totalPages > maxVisiblePages) {
            if (currentPage <= halfVisible) {
                endPage = maxVisiblePages;
            } else if (currentPage + halfVisible >= totalPages) {
                startPage = totalPages - maxVisiblePages + 1;
            }
        }

        if (startPage > 1) {
            appendPageButton(1);
            if (startPage > 2) {
                appendEllipsis(paginationElement);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            appendPageButton(i);
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                appendEllipsis(paginationElement);
            }
            appendPageButton(totalPages);
        }
    }, [currentPage, totalPages, appendPageButton]);

    const appendEllipsis = (paginationElement) => {
        const ellipsis = document.createElement('span');
        ellipsis.innerText = '...';
        paginationElement.appendChild(ellipsis);
    };

    useEffect(() => {
        updatePaginationControls();
    }, [currentPage, totalPages, updatePaginationControls]);

    useInjectLogoutButton();

    return (
        <div>
            <Head>
                <title>Soporte</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>

            <div className="top-bar" id="top-bar-users">
                <img src="/images/banner.png" alt="Company Logo" className="logo" />
            </div>

            <div className="container mt-4 user-container">
                <div className="row justify-content-center">
                    <div className="col-md-8 ticket-table">
                        <div className="card">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <div className="d-flex gap-2">
                                    <button type="button" className="btn btn-secondary" id="goBack-button" onClick={handleGoBack}>
                                        <i className="bi bi-arrow-90deg-left"></i> Regresar
                                    </button>
                                </div>
                                <div className="ms-auto">
                                    <input
                                        className="form-control"
                                        id="userSearchInput"
                                        type="text"
                                        placeholder="Buscar ticket..."
                                        value={searchTerm}
                                        onChange={handleSearch}
                                    />
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className="table table-bordered table-hover users-table">
                                        <thead>
                                            <tr>
                                                <th>Tipo</th>
                                                <th>Subtipo</th>
                                                <th>Fecha</th>
                                                <th>Descripción</th>
                                                <th>Cédula Cliente</th>
                                                <th>Estatus</th>
                                                <th>Reportado por</th>
                                                <th id="acciones">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody id="user-table-body">
                                            {tickets.length === 0 ? (
                                                <tr>
                                                    <td colSpan="8">No tickets found.</td>
                                                </tr>
                                            ) : (
                                                tickets.map(ticket => (
                                                    <tr key={ticket.id}>
                                                        <td>{ticket.tipoIncidenciaId || ''}</td>
                                                        <td>{ticket.subTipoIncidenciaId || ''}</td>
                                                        <td>{ticket.fecha || ''}</td>
                                                        <td>{ticket.descripcion}</td>
                                                        <td>{ticket.cedulaCliente}</td>
                                                        <td>{ticket.estatus}</td>
                                                        <td>{ticket.userId || ''}</td>
                                                        <td id="acciones">
                                                            {ticket.estatus !== 'Cerrado' && userPermisos.includes('closeTicket') && (
                                                                <button
                                                                    className="btn btn-success btn-sm close-ticket"
                                                                    data-id={ticket.id}
                                                                    onClick={() => closeTicket(ticket.id)}
                                                                >
                                                                    <i className="bi bi-check"></i>
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div id="pagination" className="card-footer d-flex justify-content-center">
                                {/* Pagination controls will appear here */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListTicketsSoporte;