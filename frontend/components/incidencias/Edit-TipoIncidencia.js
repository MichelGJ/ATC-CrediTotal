/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useAuth } from '../../services/auth';
import { useInjectLogoutButton } from '../../hooks/useInjectLogoutButton';

const EditTipoIncidencia = ({ idTipo }) => {
    const [nombre, setNombre] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);
    const { protectPage } = useAuth();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    const fetchTipoIncidencia = useCallback(async () => {
        try {
            const response = await fetch(`${backendUrl}/api/incidencia/getTipoIncidenciaById/${idTipo}`);
            if (!response.ok) {
                throw new Error(`Fetch failed with status ${response.status}`);
            }
            const data = await response.json();
            setNombre(data.name);
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('Hubo un error al cargar los datos. Intente nuevamente más tarde.');
        }
    }, [backendUrl, idTipo]);

    useEffect(() => {
        protectPage();
        fetchTipoIncidencia();
    }, [protectPage, fetchTipoIncidencia]);

    const validateForm = useCallback(() => {
        setIsFormValid(nombre.trim() !== '');
    }, [nombre]);

    useEffect(() => {
        validateForm();
    }, [nombre, validateForm]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const userData = {
            id: idTipo,
            name: nombre,
        };

        try {
            const response = await fetch(`${backendUrl}/api/incidencia/updateTipoIncidencia`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            const result = await response.json();

            if (response.ok) {
                alert('Actualización exitosa!');
                router.push('/incidencias/list-tipoIncidencia');
            } else {
                alert(`Error en actualizacion: ${result.error || 'Error desconocido'}`);
            }
        } catch (error) {
            console.error('Error en la actualización:', error);
            alert('Hubo un error en la actualización. Intente nuevamente más tarde.');
        }
    };

    useInjectLogoutButton();

    return (
        <div>
            <Head>
                <title>Editar Tipo de Incidencia</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>

            <div className="top-bar" id="top-bar-register">
                <img src="/images/banner.png" alt="Company Logo" className="logo" />
            </div>

            <div className="registration-container">
                <form id="register-form" onSubmit={handleSubmit}>
                    <h3 className="mb-4 text-center">Editar Tipo de Incidencia</h3>
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control"
                            id="fullName"
                            placeholder="Nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary btn-register w-100" disabled={!isFormValid}>
                        Guardar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditTipoIncidencia;