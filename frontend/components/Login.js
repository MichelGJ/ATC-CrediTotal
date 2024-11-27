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
    }, [isLoggedIn, router]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (email === '' || password === '') {
            setError('Por favor introducir correo y contraseña.');
        } else {
            setError('');
            try {
                await loginUser(email, password);
            } catch (error) {
                setError(error.message);
            }
        }
    };
    
    return (
        <div className="body-login">
            <Head>
                <title>Login</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
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
                    <div className="d-flex justify-content-between mt-3">
                        <a className="btn btn-primary btn-public" href="public">Pantalla pública</a>
                        <a className="btn btn-primary btn-new-ticket" href="new-ticket">Crear Tickets</a>
                    </div>
                </form>
            </div>


        </div>
    );
};

export default Login;