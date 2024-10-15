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
    const apiUrl = 'https://localhost:3000/api/auth/login'; // Replace with your API endpoint

    try {
        // Make the POST request to your authentication API
        // const response = await fetch(apiUrl, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({
        //         email: email,
        //         password: password
        //     })
        // });

        // // Parse the JSON response
        // const data = await response.json();

        // // Check if the authentication was successful
        // if (response.ok) {
        //     // Handle successful login (e.g., store token, redirect user)
        //     console.log('Login successful:', data);
        //     alert('Login successful! Redirecting...');
        //     // Redirect to a dashboard page or wherever you want
        //     window.location.href = '/private.html';
        // } else {
        //     // Handle authentication errors
        //     console.error('Login failed:', data.message);
        //     alert('Login failed: ' + data.message);
        // }
    } catch (error) {
        // Handle network or other unexpected errors
        console.error('Error during login:', error);
        alert('Error during login: ' + error.message);
    }
    window.location.href = '/private.html';
}

// Add the event listener to the form
document.getElementById('loginForm').addEventListener('submit', handleLoginFormSubmit);
