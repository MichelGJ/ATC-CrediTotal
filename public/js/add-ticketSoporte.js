const registerForm = document.querySelector('#register-form');
const registerButton = document.querySelector('.btn-register');
const dropdownTipo = document.getElementById('dynamic-dropdown-tipo');
const dropdownSubTipo = document.getElementById('dynamic-dropdown-subtipo');
const descripcionField = document.getElementById('descripcion');
const cedulaField = document.getElementById('cedulaCliente');
const token = localStorage.getItem('token');


// Send ticket data to the server
async function sendTicketData(ticketData) {
    try {
        const response = await fetch(`api/incidencia/registerTicketSoporte`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ticketData),
        });

        const result = await response.json();
        if (response.ok) {
            return result;
        } else {
            throw new Error(result.error || 'Error desconocido');
        }
    } catch (error) {
        throw new Error('Hubo un error en el registro. Intente nuevamente más tarde.');
    }
}

// Registration submission
async function registerTicket(event) {
    event.preventDefault();

    const descripcion = descripcionField.value.trim();
    const cedulaCliente = cedulaField.value.trim();
    const tipo = dropdownTipo.value;
    const subtipo = dropdownSubTipo.value;

    if (!token) {
        alert('Token no encontrado. Por favor, inicie sesión.');
        return;
    }

    let decodedToken;
    try {
        decodedToken = jwt_decode(token);
    } catch (error) {
        alert('Token inválido. Por favor, inicie sesión nuevamente.');
        return;
    }

    const userId = decodedToken.id;

    const ticketData = {
        tipoIncidenciaId: tipo,
        subTipoIncidenciaId: subtipo,
        descripcion: descripcion,
        cedulaCliente: cedulaCliente,
        estatus: "Abierto",
        userId: userId,
    };

    try {
        await sendTicketData(ticketData);
        dropdownTipo.value = '';
        dropdownSubTipo.value = '';
        cedulaField.value = '';
        descripcionField.value = '';
        alert('Ticket Abierto!');
    } catch (error) {
        console.error('Error en el registro:', error);
        alert(error.message);
    }
}

function validateFormTicket() {
    const descripcion = descripcionField.value.trim();
    const cedula = cedulaField.value.trim();
    const tipo = dropdownTipo.value;
    const subTipo = dropdownSubTipo.value.trim();

    let condicion;
    condicion = descripcion && cedula && this.isCedulaValid(cedula) && tipo !== "" && subTipo !== ""
    if (condicion) {
        registerButton.disabled = false;
    } else {
        registerButton.disabled = true;
    }
}

function isCedulaValid(cedula) {
    const cedulaPattern = /^\d+$/;
    return cedulaPattern.test(cedula);
}

async function fetchDataTipo() {
    const response = await fetch('api/incidencia/getAllTipoIncidencia');
    const data = await response.json();
    return data;
}

async function populateDropdownTipo() {
    const dropdown = document.getElementById('dynamic-dropdown-tipo');
    const { listaTipos, currentPage, totalPages } = await fetchDataTipo();
    listaTipos.forEach(item => {
        // Create a new option element
        const newOption = document.createElement('option');
        newOption.value = item.id;
        newOption.textContent = item.name;
        // Add the option to the dropdown
        dropdown.appendChild(newOption);
    });
}

async function fetchDataSubTipo(idTipo) {
    const response = await fetch(`api/incidencia/getAllSubTipoIncidenciaByTipoIncidencia?idTipo=${idTipo}`);
    const data = await response.json();
    return data;
}

async function populateDropdownSubTipo(idTipo) {
    const { listaSubTipos, currentPage, totalPages } = await fetchDataSubTipo(idTipo);
    if (listaSubTipos.length != 0) {
        listaSubTipos.forEach(item => {
            // Create a new option element
            const newOption = document.createElement('option');
            newOption.value = item.id;
            newOption.textContent = item.name;
            // Add the option to the dropdown
            dropdownSubTipo.appendChild(newOption);
        });
    }
}


document.addEventListener('DOMContentLoaded', populateDropdownTipo);

dropdownTipo.addEventListener('change', function () {
    dropdownSubTipo.innerHTML = '<option value="">Seleccione Subtipo</option>';
    const selectedTipoId = dropdownTipo.value;
    if (selectedTipoId) {
        populateDropdownSubTipo(selectedTipoId);
    } else {
        dropdownSubTipo.innerHTML = '<option value="">Seleccione Subtipo</option>';
    }
    validateFormTicket();
});


dropdownTipo.addEventListener('change', function () {
    validateFormTicket();
});
dropdownSubTipo.addEventListener('change', function () {
    validateFormTicket();
});
descripcionField.addEventListener('input', function () {
    validateFormTicket();
});
cedulaField.addEventListener('input', function () {
    validateFormTicket();
});

registerForm.addEventListener('submit', registerTicket);


registerButton.disabled = true;