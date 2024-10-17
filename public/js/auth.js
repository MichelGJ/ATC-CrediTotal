const Auth = {
    // Check if token is in localStorage and if it's not expired
    isLoggedIn: function() {
        const token = localStorage.getItem('token');
        if (!token) return false;

        const decodedToken = jwt_decode(token); 
        const currentTime = Date.now() / 1000; 

        return decodedToken.exp > currentTime; 
    },

    // Logout function to clear token and redirect to login page
    logout: function() {
        localStorage.removeItem('token'); 
        window.location.href = '/login.html'; 
    },

    // Protect page function, logs out if the user is not logged in
    protectPage: function() {
        if (!this.isLoggedIn()) {
            this.logout(); 
        }
    },
};

// Inject the logout button dynamically into the top bar
function injectLogoutButton(){
    const topBars = document.getElementsByClassName('top-bar');

    if (topBars.length > 0) {
        const logoutButton = document.createElement('button');
        logoutButton.id = 'logout-button';
        logoutButton.classList.add('logout-btn');
        logoutButton.innerText = 'Logout';

        // Append the logout button to each top bar element
        Array.from(topBars).forEach(topBar => {
            topBar.appendChild(logoutButton);
        });

    
        logoutButton.addEventListener('click', () => {
            Auth.logout();
        });
        
    } else {
        console.error('No top bars found with the class "top-bar"'); // Error log if no top bars are found
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Auth.protectPage(); // Call protectPage to log out users with expired tokens
    injectLogoutButton(); // Inject the logout button into the top bar
});

