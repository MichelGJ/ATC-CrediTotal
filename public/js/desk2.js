const lblPending = document.querySelector('#lbl-pending');
const deskHeader = document.querySelector('#mesaNumber');
// const cedulaCliente = document.querySelector('#cedulaCliente');
const noMoreAlert = document.querySelector('.alert');
const btnDraw = document.querySelector('#btn-draw');
const btnDone = document.querySelector('#btn-done');
const lblCurrentTicket = document.querySelector('#ticketNumber');
const personInfoBox = document.getElementById('person-info');

const searchParams = new URLSearchParams(window.location.search);

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

async function getTicket() {
    await finishTicket();

    const { status, ticket, message } = await fetch(`/api/ticket/draw/${deskNumber}`)
        .then(resp => resp.json());
    if (status === 'error') {
        lblCurrentTicket.innerText = message;
        cedulaCliente.innerText = '....';
    }

    const response = await fetch(`https://staging-api.creditotal.online/api/integration/customer_info_by_id?identity=V${ticket.cedula}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'YXBpY2hhdGJvdDo0cDFjaDR0YjB0Kg=='
        },
    });

    const cliente = await response.json();
    console.log(cliente);

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
            <a href="https://staging-console.creditotal.online/console/person/profile/${cliente.person.code || ''}" target="_blank">
                ${cliente.person.code ? 'Ver Perfil' : ''}
            </a>
        </h5>
        <h5>Correo: ${cliente.person.contacts[1].contact.toLowerCase() || ''}</h5>
        `;
    }else{
        personInfoBox.style.display = 'block'; 
        personInfoBox.innerHTML = 'Cliente no registrado';
        // personInfoBox.style.display = 'none';
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
connectToWebSockets();