const idField = document.getElementById('user-id');
const registerForm = document.querySelector('#register-form');

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
        emailField.classList.remove('is-valid', 'is-invalid');            
        confirmPasswordField.classList.remove('is-valid', 'is-invalid');
    }
}


password.addEventListener('input', function () {
    userValidation.checkPasswordMatch();
    userValidation.validateForm(2);
});
confirmPassword.addEventListener('input', function () {
    userValidation.checkPasswordMatch();
    userValidation.validateForm(2);
});
nameField.addEventListener('input',function () {
    userValidation.validateForm(2);
});
cedulaField.addEventListener('input', function () {
    userValidation.validateForm(2);
});
rolField.addEventListener('change', function () {
    userValidation.validateForm(2);
});
emailField.addEventListener('input', function () {
    userValidation.checkEmail();
    userValidation.validateForm(2);
});

registerForm.addEventListener('submit', updateUser);