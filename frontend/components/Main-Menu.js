/* eslint-disable @next/next/no-img-element */
import React, { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '../services/auth';
import { useInjectLogoutButton } from '../hooks/useInjectLogoutButton';
import 'bootstrap/dist/css/bootstrap.min.css';

const MainMenu = () => {
    const router = useRouter();
    const { user, isLoggedIn, logout, protectPage } = useAuth();

    useEffect(() => {
        console.log('Environment Variables:', process.env.NEXT_PUBLIC_BACKEND_URL);
        protectPage();
    }, [protectPage]);

    useEffect(() => {
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
    }, [user]);

    useInjectLogoutButton();

    const handleButtonClick = (path) => {
        if (isLoggedIn()) {
            router.push(path);
        } else {
            logout(); // Logout if token is expired
        }
    };

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
                <div className="option-button atp-option hidden" id="atp-button" onClick={() => handleButtonClick('atp/desk1')}>
                    <div className="text-overlay">Atención presencial</div>
                    <img src="/images/atp.png" className="atp-logo" alt="Atención presencial" />
                </div>
                <div className="option-button reportar-option hidden" id="incidencias-button" onClick={() => handleButtonClick('incidencias/menu-incidencias')}>
                    <div className="text-overlay">Incidencias</div>
                    <img src="/images/incident.png" className="reportar-logo" alt="Incidencias" />
                </div>
                <div className="option-button usuarios-option hidden" id="usuarios-button" onClick={() => handleButtonClick('users/list-users')}>
                    <div className="text-overlay">Gestión de usuarios</div>
                    <img src="/images/users.png" className="usuarios-logo" alt="Gestión de usuarios" />
                </div>
            </div>
        </div>
    );
};

export default MainMenu;