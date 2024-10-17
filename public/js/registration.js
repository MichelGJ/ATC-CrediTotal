const nameField = document.getElementById('fullName')
const emailField = document.getElementById('email');
const passwordField = document.getElementById('password');
const confirmPasswordField = document.getElementById('confirmPassword');
const passwordHelp = document.getElementById('passwordHelp');
const registerForm = document.querySelector('#register-form');
const registerButton = document.querySelector('.btn-register'); // The submit button
const allowedDomains = ['totalmundo.com', 'creditotal.com'];


// Function to check if the email format is valid
function isEmailValid(email) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email) && isDomainAllowed(email);
}

// Function to check if the email domain is allowed
function isDomainAllowed(email) {
    const emailParts = email.split('@'); // Split email into local part and domain part
    if (emailParts.length === 2) {
        const domain = emailParts[1]; // Get the domain part after the '@'
        return allowedDomains.includes(domain);
    }
    return false; // If the email is not split correctly, return false
}

// Function to check if the form is valid
function validateForm() {
    const fullName = nameField.value.trim();
    const email = emailField.value.trim();
    const password = passwordField.value.trim();
    const confirmPassword = confirmPasswordField.value.trim();


    // Check if all fields are filled and passwords match
    if (fullName && email && isEmailValid(email) && password && confirmPassword && password === confirmPassword) {
        registerButton.disabled = false; // Enable button
    } else {
        registerButton.disabled = true; // Disable button
    }
}

// Function to check if the password and confirmation match
function checkPasswordMatch() {
    if (confirmPasswordField.value.length > 0) {
        if (password.value === confirmPassword.value) {
            confirmPasswordField.classList.remove('is-invalid');
            confirmPasswordField.classList.add('is-valid');
            passwordHelp.textContent = 'Las contraseñas coinciden';
            passwordHelp.style.color = 'green';
        } else {
            confirmPasswordField.classList.remove('is-valid');
            confirmPasswordField.classList.add('is-invalid');
            passwordHelp.textContent = 'Las contraseñas no coinciden';
            passwordHelp.style.color = 'red';
        }
    } else {
        confirmPasswordField.classList.remove('is-valid', 'is-invalid');
        passwordHelp.textContent = '';
    }
}

function checkEmail() {
    const email = emailField.value.trim();
    // Email validation check
    if (email.length === 0) {
        // Clear the message and validation when the email field is empty
        emailField.classList.remove('is-valid', 'is-invalid');
        emailHelp.textContent = '';
    } else if (isEmailValid(email) && isDomainAllowed(email)) {
        emailField.classList.remove('is-invalid');
        emailField.classList.add('is-valid');
        emailHelp.textContent = '';
    } else {
        emailField.classList.remove('is-valid');
        emailField.classList.add('is-invalid');
        emailHelp.textContent = email.length > 0
            ? 'Formato de correo electrónico no válido o dominio no permitido'
            : ''; // Show alert if format is invalid or domain is not allowed
        emailHelp.style.color = 'red';
    }
}


// Registration submission
async function registerUser(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    const fullName = nameField.value.trim();
    const email = emailField.value.trim();
    const password = passwordField.value.trim();

    // Prepare user data to be sent
    const userData = {
        name: fullName,
        email: email,
        password: password
    };

    try {
        // Send a POST request to your registration API
        const response = await fetch(`api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData), // Convert user data to JSON string
        });

        // Parse the response from the server
        const result = await response.json();

        if (response.ok) {
            // Registration successful, redirect user or show success message
            nameField.value = '';
            emailField.value = '';
            passwordField.value = '';
            confirmPasswordField.value = '';
            passwordHelp.innerText = '';
            emailField.classList.remove('is-valid', 'is-invalid');
            confirmPasswordField.classList.remove('is-valid', 'is-invalid');
            alert('Registro exitoso!');
        } else {
            // Handle server-side validation errors
            alert(`Error en el registro: ${result.error || 'Error desconocido'}`);
            passwordField.value = '';
            confirmPasswordField.value = '';
            passwordHelp.innerText = '';
            emailField.classList.remove('is-valid', 'is-invalid');
            confirmPasswordField.classList.remove('is-valid', 'is-invalid');
        }
    } catch (error) {
        // Handle network or other errors\
        console.error('Error en el registro:', error);
        alert('Hubo un error en el registro. Intente nuevamente más tarde.');
        passwordField.value = '';
        confirmPasswordField.value = '';
        passwordHelp.innerText = '';
        emailField.classList.remove('is-valid', 'is-invalid');            confirmPasswordField.classList.remove('is-valid', 'is-invalid');
    }
}

password.addEventListener('input', function () {
    checkPasswordMatch();
    validateForm();
});
confirmPassword.addEventListener('input', function () {
    checkPasswordMatch();
    validateForm();
});
nameField.addEventListener('input', validateForm);
emailField.addEventListener('input', function () {
    checkEmail();
    validateForm();
});

registerForm.addEventListener('submit', registerUser);


registerButton.disabled = true;