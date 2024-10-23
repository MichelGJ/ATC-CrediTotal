const idField = document.getElementById('user-id');
const nameField = document.getElementById('fullName');
const cedulaField = document.getElementById('cedulaUsuario');
const rolField = document.getElementById('dynamic-dropdown')
const emailField = document.getElementById('email');
const passwordField = document.getElementById('password');
const confirmPasswordField = document.getElementById('confirmPassword');
const passwordHelp = document.getElementById('passwordHelp');
const registerForm = document.querySelector('#register-form');
const registerButton = document.querySelector('.btn-register'); // The submit button
const allowedDomains = ['totalmundo.com', 'creditotal.com'];


function validateForm() {
    const fullName = nameField.value.trim();
    const cedula = cedulaField.value.trim();
    const rol = rolField.value;
    const email = emailField.value.trim();
    const password = passwordField.value.trim();
    const confirmPassword = confirmPasswordField.value.trim();


    // Check if all fields are filled and passwords match
    if (fullName && cedula && rol !== "" && email && isEmailValid(email) && password === confirmPassword) {
        registerButton.disabled = false; // Enable button
    } else {
        registerButton.disabled = true; // Disable button
    }
}

function isEmailValid(email) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email) && isDomainAllowed(email);
}


function isDomainAllowed(email) {
    const emailParts = email.split('@');
    if (emailParts.length === 2) {
        const domain = emailParts[1];
        return allowedDomains.includes(domain);
    }
    return false;
}

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



document.addEventListener('DOMContentLoaded', async () => {
    populateDropdown();
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (id) {
        // Fetch user data based on userId
        const data = await fetch(`/api/auth/getUserById/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const userData = await data.json();
        
        // Pre-fill form fields with user data
        idField.value = userData._id;
        nameField.value = userData.name;
        emailField.value = userData.email;
        cedulaField.value = userData.cedula;
        rolField.value = userData.roleDetails._id;
    }
});


async function fetchData() {
    const response = await fetch('api/auth/getRoles');
    const data = await response.json();
    return data;
}

async function populateDropdown() {
    const dropdown = document.getElementById('dynamic-dropdown');
    const data = await fetchData();
    data.forEach(item => {
        // Create a new option element
        const newOption = document.createElement('option');
        newOption.value = item.id;
        newOption.textContent = item.nombre;
        // Add the option to the dropdown
        dropdown.appendChild(newOption);
    });
}

async function updateUser(event) {
    event.preventDefault(); 

    const id = idField.value.trim();
    const fullName = nameField.value.trim();
    const email = emailField.value.trim();
    const password = passwordField.value.trim();
    const cedula  = cedulaField.value.trim();
    const role = rolField.value;

    const userData = {
        id: id,
        name: fullName,
        cedula: cedula,
        email: email,
        password: password,
        role: role,
    };

    try {
        const response = await fetch(`api/auth/updateUser`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        const result = await response.json();
        console.log({userData});

        if (response.ok) {
            alert('Actualizacion exitosa!');
            passwordField.value = '';
            confirmPasswordField.value = '';
            passwordHelp.innerText = '';
            emailField.classList.remove('is-valid', 'is-invalid');
            confirmPasswordField.classList.remove('is-valid', 'is-invalid');
            window.location.href = 'list-users.html';
        } else {
            alert(`Error en actualizacion: ${result.error || 'Error desconocido'}`);
            passwordField.value = '';
            confirmPasswordField.value = '';
            passwordHelp.innerText = '';
            emailField.classList.remove('is-valid', 'is-invalid');
            confirmPasswordField.classList.remove('is-valid', 'is-invalid');
        }
    } catch (error) {
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
cedulaField.addEventListener('input', validateForm);
rolField.addEventListener('change', validateForm)
emailField.addEventListener('input', function () {
    checkEmail();
    validateForm();
});
registerForm.addEventListener('submit', updateUser);