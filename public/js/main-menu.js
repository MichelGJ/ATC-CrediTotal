const atpButton = document.getElementById('atp-button');
const usuariosButton = document.getElementById('usuarios-button');
const incidenciasButton = document.getElementById('incidencias-button');
const token = localStorage.getItem('token');

const enableOptionButton = async () => {
    if (token) {
        const decodedToken = jwt_decode(token);
        const user = await Auth.getUser(decodedToken.id);
        const userPermisos = user.roleDetails.permisos || [];

        const buttonsContainer = document.querySelector(".buttons-container");
        // buttonsContainer.innerHTML = '';

        userPermisos.forEach(permission => {
            const button = document.getElementById(`${permission.valueOf()}-button`);

            if (!button) {
                return;
            }
    
            if (userPermisos.includes(permission)) {
                buttonsContainer.insertBefore(button, buttonsContainer.firstChild); 
                button.style.visibility = "visible"; 
            } else {
                button.style.display = "hidden";
            }

        });
    } else {
        console.error('Token is missing');
    }
};


document.addEventListener('DOMContentLoaded', () => {
    enableOptionButton();
    const element = document.getElementById('gestionIncidencia-button');
if (element) {
    // Proceed with operations on the element
    element.textContent = 'Found!';
}
});

atpButton.addEventListener('click', () => {
    if (Auth.isLoggedIn()) {
        window.location.href = 'desk1.html';
    } else {
        Auth.logout(); // Logout if token is expired
    }
});

// Add click event for the Usuarios button
usuariosButton.addEventListener('click', () => {
    if (Auth.isLoggedIn()) {
        window.location.href = 'list-users.html';
    } else {
        Auth.logout(); // Logout if token is expired
    }
});

incidenciasButton.addEventListener('click', () => {
    if (Auth.isLoggedIn()) {
        window.location.href = 'menu-incidencias.html';
    } else {
        Auth.logout(); // Logout if token is expired
    }
});
