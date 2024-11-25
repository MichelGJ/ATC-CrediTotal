import React, { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useAuth, useInjectLogoutButton } from '../services/auth';

const MainMenu = () => {
    const router = useRouter();
    const { user, isLoggedIn, logout, protectPage } = useAuth();

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
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" />
            </Head>

            <div className="top-bar">
                <Image src="/images/banner.png" alt="Company Logo" className="logo" width={500} height={150} />
            </div>

            <div className="buttons-container">
                <div className="option-button atp-option hidden" id="atp-button" onClick={() => handleButtonClick('desk1.html')}>
                    <div className="text-overlay">Atención presencial</div>
                    <Image src="/images/atp.png" className="atp-logo" alt="Atención presencial" width={100} height={100} />
                </div>
                <div className="option-button reportar-option hidden" id="incidencias-button" onClick={() => handleButtonClick('menu-incidencias.html')}>
                    <div className="text-overlay">Incidencias</div>
                    <Image src="/images/incident.png" className="reportar-logo" alt="Incidencias" width={100} height={100} />
                </div>
                <div className="option-button usuarios-option hidden" id="usuarios-button" onClick={() => handleButtonClick('list-users.html')}>
                    <div className="text-overlay">Gestión de usuarios</div>
                    <Image src="/images/users.png" className="usuarios-logo" alt="Gestión de usuarios" width={100} height={100} />
                </div>
            </div>
        </div>
    );
};

export default MainMenu;