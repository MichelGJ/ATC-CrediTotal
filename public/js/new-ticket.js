const currentTicketLbl = document.querySelector('#lbl-new-ticket');
const currentCedulaLbl = document.querySelector('#lbl-new-cedula');
const createTicketBtn = document.querySelector('#generateTicketBtn');
const cedulaCliente = document.querySelector('#userId');
const result = document.querySelector("#result-ticket")
let timeoutId;

async function getLastTicket() {
    const lastTicket = await fetch('/api/ticket/last').then(resp => resp.json());
}

async function createTicket() {
    const userId = cedulaCliente.value;

    if (!userId) {
        alert('Por favor, ingrese su cédula de identidad.'); // Alert if userId is empty
        return;
    }

    try {
        const resultTicket = document.getElementById("result-ticket");
        const response = await fetch('/api/ticket', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Set the content type to application/json
            },
            body: JSON.stringify({ userId: userId })
        });

        const result = await response.json();

        // Check if the response has any errors (such as validation)
        if (!response.ok) {
            throw new Error(result.error || 'Error creating ticket');
        }

        
        currentTicketLbl.innerText = `Ticket número: ${result.number}`;
        currentCedulaLbl.innerText = `Cédula: ${result.cedula}`;
        resultTicket.style.display = 'block';

        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(() => {
            currentTicketLbl.innerText = '';
            currentCedulaLbl.innerText = '';
            resultTicket.style.display = 'none';
        }, 5000);

    } catch (error) {
        console.error('Error creando el ticket:', error);
        alert(`Error creando el ticket: ${error.message}`);
    }
}

// createTicketBtn.addEventListener('click', createTicket);
createTicketBtn.addEventListener('click', function (event) {
    event.preventDefault(); // Prevent form from submitting
    createTicket(); // Call your custom function
});

getLastTicket();