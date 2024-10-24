const userTableBody = document.getElementById('user-table-body');
const addUserButton = document.getElementById('add-user-button');
const searchInput = document.getElementById('userSearchInput');

let currentPage = 1;
const limit = 2; // Default users per page

async function fetchData(page = 1, search = '') {
    try {
        const response = await fetch(`api/auth/getUsers?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`);
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

async function populateUserTable(page = 1, searchQuery = '') {
    try {
        const { users, currentPage, totalPages } = await fetchData(page, searchQuery);

        userTableBody.innerHTML = ''; // Clear the table body

        if (users.length === 0) {
            userTableBody.innerHTML = '<tr><td colspan="5">No users found.</td></tr>';
            updatePaginationControls(currentPage, totalPages, searchQuery);
            return;
        }

        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.cedula}</td>
        <td>${user.roleDetails.nombre}</td>
        <td id="acciones">
          <button class="btn btn-danger btn-sm delete-user" data-id="${user.id}">
            <i class="bi bi-trash"></i>
          </button>
          <button class="btn btn-warning btn-sm edit-user" data-id="${user.id}">
            <i class="bi bi-pencil"></i>
          </button>
        </td>
      `;
            userTableBody.appendChild(row);
        });

        // Update pagination controls
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
            if (confirm('¿Está seguro de eliminar este usuario?')) {
                try {
                    const deleted = await deleteUserById(userId);
                    if (deleted) {
                        populateUserTable();
                    } else {
                        console.error('Error deleting user:', error);
                        alert('Fallo eliminando el usuario');
                    }
                } catch (error) {
                    console.error(error);
                    alert('Fallo eliminando el usuario');
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
    paginationElement.innerHTML = ''; // Clear previous pagination controls


    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.classList.add('btn', 'btn-secondary', 'mx-1');
        pageButton.innerText = i;
        if (i === currentPage) {
            pageButton.classList.add('active');
        }

        pageButton.addEventListener('click', () => {
            populateUserTable(i, searchQuery);  // Pass the search query here
        });

        paginationElement.appendChild(pageButton);
    }
}


async function deleteUserById(id) {
    try {
        const response = await fetch(`api/auth/deleteUserById/${id}`, {
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
        if (message.type === 'newUser') {
            populateUserTable();
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

addUserButton.addEventListener('click', () => {
    if (Auth.isLoggedIn()) {
        window.location.href = 'registration.html';
    } else {
        Auth.logout(); // Logout if token is expired
    }
});

document.addEventListener('DOMContentLoaded', () => {
    populateUserTable()
});

searchInput.addEventListener('keyup', function () {
    const filterText = searchInput.value.trim().toLowerCase();  // Trim any extra spaces
    populateUserTable(1, filterText);
});

connectToWebSockets();
