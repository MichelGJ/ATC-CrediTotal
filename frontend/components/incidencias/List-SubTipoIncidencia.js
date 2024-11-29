/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useAuth } from '../../services/auth';
import { useInjectLogoutButton } from '../../hooks/useInjectLogoutButton';

const ListSubTipoIncidencia = ({ idTipo }) => {
    const [subTiposIncidencia, setSubTiposIncidencia] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 10; // Default items per page
    const { isLoggedIn, logout, protectPage } = useAuth();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    const fetchSubTiposIncidencia = useCallback(async (idTipo, page = 1, search = '') => {
        try {
            const response = await fetch(`${backendUrl}/api/incidencia/getAllSubTipoIncidenciaByTipoIncidencia?idTipo=${idTipo}&page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`);
            if (!response.ok) {
                throw new Error(`Fetch failed with status ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching data:', error);
            return { listaSubTipos: [], currentPage: 1, totalPages: 1 };
        }
    }, [backendUrl, limit]);

    const populateSubTiposIncidenciaTable = useCallback(async (idTipo, page = 1, searchQuery = '') => {
        try {
            const { listaSubTipos, currentPage, totalPages } = await fetchSubTiposIncidencia(idTipo, page, searchQuery);
            setSubTiposIncidencia(listaSubTipos);
            setCurrentPage(currentPage);
            setTotalPages(totalPages);
        } catch (error) {
            console.error('Error populating subTipos incidencia table:', error);
        }
    }, [fetchSubTiposIncidencia]);

    const deleteSubTipoIncidenciaById = useCallback(async (id) => {
        try {
            const response = await fetch(`${backendUrl}/api/incidencia/deleteSubTipoIncidenciaById/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error(`Delete failed with status ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            throw new Error('Error deleting data:', error);
        }
    }, [backendUrl]);

    const handleEdit = (idSubTipo) => {
        window.location.href = `/incidencias/edit-subTipoIncidencia?idSubTipo=${idSubTipo}&idTipo=${idTipo}`;
    };

    const handleDelete = async (idSubTipo) => {
        if (confirm('¿Está seguro de eliminar este tipo de incidencia?')) {
            try {
                const deleted = await deleteSubTipoIncidenciaById(idSubTipo);
                if (deleted) {
                    populateSubTiposIncidenciaTable(idTipo);
                } else {
                    console.error('Error deleting tipo incidencia');
                    alert('Fallo eliminando el tipo de incidencia');
                }
            } catch (error) {
                console.error(error);
                alert('Fallo eliminando el tipo de incidencia');
            }
        }
    };

    const connectToWebSockets = useCallback(() => {
        const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
        const host = 'localhost:3000';
        const wsUrl = `${protocol}${host}/ws`;

        const socket = new WebSocket(wsUrl);

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.type === 'newTipoIncidencia') {
                populateSubTiposIncidenciaTable(idTipo);
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

        socket.onerror = (event) => {
            console.error('WebSocket error observed:', event);
        };
    }, [populateSubTiposIncidenciaTable, idTipo]);

    useEffect(() => {
        protectPage();
        populateSubTiposIncidenciaTable(idTipo);
        connectToWebSockets();
    }, [populateSubTiposIncidenciaTable, connectToWebSockets, idTipo, protectPage]);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        populateSubTiposIncidenciaTable(idTipo, 1, event.target.value);
    };

    const handleGoBack = () => {
        if (isLoggedIn()) {
            window.location.href = '/incidencias/list-tipoIncidencia';
        } else {
            logout();
        }
    };

    const handleAddSubTipoIncidencia = () => {
        if (isLoggedIn()) {
            window.location.href = `/incidencias/add-subTipoIncidencia?idTipo=${idTipo}`;
        } else {
            logout();
        }
    };

    const updatePaginationControls = useCallback((currentPage, totalPages, searchQuery = '') => {
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
            appendPageButton(1, currentPage, searchQuery);
            if (startPage > 2) {
                appendEllipsis(paginationElement);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            appendPageButton(i, currentPage, searchQuery);
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                appendEllipsis(paginationElement);
            }
            appendPageButton(totalPages, currentPage, searchQuery);
        }

        function appendPageButton(pageNumber, currentPage, searchQuery) {
            const pageButton = document.createElement('button');
            pageButton.classList.add('btn', 'btn-secondary', 'mx-1', 'btn-pagination');
            pageButton.innerText = pageNumber;

            if (pageNumber === currentPage) {
                pageButton.classList.add('active');
            }

            pageButton.addEventListener('click', () => {
                populateSubTiposIncidenciaTable(idTipo, pageNumber, searchQuery);
            });

            paginationElement.appendChild(pageButton);
        }

        function appendEllipsis(paginationElement) {
            const ellipsis = document.createElement('span');
            ellipsis.innerText = '...';
            paginationElement.appendChild(ellipsis);
        }
    }, [populateSubTiposIncidenciaTable, idTipo]);


    useEffect(() => {
        updatePaginationControls(currentPage, totalPages, searchTerm);
    }, [currentPage, totalPages, searchTerm, updatePaginationControls]);


    useInjectLogoutButton();

    return (
        <div>
            <Head>
                <title>SubTipos de Incidencias</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>

            <div className="top-bar" id="top-bar-users">
                <img src="/images/banner.png" alt="Company Logo" className="logo" />
            </div>

            <div className="container mt-4 user-container">
                <div className="row justify-content-center">
                    <div className="col-md-8 user-table">
                        <div className="card">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <div className="d-flex gap-2">
                                    <button type="button" className="btn btn-secondary" id="goBack-button" onClick={handleGoBack}>
                                        <i className="bi bi-arrow-90deg-left"></i> Regresar
                                    </button>
                                    <button type="button" className="btn btn-primary" id="add-user-button" onClick={handleAddSubTipoIncidencia}>
                                        Agregar <i className="bi bi-plus"></i>
                                    </button>
                                </div>
                                <div className="ms-auto">
                                    <input
                                        className="form-control"
                                        id="userSearchInput"
                                        type="text"
                                        placeholder="Buscar subtipo de incidencia..."
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
                                                <th>Nombre</th>
                                                <th>Tipo</th>
                                                <th id="acciones">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody id="user-table-body">
                                            {subTiposIncidencia.length === 0 ? (
                                                <tr>
                                                    <td colSpan="3">No se encontraron subtipos de incidencia.</td>
                                                </tr>
                                            ) : (
                                                subTiposIncidencia.map(subtipo => (
                                                    <tr key={subtipo.id}>
                                                        <td>{subtipo.name}</td>
                                                        <td>{subtipo.tipoDetails.name}</td>
                                                        <td id="acciones">
                                                            <button className="btn btn-danger btn-sm delete-user" onClick={() => handleDelete(subtipo.id)}>
                                                                <i className="bi bi-trash"></i>
                                                            </button>
                                                            <a>   </a>
                                                            <button className="btn btn-warning btn-sm edit-user" onClick={() => handleEdit(subtipo.id)}>
                                                                <i className="bi bi-pencil"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div id="pagination" className="card-footer d-flex justify-content-center"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListSubTipoIncidencia;