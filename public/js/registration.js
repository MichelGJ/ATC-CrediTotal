const nameField = document.getElementById('fullName')
const emailField = document.getElementById('email');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');
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
    const passwordValue = password.value.trim();
    const confirmPasswordValue = confirmPassword.value.trim();

   
    // Check if all fields are filled and passwords match
    if (fullName && email && isEmailValid(email) && passwordValue && confirmPasswordValue && passwordValue === confirmPasswordValue) {
        registerButton.disabled = false; // Enable button
    } else {
        registerButton.disabled = true; // Disable button
    }
}

// Function to check if the password and confirmation match
function checkPasswordMatch() {
    if (confirmPassword.value.length > 0) {
        if (password.value === confirmPassword.value) {
            confirmPassword.classList.remove('is-invalid');
            confirmPassword.classList.add('is-valid');
            passwordHelp.textContent = 'Las contraseñas coinciden';
            passwordHelp.style.color = 'green';
        } else {
            confirmPassword.classList.remove('is-valid');
            confirmPassword.classList.add('is-invalid');
            passwordHelp.textContent = 'Las contraseñas no coinciden';
            passwordHelp.style.color = 'red';
        }
    } else {
        confirmPassword.classList.remove('is-valid', 'is-invalid');
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


password.addEventListener('input', function() {
    checkPasswordMatch();
    validateForm(); 
});
confirmPassword.addEventListener('input', function() {
    checkPasswordMatch();
    validateForm(); 
});
nameField.addEventListener('input', validateForm);
emailField.addEventListener('input', function(){
    checkEmail();
    validateForm(); 
});

registerButton.disabled = true;