const lblPending = document.querySelector('#lbl-pending');
const deskHeader = document.querySelector('#mesaNumber');
// const cedulaCliente = document.querySelector('#cedulaCliente');
const noMoreAlert = document.querySelector('.alert');
const btnDraw = document.querySelector('#btn-draw');
const btnDone = document.querySelector('#btn-done');
const lblCurrentTicket = document.querySelector('#ticketNumber');
const personInfoBox = document.getElementById('person-info');
const descripcionField = document.getElementById('descripcion');
const tipoDropdown = document.getElementById('dynamic-dropdown-tipo1');
const resultadoField = document.getElementById('dynamic-dropdown-tipo3');
const idField = document.getElementById('ticket-id');
const token = localStorage.getItem('token');

const searchParams = new URLSearchParams(window.location.search);

let envsData;

if (!searchParams.has('mesa')) {
    window.location = 'index.html';
    throw new Error('Mesa es requerida');
}

const deskNumber = searchParams.get('mesa');
let workingTicket = null;

deskHeader.innerText = deskNumber;

function checkTicketCount(currentCount = 0) {
    if (currentCount === 0) {
        noMoreAlert.classList.remove('d-none');
        lblPending.classList.add('d-none');
    } else {
        noMoreAlert.classList.add('d-none');
        lblPending.classList.remove('d-none');
    }
    lblPending.innerHTML = currentCount;
}


async function loadInitialCount() {
    const pendingTickets = await fetch('/api/ticket/pending').then(resp => resp.json());
    checkTicketCount(pendingTickets.length);
}

async function loadEnvs() {
    const envs = await fetch(`/api/envs/`)
    envsData = await envs.json();
}

async function getTicket() {

    const { status, ticket, message } = await fetch(`/api/ticket/draw/${deskNumber}`)
        .then(resp => resp.json());
    if (status === 'error') {
        lblCurrentTicket.innerText = message;
        cedulaCliente.innerText = '....';
    }

    await registerTicket(ticket.cedula);
    response = await getClient(ticket.cedula);

    if (!response.ok) {
        personInfoBox.style.display = 'block';
        personInfoBox.innerHTML = 'Error obteniendo informacion del cliente';
    } else {
        const cliente = await response.json();

        if (!cliente.code) {
            personInfoBox.style.display = 'block'; // Show the box if it's hidden
            personInfoBox.innerHTML = `
            <h4>Cédula: ${cliente.person.code_identity || ''}${cliente.person.identity || ''}</h4>
            <h4>Nombre: ${cliente.person.name.toUpperCase() || ''} ${cliente.person.second_name?.toUpperCase() || ''} ${cliente.person.lastName.toUpperCase() || ''}  
            ${cliente.person.second_lastName?.toUpperCase() || ''}</h4>
            ${cliente.domiciled ?
                    `<h5>Domiciliado</h5>
                        <h5>Banco: ${cliente.domiciled_bank.name || ''}</h5>`
                    : ''}
            <h5>Link Backoffice: 
                <a href="${envsData.CONSOLA_URL}${cliente.person.code || ''}" target="_blank">
                    ${cliente.person.code ? 'Ver Perfil' : ''}
                </a>
            </h5>
            <h5>Correo: ${cliente.person.contacts[1].contact.toLowerCase() || ''}</h5>
            `;
        } else {
            personInfoBox.style.display = 'block';
            personInfoBox.innerHTML = 'Cliente no registrado';
            // personInfoBox.style.display = 'none';
        }
    }

    workingTicket = ticket;
    lblCurrentTicket.innerText = `ticket ${ticket.number}`;
    btnDone.disabled = false;
    descripcionField.disabled = false;
    populateTipoDropdowns();
    populateFixedDropdown();
    // cedulaCliente.innerText = ticket.cedula;
}

async function finishTicket() {
    if (!workingTicket) return;
    const { status, message } = await fetch(`/api/ticket/done/${workingTicket.id}`, {
        method: 'PUT'
    }).then(resp => resp.json());
    if (status === 'error') {
        lblCurrentTicket.innerText = message;
    }

    await updateTicket();

    if (status === 'ok') {
        workingTicket == null;
        lblCurrentTicket.innerText = '....';
        // cedulaCliente.innerText = '....';
        personInfoBox.style.display = 'none';
        descripcionField.value = '';
        descripcionField.disabled = true;
    }
    clearDropdowns();

}

async function getClient(cedula) {

    const response = await fetch(envsData.API_URL + cedula, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': envsData.AUTH_API
        },
    });

    return response;
}


async function registerTicket(cedula) {
    const cedulaCliente = cedula.trim();
    const decodedToken = jwt_decode(token);
    const userId = decodedToken.name || [];

    // Prepare user data to be sent
    const ticketData = {
        cedulaCliente: cedulaCliente,
        user: userId,
    };

    try {
        // Send a POST request to your registration API
        const response = await fetch(`api/atp/registerTicketPresencial`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ticketData), // Convert user data to JSON string
        });

        // Parse the response from the server
        const result = await response.json();
        
        idField.value = result.user.id;

        if (response.ok) {
            console.log('Registro exitoso');
        } else {
            // Handle server-side validation errors
            console.error('Error en el registro:', result);
        }
    } catch (error) {
        // Handle network or other errors
        console.error('Error en el registro:', error);
        alert('Hubo un error en el registro. Intente nuevamente más tarde.');
    }
}


async function updateTicket() {
    let descripcion = ' ';
    if (descripcionField.value !== '') {
        descripcion = descripcionField.value;
    }
    const resultado = resultadoField.value;
    const id = idField.value;

    // Prepare user data to be sent
    const ticketData = {
        id: id,
        resultado: resultado,
        descripcion: descripcion,
    };

    try {
        // Send a POST request to your registration API
        const response = await fetch(`api/atp/updateTicketPresencial`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ticketData), // Convert user data to JSON string
        });

        // Parse the response from the server
        const result = await response.json();

        if (response.ok) {
            // Handle successful registration
            console.log('Actualización exitoso:', result);
        } else {
            // Handle server-side validation errors
            console.error('Error en la actualización:', result);
        }
    } catch (error) {
        // Handle network or other errors
        console.error('Error en la actualización:', error);
        alert('Hubo un error en la actualización. Intente nuevamente más tarde.');
    }
}

function connectToWebSockets() {

    const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
    const host = window.location.host; // This gives you 'localhost:3000' for local or your production domain.
    const wsUrl = `${protocol}${host}/ws`;

    const socket = new WebSocket(wsUrl);

    socket.onmessage = (event) => {
        console.log(event.data);
        const { type, payload } = JSON.parse(event.data);
        if (type !== 'on-ticket-count-changed') return;
        checkTicketCount(payload);
    };

    socket.onclose = (event) => {
        console.log('Connection closed');
        setTimeout(() => {
            console.log('retrying to connect');
            connectToWebSockets();
        }, 1500);

    };

    socket.onopen = (event) => {
        console.log('Connected');
    };

}

// Fetch and populate the dropdowns with tipo and subtipo data
async function populateTipoDropdowns() {
    try {
        // Fetch tipo data
        const tipoResponse = await fetch('api/incidencia/getAllTipoIncidencia');
        const { listaTipos, currentPage, totalPages } = await tipoResponse.json();
        // Populate tipo dropdown

        listaTipos.forEach(tipo => {
            const option = document.createElement('option');
            option.value = tipo.id;
            option.textContent = tipo.name;
            tipoDropdown.appendChild(option);
        });


    } catch (error) {
        console.error('Error fetching dropdown data:', error);
    }
}

function populateFixedDropdown() {
    const fixedValues = [
        { value: 'Resuelto', text: 'Resuelto' },
        { value: 'Se fue', text: 'Se fue' },
        { value: 'No Resuelto', text: 'No Resuelto' }
    ];

    fixedValues.forEach(item => {
        const option = document.createElement('option');
        option.value = item.value;
        option.textContent = item.text;
        resultadoField.appendChild(option);
    });
}

function clearDropdowns() {
    const tipoDropdown = document.getElementById('dynamic-dropdown-tipo1');
    const subtipoDropdown = document.getElementById('dynamic-dropdown-tipo2');
    const fixedDropdown = document.getElementById('dynamic-dropdown-tipo3');

    tipoDropdown.innerHTML = '<option value="" disabled selected>Seleccione un tipo</option>';
    subtipoDropdown.innerHTML = '<option value="" disabled selected>Seleccione un subtipo</option>';
    fixedDropdown.innerHTML = '<option value="" disabled selected>Seleccione un estatus</option>';
}


btnDraw.addEventListener('click', () => {
    if (personInfoBox.style.display !== 'none') {
        if (validateForm()) {
            finishTicket();
            getTicket();
        }
    } else {
        getTicket();
    }
});

btnDone.addEventListener('click', () => {
    if (validateForm()) {
        finishTicket();
    }
});

tipoDropdown.addEventListener('change', async (event) => {
    const idTipo = event.target.value;

    const subtipoDropdown = document.getElementById('dynamic-dropdown-tipo2');

    subtipoDropdown.innerHTML = '<option value="" disabled selected>Seleccione un subtipo</option>';

    const subtipoResponse = await fetch(`api/incidencia/getAllSubTipoIncidenciaByTipoIncidencia?idTipo=${idTipo}`);
    const { listaSubTipos, currentPage, totalPages } = await subtipoResponse.json();
    listaSubTipos.forEach(subtipo => {
        const option = document.createElement('option');
        option.value = subtipo.id;
        option.textContent = subtipo.name;
        subtipoDropdown.appendChild(option);
    });
});

function validateForm() {
    const tipo1 = document.getElementById('dynamic-dropdown-tipo1').value;
    const tipo2 = document.getElementById('dynamic-dropdown-tipo2').value;
    const tipo3 = document.getElementById('dynamic-dropdown-tipo3').value;
    const descripcion = document.getElementById('descripcion').value;

    if (!tipo1 || !tipo2 || !tipo3 || !descripcion) {
        alert('Todos los campos son obligatorios.');
        return false;
    } else {
        console.log('Form is valid. Proceeding with action...');
    }
    return true;
}

descripcionField.disabled = true;
btnDone.disabled = true;
loadInitialCount();
loadEnvs();
connectToWebSockets();