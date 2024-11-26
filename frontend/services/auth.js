/* eslint-disable @typescript-eslint/no-unused-vars */
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/router';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';

const AuthContext = createContext();

const getTokenAndDecode = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    return jwtDecode(token);
};

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const router = useRouter();

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        setUser(null);
        router.push('/');
    }, [router]);
    
    useEffect(() => {
        const decodedToken = getTokenAndDecode();
        if (decodedToken) {
            const currentTime = Date.now() / 1000;
            if (decodedToken.exp > currentTime) {
                getUserById(decodedToken.id).then(setUser);
            } else {
                logout();
            }
        }
    }, [logout]);

    

    const loginUser = async (email, password) => {
        const apiUrl = `http://localhost:3000/api/auth/login`;
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const data = await response.json();


            if (response.ok) {
                localStorage.setItem('token', data.token);
                const decodedToken = getTokenAndDecode();
                const userData = await getUserById(decodedToken.id); // Use a new variable
                setUser(userData);
                router.push('/main-menu');
            } else {
                throw new Error('Usuario o contraseña errada');
            }
        } catch (error) {
            console.log(error);
            throw new Error('Error de comunicación');
        }
    };

    const isLoggedIn = () => {
        const decodedToken = getTokenAndDecode();
        if (!decodedToken) return false;

        const currentTime = Date.now() / 1000;

        return decodedToken.exp > currentTime;
    };

    const protectPage = () => {
        if (!isLoggedIn()) {
            logout();
        }
    };

    return (
        <AuthContext.Provider value={{ user, logout, isLoggedIn, protectPage, loginUser }}>
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

