// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatusAndRedirect();
});

function checkAuthStatusAndRedirect() {
    const authData = getAuthData();
    
    if (authData) {
        // User is authenticated, check if auth is still valid
        const now = Date.now();
        const maxAge = authData.rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
        
        if (now - authData.timestamp < maxAge) {
            // Valid auth, redirect to dashboard
            window.location.href = 'dashboard.html';
            return;
        } else {
            // Auth expired, clear it
            clearAuthData();
        }
    }
    
    // No valid auth, redirect to login
    window.location.href = 'login.html';
}

function getAuthData() {
    const sessionData = sessionStorage.getItem('authData');
    const localData = localStorage.getItem('authData');
    
    if (sessionData) {
        return JSON.parse(sessionData);
    } else if (localData) {
        return JSON.parse(localData);
    }
    
    return null;
}

function clearAuthData() {
    sessionStorage.removeItem('authData');
    localStorage.removeItem('authData');
}

