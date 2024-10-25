const idField = document.getElementById('user-id');
const registerForm = document.querySelector('#register-form');

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (id) {
        // Fetch user data based on userId
        const data = await fetch(`/api/incidencia/getTipoIncidenciaById/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const tipoIncidenciaData = await data.json();

        // Pre-fill form fields with user data
        idField.value = tipoIncidenciaData.id;
        nameField.value = tipoIncidenciaData.name;
    }
});

async function updateTipoIncidencia(event) {
    event.preventDefault();

    const id = idField.value.trim();
    const name = nameField.value.trim();

    const userData = {
        id: id,
        name: name,
    };

    console.log(userData);

    try {
        const response = await fetch(`api/incidencia/updateTipoIncidencia`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        const result = await response.json();
        console.log({ userData });

        if (response.ok) {
            alert('Actualizacion exitosa!');
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


registerForm.addEventListener('submit', updateTipoIncidencia);