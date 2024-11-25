/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import {useRouter} from 'next/router';
import 'bootstrap/dist/css/bootstrap.min.css';
// import Script from 'next/script';
import '../styles/style.css';
import { useAuth } from '../services/auth';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const { loginUser, isLoggedIn } = useAuth();

    useEffect(() => {
        if (isLoggedIn()) {
            router.push('/main-menu');
        }
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Perform login logic here
        console.log('Email:', email);
        console.log('Password:', password);

        // Example: Set error message if login fails
        if (email === '' || password === '') {
            setError('Por favor introducir correo y contraseña.');
        } else {
            setError('');
            await loginUser(email, password);
        }
    };

    // const loginUser = async (email, password) => {
    //     const apiUrl = `http://localhost:3000/api/auth/login`;
    //     try {
    //         const response = await fetch(apiUrl, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify({
    //                 email: email,
    //                 password: password
    //             })
    //         });

    //         const data = await response.json();

    //         if (response.ok) {
    //             localStorage.setItem('token', data.token);
    //             router.push('/main-menu');
    //         } else {
    //             setError('Usuario o contraseña errada');
    //         }
    //     } catch (error) {
    //         setError('Error de comunicacion');
    //     }
    // };

    // const isLoggedIn = () => {
    //     const token = localStorage.getItem('token');
    //     return !!token;
    // };
    
    return (
        <div className="body-login">
            <Head>
                <title>Login</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" />
            </Head>

            <div className="login-container">
                <div className="logo-box-login">
                    <img src="/images/banner.png" alt="Company Logo" className="logo-login" />
                </div>

                <form id="loginForm" onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input
                            type="email"
                            id="email"
                            className="form-control"
                            placeholder="Correo electrónico"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            id="password"
                            className="form-control"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <small id="invalidLoginHelp" className="form-text text-danger">{error}</small>
                    </div>
                    <button type="submit" className="btn btn-primary btn-login">Acceder</button>
                    <div className="extra-links">
                        <a href="#">Olvide contraseña</a>
                    </div>
                    <div className="d-flex justify-content-between mt-3">
                        <a className="btn btn-primary btn-public" href="public.html">Pantalla pública</a>
                        <a className="btn btn-primary btn-new-ticket" href="new-ticket.html">Crear Tickets</a>
                    </div>
                </form>
            </div>

            {/* <Script src="/js/login.js" strategy="lazyOnload"></Script> */}
        </div>
    );
};

export default Login;