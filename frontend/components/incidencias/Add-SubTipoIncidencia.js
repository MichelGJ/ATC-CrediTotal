/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useAuth } from '../../services/auth';
import { useInjectLogoutButton } from '../../hooks/useInjectLogoutButton';

const AddSubTipoIncidencia = ({ idTipo }) => {
    const [nombre, setNombre] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);
    const { protectPage } = useAuth();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;


    const validateForm = useCallback(() => {
        setIsFormValid(nombre.trim() !== '');
    }, [nombre]);

    useEffect(() => {
        protectPage();
        validateForm();
    }, [nombre, protectPage, validateForm]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const userData = {
            name: nombre,
            tipoIncidenciaId: idTipo,
        };

        try {
            const response = await fetch(`${backendUrl}/api/incidencia/registerSubTipoIncidencia`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            const result = await response.json();

            if (response.ok) {
                alert('Registro exitoso!');
                window.location.href = `/incidencias/list-subTipoIncidencia?idTipo=${idTipo}`;
            } else {
                alert(`Error en actualizacion: ${result.error || 'Error desconocido'}`);
            }
        } catch (error) {
            console.error('Error en el registro:', error);
            alert('Hubo un error en el registro. Intente nuevamente más tarde.');
        }
    };

    useInjectLogoutButton();

    return (
        <div>
            <Head>
                <title>Registro Subtipo Incidencia</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>

            <div className="top-bar" id="top-bar-register">
                <img src="/images/banner.png" alt="Company Logo" className="logo" />
            </div>

            <div className="registration-container">
                <form id="register-form" onSubmit={handleSubmit}>
                    <h3 className="mb-4 text-center">Agregar Subtipo de Incidencia</h3>
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

export default AddSubTipoIncidencia;