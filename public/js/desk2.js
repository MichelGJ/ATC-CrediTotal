const lblPending = document.querySelector('#lbl-pending');
const deskHeader = document.querySelector('#mesaNumber');
const cedulaCliente = document.querySelector('#cedulaCliente');
const noMoreAlert = document.querySelector('.alert');
const btnDraw = document.querySelector('#btn-draw');
const btnDone = document.querySelector('#btn-done');
const lblCurrentTicket = document.querySelector('#ticketNumber')

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

    workingTicket = ticket;
    lblCurrentTicket.innerText = `ticket ${ticket.number}`;
    cedulaCliente.innerText = ticket.cedula;
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
        cedulaCliente.innerText = '....';
    }
}

function connectToWebSockets() {

    const socket = new WebSocket(`${window.env.WS_URL}`);

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