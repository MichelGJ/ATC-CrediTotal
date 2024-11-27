/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/style.css';
import { useInjectLogoutButton } from '../hooks/useInjectLogoutButton';

const EditUser = ({ userId }) => {
    const [fullName, setFullName] = useState('');
    const [cedulaUsuario, setCedulaUsuario] = useState('');
    const [role, setRole] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [roles, setRoles] = useState([]);
    const [passwordHelp, setPasswordHelp] = useState('');
    const [emailHelp, setEmailHelp] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);
    const [cedulaHelp, setCedulaHelp] = useState('');
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const allowedDomains = ['totalmundo.com', 'creditotal.com'];

    useEffect(() => {
        // Fetch roles from the backend and populate the dropdown
        const fetchRoles = async () => {
            try {
                const response = await fetch(`${backendUrl}/api/auth/getRoles`);
                const data = await response.json();
                setRoles(data);
            } catch (error) {
                console.error('Error fetching roles:', error);
            }
        };

        // Fetch user data from the backend
        const fetchUserData = async () => {
            try {
                const response = await fetch(`${backendUrl}/api/auth/getUserById/${userId}`);
                const data = await response.json();
                setFullName(data.name);
                setCedulaUsuario(data.cedula);
                setRole(data.role);
                setEmail(data.email);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchRoles();
        fetchUserData();
    }, [backendUrl, userId]);

    const validateForm = useCallback(() => {
        const isValid = fullName && cedulaUsuario && role && email && (!password || password === confirmPassword) && !passwordHelp && !emailHelp && !cedulaHelp;
        setIsFormValid(isValid);
    }, [fullName, cedulaUsuario, role, email, password, confirmPassword, passwordHelp, emailHelp, cedulaHelp]);

    useEffect(() => {
        validateForm();
    }, [fullName, cedulaUsuario, role, email, password, confirmPassword, validateForm]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            setPasswordHelp('Las contraseñas no coinciden.');
            return;
        }

        const userData = {
            id: userId,
            name: fullName,
            cedula: cedulaUsuario,
            email: email,
            password: password,
            role: role,
        };

        try {
            const response = await fetch(`${backendUrl}/api/auth/updateUser/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            const result = await response.json();

            if (response.ok) {
                alert('Usuario actualizado con éxito');
                window.location.href = '/list-users';
            } else {
                alert(`Error actualizando el usuario: ${result.error || 'Error desconocido'}`);
                setPassword('');
                setConfirmPassword('');
                setPasswordHelp('');
                setEmailHelp('');
            }
        } catch (error) {
            console.error('Error actualizando el usuario:', error);
            alert('Hubo un error actualizando el usuario. Intente nuevamente más tarde.');
            setPassword('');
            setConfirmPassword('');
            setPasswordHelp('');
            setEmailHelp('');
        }
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        // checkPasswordMatch(e.target.value, confirmPassword);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        checkPasswordMatch(password, e.target.value);
    };

    const checkPasswordMatch = (password, confirmPassword) => {
        if (password !== confirmPassword) {
            setPasswordHelp('Las contraseñas no coinciden.');
        } else {
            setPasswordHelp('');
        }
        validateForm();
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        checkEmail(e.target.value);
    };

    const checkEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setEmailHelp('Correo electrónico no válido.');
        } else {
            const domain = email.split('@')[1];
            if (!allowedDomains.includes(domain)) {
                setEmailHelp('Correo electrónico debe ser de dominio totalmundo.com o creditotal.com.');
            } else {
                setEmailHelp('');
            }
        }
        validateForm();
    };

    const handleCedulaChange = (e) => {
        const value = e.target.value;
        if (/^\d{0,8}$/.test(value)) {
            setCedulaUsuario(value);
            setCedulaHelp('');
        } else {
            setCedulaHelp('Cédula debe ser numérica y tener un máximo de 8 dígitos.');
        }
        validateForm();
    };

    useInjectLogoutButton();

    return (
        <div>
            <Head>
                <title>Editar Usuario</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>

            <div className="top-bar" id="top-bar-register">
                <img src="/images/banner.png" alt="Company Logo" className="logo" />
            </div>

            <div className="registration-container">
                <form id="register-form" onSubmit={handleSubmit}>
                    <h3 className="mb-4 text-center">Editar Usuario</h3>
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control"
                            id="fullName"
                            placeholder="Nombre completo"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control"
                            id="cedulaUsuario"
                            placeholder="Cédula"
                            value={cedulaUsuario}
                            onChange={handleCedulaChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <select
                            id="dynamic-dropdown"
                            className="form-select"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            required
                        >
                            <option value="">Seleccione un Rol</option>
                            {roles.map((role) => (
                                <option key={role.id} value={role.id}>
                                    {role.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            placeholder="Correo electrónico"
                            value={email}
                            onChange={handleEmailChange}
                            required
                        />
                        <small id="emailHelp" className="form-text text-danger">{emailHelp}</small>
                    </div>
                    <div className="mb-3">
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={handlePasswordChange}
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="password"
                            className="form-control"
                            id="confirmPassword"
                            placeholder="Confirmar contraseña"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                        />
                        <small id="passwordHelp" className="form-text text-danger">{passwordHelp}</small>
                    </div>
                    <button type="submit" className="btn btn-primary btn-register w-100" disabled={!isFormValid}>
                        Guardar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditUser;