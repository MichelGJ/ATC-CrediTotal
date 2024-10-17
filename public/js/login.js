const invalidLoginHelp = document.getElementById('invalidLoginHelp');

// Function to handle the form submission
async function handleLoginFormSubmit(event) {
    event.preventDefault(); // Prevent form from submitting the traditional way

    // Get the values from the input fields
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Call the login function
    await loginUser(email, password);
}

// Function to send the login request to the API
async function loginUser(email, password) {
    // Your API URL
    const apiUrl = `${window.env.API_URL}/auth/login`;
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            window.location.href = '/main-menu.html';
        } else {
            invalidLoginHelp.textContent = 'Usuario o contraseña errada';
            invalidLoginHelp.style.color = 'red';
        }
    } catch (error) {
        invalidLoginHelp.textContent = 'Error de comunicacion';
        invalidLoginHelp.style.color = 'red';
    }
}

function isLoggedIn() {
    const token = localStorage.getItem('token'); 
    return !!token; 
}

 function redirect(){
    if (isLoggedIn()) {
        window.location.href = '/main-menu.html';
    }
 }

document.addEventListener('DOMContentLoaded', redirect());
// Add the event listener to the form
document.getElementById('loginForm').addEventListener('submit', handleLoginFormSubmit);
