/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Import Bootstrap Icons
import { useAuth } from '../../services/auth';
import { useInjectLogoutButton } from '../../hooks/useInjectLogoutButton';

const ListUsers = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 10; // Default users per page
    const { isLoggedIn, logout, protectPage } = useAuth();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    const populateUserTable = useCallback(async (page = 1, searchQuery = '') => {
        const fetchData = async (page = 1, search = '') => {
            try {
                const response = await fetch(`${backendUrl}/api/auth/getUsers?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`);
                if (!response.ok) {
                    throw new Error(`Fetch failed with status ${response.status}`);
                }
                const data = await response.json();
                return data;
            } catch (error) {
                console.error('Error fetching data:', error);
                return { users: [], currentPage: 1, totalPages: 1 };
            }
        };

        try {
            const { users, currentPage, totalPages } = await fetchData(page, searchQuery);
            setUsers(users);
            setCurrentPage(currentPage);
            setTotalPages(totalPages);
        } catch (error) {
            console.error('Error populating user table:', error);
        }
    }, [backendUrl]);

    const connectToWebSockets = useCallback(() => {
        const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
        const host = 'localhost:3000';
        const wsUrl = `${protocol}${host}/ws`;

        const socket = new WebSocket(wsUrl);

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.type === 'newUser') {
                populateUserTable();
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
    }, [populateUserTable]);

    useEffect(() => {
        protectPage();
        populateUserTable();
        connectToWebSockets();
    }, [connectToWebSockets, populateUserTable, protectPage]);

   

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        populateUserTable(1, event.target.value);
    };

    const handleDelete = async (userId) => {
        if (confirm('¿Está seguro de eliminar este usuario?')) {
            try {
                const deleted = await deleteUserById(userId);
                if (deleted) {
                    populateUserTable();
                } else {
                    console.error('Error deleting user');
                    alert('Fallo eliminando el usuario');
                }
            } catch (error) {
                console.error(error);
                alert('Fallo eliminando el usuario');
            }
        }
    };

    const handleEdit = (userId) => {
        window.location.href = `/users/edit-user?id=${userId}`;
    };

    const deleteUserById = async (id) => {
        try {
            const response = await fetch(`${backendUrl}/api/auth/deleteUserById/${id}`, {
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
            populateUserTable(pageNumber, searchTerm);
        });

        paginationElement.appendChild(pageButton);
    }, [currentPage, searchTerm, populateUserTable]);

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
                <title>Usuarios</title>
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
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        id="goBack-button"
                                        onClick={() => {
                                            if (isLoggedIn()) {
                                                window.location.href = '/main-menu';
                                            } else {
                                                logout();
                                            }
                                        }}
                                    >
                                        <i className="bi bi-arrow-90deg-left"></i> Regresar
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        id="add-user-button"
                                        onClick={() => {
                                            if (isLoggedIn()) {
                                                window.location.href = 'add-users';
                                            } else {
                                                logout();
                                            }
                                        }}
                                    >
                                        Agregar <i className="bi bi-plus"></i>
                                    </button>
                                </div>
                                <div className="ms-auto">
                                    <input
                                        className="form-control"
                                        id="userSearchInput"
                                        type="text"
                                        placeholder="Buscar usuario..."
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
                                                <th>Email</th>
                                                <th>Cédula</th>
                                                <th>Rol</th>
                                                <th id="acciones">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody id="user-table-body">
                                            {users.length === 0 ? (
                                                <tr>
                                                    <td colSpan="5">No users found.</td>
                                                </tr>
                                            ) : (
                                                users.map(user => (
                                                    <tr key={user.id}>
                                                        <td>{user.name}</td>
                                                        <td>{user.email}</td>
                                                        <td>{user.cedula}</td>
                                                        <td>{user.roleDetails.nombre}</td>
                                                        <td id="acciones">
                                                            <button
                                                                className="btn btn-danger btn-sm delete-user"
                                                                onClick={() => handleDelete(user.id)}
                                                            >
                                                                <i className="bi bi-trash"></i>
                                                            </button>
                                                            <a>   </a>
                                                            <button
                                                                className="btn btn-warning btn-sm edit-user"
                                                                onClick={() => handleEdit(user.id)}
                                                            >
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

export default ListUsers;