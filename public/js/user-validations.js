const nameField = document.getElementById('fullName');
const cedulaField = document.getElementById('cedulaUsuario');
const rolField = document.getElementById('dynamic-dropdown');
const emailField = document.getElementById('email');
const passwordField = document.getElementById('password');
const confirmPasswordField = document.getElementById('confirmPassword');
const passwordHelp = document.getElementById('passwordHelp');
const registerButton = document.querySelector('.btn-register'); // The submit button
const allowedDomains = ['totalmundo.com', 'creditotal.com'];

const userValidation = {

    // Function to check if the email format is valid
    isEmailValid(email) {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(email) && this.isDomainAllowed(email);
    },

    // Function to check if the email domain is allowed
    isDomainAllowed(email) {
        const emailParts = email.split('@'); // Split email into local part and domain part
        if (emailParts.length === 2) {
            const domain = emailParts[1]; // Get the domain part after the '@'
            return allowedDomains.includes(domain);
        }
        return false; // If the email is not split correctly, return false
    },

    // Function to check if the form is valid
    validateForm(tipo) {
        const fullName = nameField.value.trim();
        const cedula = cedulaField.value.trim();
        const rol = rolField.value;
        const email = emailField.value.trim();
        const password = passwordField.value.trim();
        const confirmPassword = confirmPasswordField.value.trim();

        // Check if all fields are filled and passwords match
        let condicion;
        if (tipo === 1) {
            condicion = fullName && cedula && rol !== "" && email && this.isEmailValid(email) && password && confirmPassword && password === confirmPassword;
        } else {
            condicion = fullName && cedula && rol !== "" && email && this.isEmailValid(email) && password === confirmPassword;
        }
        if (condicion) {
            registerButton.disabled = false; // Enable button
        } else {
            registerButton.disabled = true; // Disable button
        }
    },

    // Function to check if the password and confirmation match
    checkPasswordMatch() {
        if (confirmPasswordField.value.length > 0) {
            if (passwordField.value === confirmPasswordField.value) {
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
    },

    checkEmail() {
        const email = emailField.value.trim();
        const emailHelp = document.getElementById('emailHelp'); // Ensure emailHelp is defined
        // Email validation check
        if (email.length === 0) {
            // Clear the message and validation when the email field is empty
            emailField.classList.remove('is-valid', 'is-invalid');
            emailHelp.textContent = '';
        } else if (this.isEmailValid(email)) {
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
};