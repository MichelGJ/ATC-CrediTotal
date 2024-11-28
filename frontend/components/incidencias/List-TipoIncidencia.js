/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useAuth } from '../../services/auth';
import { useInjectLogoutButton } from '../../hooks/useInjectLogoutButton';

const ListTipoIncidencia = () => {
    const [tiposIncidencia, setTiposIncidencia] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 10; // Default items per page
    const { isLoggedIn, logout } = useAuth();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    const fetchTiposIncidencia = useCallback(async (page = 1, search = '') => {
        try {
            const response = await fetch(`${backendUrl}/api/incidencia/getAllTipoIncidencia?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`);
            if (!response.ok) {
                throw new Error(`Fetch failed with status ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching data:', error);
            return { listaTipos: [], currentPage: 1, totalPages: 1 };
        }
    }, [backendUrl, limit]);

    const populateTiposIncidenciaTable = useCallback(async (page = 1, searchQuery = '') => {
        try {
            const { listaTipos, currentPage, totalPages } = await fetchTiposIncidencia(page, searchQuery);
            setTiposIncidencia(listaTipos);
            setCurrentPage(currentPage);
            setTotalPages(totalPages);
        } catch (error) {
            console.error('Error populating tipos incidencia table:', error);
        }
    }, [fetchTiposIncidencia]);

    const deleteTipoIncidenciaById = useCallback(async (id) => {
        try {
            const response = await fetch(`${backendUrl}/api/incidencia/deleteTipoIncidenciaById/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            }, [currentPage, totalPages]);
            if (!response.ok) {
                throw new Error(`Delete failed with status ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            throw new Error('Error deleting tipos:', error);
        }
    }, [backendUrl, currentPage, totalPages]);

    const deleteSubTiposIncidenciaByTipoIncidencia = useCallback(async (id) => {
        try {
            const response = await fetch(`${backendUrl}/api/incidencia/deleteSubTipoIncidenciaByTipoIncidencia/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            }, [currentPage, totalPages]);
            if (!response.ok) {
                throw new Error(`Delete failed with status ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            throw new Error('Error deleting subTipos:', error);
        }
    }, [backendUrl, currentPage, totalPages]);

    const handleEdit = (tipoId) => {
        window.location.href = `/incidencias/edit-tipoIncidencia?id=${tipoId}`;
    };


    const handleSubTipo = (tipoId) => {
        window.location.href = `list-subTipoIncidencia?idTipo=${tipoId}`;
    };

    const handleDelete = async (tipoId) => {
        if (confirm('¿Está seguro de eliminar este tipo de incidencia?')) {
            try {
                const deleted = await deleteTipoIncidenciaById(tipoId);
                await deleteSubTiposIncidenciaByTipoIncidencia(tipoId);
                if (deleted) {
                    populateTiposIncidenciaTable();
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
        const host = window.location.host;
        const wsUrl = `${protocol}${host}/ws`;

        const socket = new WebSocket(wsUrl);

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.type === 'newTipoIncidencia') {
                populateTiposIncidenciaTable();
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
    }, [populateTiposIncidenciaTable]);

    useEffect(() => {
        populateTiposIncidenciaTable();
        connectToWebSockets();
    }, [populateTiposIncidenciaTable, connectToWebSockets]);


    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        populateTiposIncidenciaTable(1, event.target.value);
    };

    const handleGoBack = () => {
        if (isLoggedIn()) {
            window.location.href = 'menu-incidencias.html';
        } else {
            logout();
        }
    };

    const handleAddTipoIncidencia = () => {
        if (isLoggedIn()) {
            window.location.href = 'add-tipoIncidencia.html';
        } else {
            logout();
        }
    };

    const appendPageButton = useCallback((pageNumber, currentPage, searchQuery) => {
        const paginationElement = document.getElementById('pagination');
        const pageButton = document.createElement('button');
        pageButton.classList.add('btn', 'btn-secondary', 'mx-1', 'btn-pagination');
        pageButton.innerText = pageNumber;

        if (pageNumber === currentPage) {
            pageButton.classList.add('active');
        }

        pageButton.addEventListener('click', () => {
            populateTiposIncidenciaTable(pageNumber, searchQuery);
        });

        paginationElement.appendChild(pageButton);
    }, [populateTiposIncidenciaTable]);

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
    }, [appendPageButton]);


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
                <title>Gestión de Incidencias</title>
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
                                    <button type="button" className="btn btn-primary" id="add-user-button" onClick={handleAddTipoIncidencia}>
                                        Agregar <i className="bi bi-plus"></i>
                                    </button>
                                </div>
                                <div className="ms-auto">
                                    <input
                                        className="form-control"
                                        id="userSearchInput"
                                        type="text"
                                        placeholder="Buscar tipo de incidencia..."
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
                                                <th id="acciones-tiposIncidencia">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody id="user-table-body">
                                            {tiposIncidencia.length === 0 ? (
                                                <tr>
                                                    <td colSpan="2">No se encontraron tipos de incidencia.</td>
                                                </tr>
                                            ) : (
                                                tiposIncidencia.map(tipo => (
                                                    <tr key={tipo.id}>
                                                        <td>{tipo.name}</td>
                                                        <td id="acciones-tiposIncidencia">
                                                            <button className="btn btn-danger btn-sm delete-user" onClick={() => handleDelete(tipo.id)}>
                                                                <i className="bi bi-trash"></i>
                                                            </button>
                                                            <button className="btn btn-warning btn-sm edit-user"  onClick={() => handleEdit(tipo.id)}>
                                                                <i className="bi bi-pencil"></i>
                                                            </button>
                                                            <button className="btn btn-primary btn-sm subtipos-button"  onClick={() => handleSubTipo(tipo.id)}>
                                                                <i className="bi bi-folder-plus"></i>
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

export default ListTipoIncidencia;