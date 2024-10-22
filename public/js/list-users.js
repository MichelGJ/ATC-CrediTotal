const userTableBody = document.getElementById('user-table-body');
const addUserButton = document.getElementById('add-user-button');

async function fetchData() {
    try {
        const response = await fetch('api/auth/getUsers');
        if (!response.ok) {
            throw new Error(`Fetch failed with status ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return []; // Return empty array or handle error gracefully
    }
}

// Function to generate table rows dynamically
async function populateUserTable() {
    try {
        userTableBody.innerHTML = ''; // Clear the table body
        const data = await fetchData();
        data.forEach(user => {
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

        attachDeleteHandlers();


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
                    }else{
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

connectToWebSockets();