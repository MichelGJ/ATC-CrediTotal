const registerForm = document.querySelector('#register-form');
const registerButton = document.querySelector('.btn-register');

// Registration submission
async function registerUser(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    const fullName = nameField.value.trim();
    const email = emailField.value.trim();
    const password = passwordField.value.trim();
    const cedula = cedulaField.value.trim();
    const role = rolField.value;

    // Prepare user data to be sent
    const userData = {
        name: fullName,
        cedula: cedula,
        email: email,
        password: password,
        role: role,
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
        console.log({ result });

        if (response.ok) {
            // Registration successful, redirect user or show success message
            nameField.value = '';
            emailField.value = '';
            passwordField.value = '';
            confirmPasswordField.value = '';
            passwordHelp.innerText = '';
            cedulaField.value = '';
            rolField.value = '';
            emailField.classList.remove('is-valid', 'is-invalid');
            confirmPasswordField.classList.remove('is-valid', 'is-invalid');
            alert('Registro exitoso!');
            window.location.href = 'list-users.html';
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
        emailField.classList.remove('is-valid', 'is-invalid'); confirmPasswordField.classList.remove('is-valid', 'is-invalid');
    }
}

async function fetchDataTipo() {
    const response = await fetch('api/incidencia/getAllTipoIncidencia');
    const data = await response.json();
    return data;
}

async function populateDropdownTipo() {
    const dropdown = document.getElementById('dynamic-dropdown-tipo');
    const { listaTipos, currentPage, totalPages } = await fetchDataTipo();
    listaTipos.forEach(item => {
        // Create a new option element
        const newOption = document.createElement('option');
        newOption.value = item.id;
        newOption.textContent = item.name;
        // Add the option to the dropdown
        dropdown.appendChild(newOption);
    });
}

document.addEventListener('DOMContentLoaded', populateDropdownTipo);

// password.addEventListener('input', function () {
//     userValidation.checkPasswordMatch();
//     userValidation.validateFormUser(1);
// });
// confirmPassword.addEventListener('input', function () {
//     userValidation.checkPasswordMatch();
//     userValidation.validateFormUser(1);
// });
// nameField.addEventListener('input',function () {
//     userValidation.validateFormUser(1);
// });
// cedulaField.addEventListener('input', function () {
//     userValidation.validateFormUser(1);
// });
// rolField.addEventListener('change', function () {
//     userValidation.validateFormUser(1);
// });
// emailField.addEventListener('input', function () {
//     userValidation.checkEmail();
//     userValidation.validateFormUser(1);
// });

// registerForm.addEventListener('submit', registerUser);


registerButton.disabled = true;