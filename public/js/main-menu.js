const atpButton = document.getElementById('atp-button');
const usuariosButton = document.getElementById('usuarios-button');
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
        window.location.href = 'registration.html';
    } else {
        Auth.logout(); // Logout if token is expired
    }
});
