const userTableBody = document.getElementById('user-table-body');
// const addUserButton = document.getElementById('add-user-button');
const searchInput = document.getElementById('userSearchInput');
const backButton = document.getElementById('goBack-button')
const token = localStorage.getItem('token');
let currentPage = 1;
const limit = 10; // Default users per page

async function fetchData(page = 1, search = '') {
    try {
        const response = await fetch(`api/incidencia/getAllTicketSoporte?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`);
        if (!response.ok) {
            throw new Error(`Fetch failed with status ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return { users: [], currentPage: 1, totalPages: 1 };
    }
}

async function populateTicketTable(page = 1, searchQuery = '') {
    try {
        const { listaTickets, currentPage, totalPages } = await fetchData(page, searchQuery);
        const decodedToken = jwt_decode(token);
        const user = await Auth.getUser(decodedToken.id);
        const userPermisos = user.roleDetails.permisos || [];
        userTableBody.innerHTML = '';

        if (listaTickets.length === 0) {
            userTableBody.innerHTML = '<tr><td colspan="7">No tickets found.</td></tr>';
            updatePaginationControls(currentPage, totalPages, searchQuery);
            return;
        }

        // Populate users
        listaTickets.forEach(ticket => {
            const row = document.createElement('tr');
            row.innerHTML = `
              <td>${ticket.tipoIncidenciaId || ''}</td>
              <td>${ticket.subTipoIncidenciaId || ''}</td>
              <td>${ticket.fecha || ''}</td>
              <td>${ticket.descripcion}</td>
              <td>${ticket.cedulaCliente}</td>
              <td>${ticket.estatus}</td>
              <td>${ticket.userId || ''}</td>
              <td id="acciones">
                ${ticket.estatus !== 'Cerrado' && userPermisos.includes('closeTicket') ?
                    `<button class="btn btn-success btn-sm close-ticket" data-id="${ticket.id}">
                    <i class="bi bi-check"></i>
                  </button>`
                    : ''}
              </td>`;
            userTableBody.appendChild(row);
        });

        updatePaginationControls(currentPage, totalPages, searchQuery);

        attachCloseHandlers();
        attachEditHandlers();
    } catch (error) {
        console.error('Error populating ticket table:', error);
    }
}

function attachCloseHandlers() {
    const closeButtons = document.querySelectorAll('.close-ticket');

    closeButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            const ticketId = button.getAttribute('data-id');

            // Confirm if the user wants to delete
            if (confirm('¿Está seguro de cerrar este ticket?')) {
                try {
                    const deleted = await closeTicket(ticketId);
                    if (deleted) {
                        populateTicketTable();
                    } else {
                        console.error('Error closing ticket:', error);
                        alert('Fallo cerrando el ticket');
                    }
                } catch (error) {
                    console.error(error);
                    alert('Fallo cerrando el ticket');
                }
            }
        });
    });
}

function attachEditHandlers() {
    const editButtons = document.querySelectorAll('.edit-user');

    editButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const userId = button.getAttribute('data-id');

            // Redirect to registration page with user ID in the query string
            window.location.href = `/edit-user.html?id=${userId}`;
        });
    });
}

function updatePaginationControls(currentPage, totalPages, searchQuery = '') {
    const paginationElement = document.getElementById('pagination');
    paginationElement.innerHTML = '';

    const maxVisiblePages = 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(currentPage - halfVisible, 1);
    let endPage = Math.min(currentPage + halfVisible, totalPages);

    if (totalPages > maxVisiblePages) {
        if (currentPage <= halfVisible) {
            endPage = maxVisiblePages;
        } else if (currentPage + halfVisible >= totalPages) {
            startPage = totalPages - maxVisiblePages + 1;
        }
    }

    if (startPage > 1) {
        appendPageButton(1, currentPage, searchQuery);
        if (startPage > 2) {
            appendEllipsis(paginationElement);
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        appendPageButton(i, currentPage, searchQuery);
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            appendEllipsis(paginationElement);
        }
        appendPageButton(totalPages, currentPage, searchQuery);
    }
}


function appendPageButton(pageNumber, currentPage, searchQuery) {
    const paginationElement = document.getElementById('pagination');
    const pageButton = document.createElement('button');
    pageButton.classList.add('btn', 'btn-secondary', 'mx-1', 'btn-pagination');
    pageButton.innerText = pageNumber;

    if (pageNumber === currentPage) {
        pageButton.classList.add('active');
    }

    pageButton.addEventListener('click', () => {
        populateTicketTable(pageNumber, searchQuery);
    });

    paginationElement.appendChild(pageButton);
}


function appendEllipsis(paginationElement) {
    const ellipsis = document.createElement('span');
    ellipsis.innerText = '...';
    paginationElement.appendChild(ellipsis);
}



async function closeTicket(id) {
    try {
        const response = await fetch(`api/incidencia/closeTicketSoporte/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.ok) {
            alert('Ticket Cerrado!');
        } else {
            alert(`Error en actualizacion: ${result.error || 'Error desconocido'}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error('Error updating data:', error);
    }
}

function connectToWebSockets() {

    const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
    const host = window.location.host; // This gives you 'localhost:3000' for local or your production domain.
    const wsUrl = `${protocol}${host}/ws`;

    const socket = new WebSocket(wsUrl);

    socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === 'newTicket') {
            populateTicketTable();
        }
    };

    socket.onclose = (event) => {
        setTimeout(() => {
            console.log('retrying to connect');
            connectToWebSockets();
        }, 1500);

    };

    socket.onopen = (event) => {

    };

    socket.onerror = function (event) {
        console.error('WebSocket error observed:', event);
    };

}

// addUserButton.addEventListener('click', () => {
//     if (Auth.isLoggedIn()) {
//         window.location.href = 'register-ticketSoporte.html';
//     } else {
//         Auth.logout(); // Logout if token is expired
//     }
// });

backButton.addEventListener('click', () => {
    if (Auth.isLoggedIn()) {
        window.location.href = `menu-incidencias.html`;
    } else {
        Auth.logout(); // Logout if token is expired
    }
});

document.addEventListener('DOMContentLoaded', () => {
    populateTicketTable()
});

searchInput.addEventListener('keyup', function () {
    const filterText = searchInput.value.trim().toLowerCase();  // Trim any extra spaces
    populateTicketTable(1, filterText);
});

connectToWebSockets();
