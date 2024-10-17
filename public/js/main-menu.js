const atpButton = document.getElementById('atp-button');
const usuariosButton = document.getElementById('usuarios-button');
const token = localStorage.getItem('token');

const enableOptionButton = () => {
    if (token) {
        const decodedToken = jwt_decode(token); // Decode the token
        const userRole = decodedToken.role; // Adjust this if your role is in a different key
        console.log(userRole);
        // Show or hide the Usuarios button based on the user role
        if (!userRole.includes('ADMIN')) {
            usuariosButton.style.display = 'none'; // Hide button if not admin
        }
    } else {
        usuariosButton.style.display = 'none'; // Hide button if no token
    }
}

document.addEventListener('DOMContentLoaded', () => {
    enableOptionButton();  // Enable option buttons based on user role
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
