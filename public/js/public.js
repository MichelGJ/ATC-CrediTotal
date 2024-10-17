
function renderTicket(tickets = []) {
    for (let i = 0; i < tickets.length; i++) {
        if (i >= 4) break;

        const ticket = tickets[i];
        if (!ticket) continue;

        const lblTicket = document.querySelector(`#lbl-ticket-0${i + 1}`);
        const lblDesk = document.querySelector(`#lbl-desk-0${i + 1}`);
        const lblCedula = document.querySelector(`#lbl-cedula-0${i + 1}`);

        lblTicket.innerText = `Ticket ${ticket.number}`;
        lblDesk.innerText = `Mesa ${ticket.handleAtDesk}`;
        lblCedula.innerText =  `Cédula ${ticket.cedula}`;
    }
}


async function loadInitialCount() {
    const workingOnTickets = await fetch('/api/ticket/working-on').then(resp => resp.json());
    renderTicket(workingOnTickets);
}



function connectToWebSockets() {

    const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
    const host = window.location.host; // This gives you 'localhost:3000' for local or your production domain.
    const wsUrl = `${protocol}${host}/ws`;

    const socket = new WebSocket(wsUrl);

    socket.onmessage = (event) => {
        console.log(event.data);
        const { type, payload } = JSON.parse(event.data);
        if (type !== 'on-working-changed') return;
        renderTicket(payload);
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

connectToWebSockets();

loadInitialCount();