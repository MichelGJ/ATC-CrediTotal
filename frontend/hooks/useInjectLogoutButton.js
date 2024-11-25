import { useEffect } from 'react';
import { useAuth } from '../services/auth';

export const useInjectLogoutButton = () => {
    const { logout } = useAuth();
    useEffect(() => {
        const topBars = document.getElementsByClassName('top-bar');

        if (topBars.length > 0) {
            const logoutButton = document.createElement('button');
            logoutButton.id = 'logout-button';
            logoutButton.classList.add('logout-btn');
            logoutButton.innerText = 'Cerrar Sesión';

            const backButton = document.createElement('button');
            const img = document.createElement('img');
            img.src = '/images/goback.png';
            backButton.id = 'back-button';
            backButton.classList.add('back-btn');
            backButton.prepend(img);

            Array.from(topBars).forEach(topBar => {
                topBar.appendChild(backButton);
                topBar.appendChild(logoutButton);

                const logo = topBar.querySelector('.logo');
                if (logo) {
                    const logoLink = document.createElement('a');
                    logoLink.href = '/main-menu';
                    logoLink.classList.add('logo-link');
                    logoLink.appendChild(logo.cloneNode(true));
                    logo.replaceWith(logoLink);
                }
            });

            logoutButton.addEventListener('click', () => {
                logout();
            });

            backButton.addEventListener('click', () => {
                window.history.back();
            });
        } else {
            console.error('No top bars found with the class "top-bar"');
        }
    }, [logout]);
};
