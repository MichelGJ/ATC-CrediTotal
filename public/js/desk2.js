const lblPending = document.querySelector('#lbl-pending');
const deskHeader = document.querySelector('#mesaNumber');
// const cedulaCliente = document.querySelector('#cedulaCliente');
const noMoreAlert = document.querySelector('.alert');
const btnDraw = document.querySelector('#btn-draw');
const btnDone = document.querySelector('#btn-done');
const lblCurrentTicket = document.querySelector('#ticketNumber');
const personInfoBox = document.getElementById('person-info');
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
    await finishTicket();
   

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

    if (status === 'ok') {
        workingTicket == null;
        lblCurrentTicket.innerText = '....';
        // cedulaCliente.innerText = '....';
        personInfoBox.style.display = 'none';
    }
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
    const userId = decodedToken.id || [];

    // Prepare user data to be sent
    const ticketData = {
        cedulaCliente: cedulaCliente,
        userId: userId,
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

        // Log the result to inspect its structure
        console.log('Server response:', result);

        if (response.ok) {
            // Handle successful registration
            console.log('Registro exitoso:', result);
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

btnDraw.addEventListener('click', getTicket);
btnDone.addEventListener('click', finishTicket);

loadInitialCount();
loadEnvs();
connectToWebSockets();