const registerForm = document.querySelector('#register-form');



async function registerTipoIncidencia(event) {
    event.preventDefault();

    const name = nameField.value.trim();

    const userData = {
        name: name,
    };

    console.log(userData);

    try {
        const response = await fetch(`api/incidencia/registerTipoIncidencia`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        const result = await response.json();
        console.log({ userData });

        if (response.ok) {
            alert('Registro exitoso!');
            window.location.href = 'list-tipoIncidencia.html';
        } else {
            alert(`Error en actualizacion: ${result.error || 'Error desconocido'}`);
        }
    } catch (error) {
        console.error('Error en el registro:', error);
        alert('Hubo un error en el registro. Intente nuevamente más tarde.');
    }
}



nameField.addEventListener('input', function () {
    userValidation.validateFormTipoIncidencia();
});


registerForm.addEventListener('submit', registerTipoIncidencia);
registerButton.disabled = true;