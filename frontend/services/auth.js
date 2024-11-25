import {jwtDecode} from 'jwt-decode';
import { useRouter } from 'next/router';
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            const currentTime = Date.now() / 1000;

            if (decodedToken.exp > currentTime) {
                getUserById(decodedToken.id).then(setUser);
            } else {
                logout();
            }
        }
    }, []);

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        router.push('/');
    };

    const isLoggedIn = () => {
        const token = localStorage.getItem('token');
        if (!token) return false;

        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        return decodedToken.exp > currentTime;
    };

    const protectPage = () => {
        if (!isLoggedIn()) {
            logout();
        }
    };

    return (
        <AuthContext.Provider value={{ user, logout, isLoggedIn, protectPage }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

const getUserById = async (id) => {
    try {
        const response = await fetch(`http://localhost:3000/api/auth/getUserById/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error('Error fetching user data:', error);
    }
};

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
    }, []);
};