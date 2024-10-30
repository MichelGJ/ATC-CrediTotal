const gestionIncidenciasButton = document.getElementById('gestionIncidencias-button');
const reportarButton = document.getElementById('reportar-button');

const token = localStorage.getItem('token');

const enableOptionButton = () => {
    if (token) {
        const decodedToken = jwt_decode(token);
        const userPermisos = decodedToken.permisos || [];

        const buttonsContainer = document.querySelector(".buttons-container");
        // buttonsContainer.innerHTML = '';

        userPermisos.forEach(permission => {
            const button = document.getElementById(`${permission.valueOf()}-button`);

            if (!button) {
                console.error(`Button with id '${permission}' not found`);
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
});

gestionIncidenciasButton.addEventListener('click', () => {
    if (Auth.isLoggedIn()) {
        window.location.href = 'list-tipoIncidencia.html';
    } else {
        Auth.logout(); // Logout if token is expired
    }
});

reportarButton.addEventListener('click', () => {
    if (Auth.isLoggedIn()) {
        window.location.href = 'list-ticketSoporte.html';
    } else {
        Auth.logout(); // Logout if token is expired
    }
});