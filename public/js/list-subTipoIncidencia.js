const userTableBody = document.getElementById('user-table-body');
const addUserButton = document.getElementById('add-user-button');
const searchInput = document.getElementById('userSearchInput');

let currentPage = 1;
const limit = 10; // Default users per page
const urlParams = new URLSearchParams(window.location.search);
const idTipo = urlParams.get('idTipo');

async function fetchData(idTipo, page = 1, search = '') {
    try {
        const response = await fetch(`api/incidencia/getAllSubTipoIncidenciaByTipoIncidencia?idTipo=${idTipo}&page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`);
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

async function populateTipoIncidenciaTable(idTipo, page = 1, searchQuery = '') {
    try {
        const { listaSubTipos, currentPage, totalPages } = await fetchData(idTipo, page, searchQuery);

        userTableBody.innerHTML = '';

        if (listaSubTipos.length === 0) {
            userTableBody.innerHTML = '<tr><td colspan="5">No se encontro tipos de incidencia.</td></tr>';
            updatePaginationControls(currentPage, totalPages, searchQuery);
            return;
        }

        // Populate users
        listaSubTipos.forEach(tipo => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${tipo.name}</td>
                <td>${tipo.tipoDetails.name}</td>
                <td id="acciones">
                  <button class="btn btn-danger btn-sm delete-user" data-id="${tipo.id}">
                    <i class="bi bi-trash"></i>
                  </button>
                  <button class="btn btn-warning btn-sm edit-user" data-id="${tipo.id}">
                    <i class="bi bi-pencil"></i>
                  </button>
                </td>
            `;
            userTableBody.appendChild(row);
        });


        updatePaginationControls(currentPage, totalPages, searchQuery);

        attachDeleteHandlers();
        attachEditHandlers();
    } catch (error) {
        console.error('Error populating user table:', error);
    }
}

function attachDeleteHandlers() {
    const deleteButtons = document.querySelectorAll('.delete-user');

    deleteButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            const userId = button.getAttribute('data-id');

            // Confirm if the user wants to delete
            if (confirm('¿Está seguro de eliminar este tipo de incidencia?')) {
                try {
                    const deleted = await deleteUserById(userId);
                    if (deleted) {
                        populateUserTable();
                    } else {
                        console.error('Error deleting tipo incidencia:', error);
                        alert('Fallo eliminando el tipo de incidencia');
                    }
                } catch (error) {
                    console.error(error);
                    alert('Fallo eliminando el tipo de incidencia');
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
            window.location.href = `/edit-tipoIncidencia.html?id=${userId}`;
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
        populateTipoIncidenciaTable(idTipo, pageNumber, searchQuery);
    });

    paginationElement.appendChild(pageButton);
}


function appendEllipsis(paginationElement) {
    const ellipsis = document.createElement('span');
    ellipsis.innerText = '...';
    paginationElement.appendChild(ellipsis);
}



async function deleteUserById(id) {
    try {
        const response = await fetch(`api/incidencia/deleteTipoIncidenciaById/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error(`Delete failed with status ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error('Error deleting data:', error);
    }
}

function connectToWebSockets() {

    const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
    const host = window.location.host; // This gives you 'localhost:3000' for local or your production domain.
    const wsUrl = `${protocol}${host}/ws`;

    const socket = new WebSocket(wsUrl);

    socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === 'newTipoIncidencia') {
            populateTipoIncidenciaTable(idTipo);
        }
    };

    socket.onclose = (event) => {
        setTimeout(() => {
            connectToWebSockets();
        }, 1500);

    };

    socket.onopen = (event) => {

    };

    socket.onerror = function (event) {
        console.error('WebSocket error observed:', event);
    };

}

addUserButton.addEventListener('click', () => {
    if (Auth.isLoggedIn()) {
        window.location.href = 'registration.html';
    } else {
        Auth.logout(); // Logout if token is expired
    }
});


document.addEventListener('DOMContentLoaded', () => {
    populateTipoIncidenciaTable(idTipo)
});

searchInput.addEventListener('keyup', function () {
    const filterText = searchInput.value.trim().toLowerCase();  // Trim any extra spaces
    populateTipoIncidenciaTable(idTipo, 1, filterText);
});

connectToWebSockets();
