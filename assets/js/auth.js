class AuthManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadTheme();
        this.checkAuthStatus();
    }

    setupEventListeners() {
        // Form submissions
        document.getElementById('loginForm').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('registerForm').addEventListener('submit', (e) => this.handleRegister(e));

        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());

        // Password confirmation validation
        document.getElementById('confirmPassword').addEventListener('input', (e) => this.validatePasswordConfirmation(e));

        // Form validation
        this.setupFormValidation();
    }

    setupFormValidation() {
        const forms = document.querySelectorAll('.auth-form');
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input[required]');
            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.clearFieldError(input));
            });
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Required field validation
        if (!value) {
            isValid = false;
            errorMessage = 'Este campo é obrigatório.';
        } else {
            // Email validation
            if (field.type === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Por favor, insira um e-mail válido.';
                }
            }

            // Password validation
            if (field.type === 'password' && field.id !== 'confirmPassword') {
                if (value.length < 6) {
                    isValid = false;
                    errorMessage = 'A senha deve ter pelo menos 6 caracteres.';
                }
            }
        }

        this.setFieldValidation(field, isValid, errorMessage);
        return isValid;
    }

    validatePasswordConfirmation(e) {
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = e.target.value;
        
        if (confirmPassword && password !== confirmPassword) {
            this.setFieldValidation(e.target, false, 'As senhas não coincidem.');
        } else {
            this.setFieldValidation(e.target, true, '');
        }
    }

    setFieldValidation(field, isValid, message) {
        const formGroup = field.closest('.form-floating') || field.closest('.form-check');
        
        // Remove existing validation classes
        field.classList.remove('is-valid', 'is-invalid');
        
        // Remove existing error message
        const existingError = formGroup.querySelector('.invalid-feedback');
        if (existingError) {
            existingError.remove();
        }

        if (!isValid && message) {
            field.classList.add('is-invalid');
            const errorElement = document.createElement('div');
            errorElement.className = 'invalid-feedback';
            errorElement.textContent = message;
            formGroup.appendChild(errorElement);
        } else if (isValid) {
            field.classList.add('is-valid');
        }
    }

    clearFieldError(field) {
        field.classList.remove('is-invalid');
        const formGroup = field.closest('.form-floating') || field.closest('.form-check');
        const errorElement = formGroup.querySelector('.invalid-feedback');
        if (errorElement) {
            errorElement.remove();
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        // Validate form
        if (!this.validateLoginForm(email, password)) {
            return;
        }

        // Show loading state
        this.setButtonLoading('loginBtn', true);
        this.hideError('loginError');

        try {
            // Simulate API call delay
            await this.delay(1000);

            // Mock authentication - in real app, this would be an API call
            const authResult = await this.authenticateUser(email, password);
            
            if (authResult.success) {
                // Store user data
                this.storeAuthData(authResult.user, rememberMe);
                
                // Show success message
                this.showSuccessMessage('Login realizado com sucesso!');
                
                // Redirect to dashboard
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            } else {
                throw new Error(authResult.message);
            }
        } catch (error) {
            this.showError('loginError', error.message);
        } finally {
            this.setButtonLoading('loginBtn', false);
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        
        const name = document.getElementById('registerName').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const acceptTerms = document.getElementById('acceptTerms').checked;

        // Validate form
        if (!this.validateRegisterForm(name, email, password, confirmPassword, acceptTerms)) {
            return;
        }

        // Show loading state
        this.setButtonLoading('registerBtn', true);
        this.hideError('registerError');

        try {
            // Simulate API call delay
            await this.delay(1000);

            // Mock registration - in real app, this would be an API call
            const registerResult = await this.registerUser(name, email, password);
            
            if (registerResult.success) {
                // Store user data
                this.storeAuthData(registerResult.user, false);
                
                // Show success message
                this.showSuccessMessage('Conta criada com sucesso!');
                
                // Redirect to dashboard
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            } else {
                throw new Error(registerResult.message);
            }
        } catch (error) {
            this.showError('registerError', error.message);
        } finally {
            this.setButtonLoading('registerBtn', false);
        }
    }

    validateLoginForm(email, password) {
        let isValid = true;

        if (!email) {
            this.showError('loginError', 'Por favor, insira seu e-mail.');
            isValid = false;
        } else if (!password) {
            this.showError('loginError', 'Por favor, insira sua senha.');
            isValid = false;
        }

        return isValid;
    }

    validateRegisterForm(name, email, password, confirmPassword, acceptTerms) {
        let isValid = true;
        let errorMessage = '';

        if (!name) {
            errorMessage = 'Por favor, insira seu nome.';
            isValid = false;
        } else if (!email) {
            errorMessage = 'Por favor, insira seu e-mail.';
            isValid = false;
        } else if (!password) {
            errorMessage = 'Por favor, insira uma senha.';
            isValid = false;
        } else if (password.length < 6) {
            errorMessage = 'A senha deve ter pelo menos 6 caracteres.';
            isValid = false;
        } else if (password !== confirmPassword) {
            errorMessage = 'As senhas não coincidem.';
            isValid = false;
        } else if (!acceptTerms) {
            errorMessage = 'Você deve aceitar os termos de uso.';
            isValid = false;
        }

        if (!isValid) {
            this.showError('registerError', errorMessage);
        }

        return isValid;
    }

    async authenticateUser(email, password) {
        // Mock authentication logic
        // In a real app, this would make an API call to your backend
        
        // Simulate different scenarios
        if (email === 'admin@taskflow.com' && password === 'admin123') {
            return {
                success: true,
                user: {
                    id: '1',
                    name: 'Administrador',
                    email: 'admin@taskflow.com',
                    role: 'admin'
                }
            };
        } else if (email.includes('@') && password.length >= 6) {
            return {
                success: true,
                user: {
                    id: Date.now().toString(),
                    name: email.split('@')[0],
                    email: email,
                    role: 'user'
                }
            };
        } else {
            return {
                success: false,
                message: 'E-mail ou senha incorretos.'
            };
        }
    }

    async registerUser(name, email, password) {
        // Mock registration logic
        // In a real app, this would make an API call to your backend
        
        // Simulate email already exists
        const existingUsers = this.getStoredUsers();
        if (existingUsers.some(user => user.email === email)) {
            return {
                success: false,
                message: 'Este e-mail já está em uso.'
            };
        }

        // Create new user
        const newUser = {
            id: Date.now().toString(),
            name: name,
            email: email,
            role: 'user'
        };

        // Store user (in real app, this would be handled by the backend)
        existingUsers.push(newUser);
        localStorage.setItem('users', JSON.stringify(existingUsers));

        return {
            success: true,
            user: newUser
        };
    }

    getStoredUsers() {
        return JSON.parse(localStorage.getItem('users') || '[]');
    }

    storeAuthData(user, rememberMe) {
        const authData = {
            user: user,
            timestamp: Date.now(),
            rememberMe: rememberMe
        };

        if (rememberMe) {
            localStorage.setItem('authData', JSON.stringify(authData));
        } else {
            sessionStorage.setItem('authData', JSON.stringify(authData));
        }
    }

    checkAuthStatus() {
        const authData = this.getStoredAuthData();
        
        if (authData) {
            // Check if auth data is still valid (24 hours for session, 30 days for remember me)
            const now = Date.now();
            const maxAge = authData.rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
            
            if (now - authData.timestamp < maxAge) {
                // User is still authenticated, redirect to dashboard
                window.location.href = 'dashboard.html';
                return;
            } else {
                // Auth data expired, clear it
                this.clearAuthData();
            }
        }
    }

    getStoredAuthData() {
        const sessionData = sessionStorage.getItem('authData');
        const localData = localStorage.getItem('authData');
        
        if (sessionData) {
            return JSON.parse(sessionData);
        } else if (localData) {
            return JSON.parse(localData);
        }
        
        return null;
    }

    clearAuthData() {
        sessionStorage.removeItem('authData');
        localStorage.removeItem('authData');
    }

    setButtonLoading(buttonId, loading) {
        const button = document.getElementById(buttonId);
        const spinner = button.querySelector('.spinner-border');
        
        if (loading) {
            button.disabled = true;
            spinner.classList.remove('d-none');
        } else {
            button.disabled = false;
            spinner.classList.add('d-none');
        }
    }

    showError(errorElementId, message) {
        const errorElement = document.getElementById(errorElementId);
        const messageElement = document.getElementById(errorElementId + 'Message');
        
        messageElement.textContent = message;
        errorElement.classList.remove('d-none');
        
        // Auto-hide error after 5 seconds
        setTimeout(() => {
            this.hideError(errorElementId);
        }, 5000);
    }

    hideError(errorElementId) {
        const errorElement = document.getElementById(errorElementId);
        errorElement.classList.add('d-none');
    }

    showSuccessMessage(message) {
        // Create success alert
        const alert = document.createElement('div');
        alert.className = 'alert alert-success alert-dismissible fade show position-fixed';
        alert.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        alert.innerHTML = `
            <i class="bi bi-check-circle-fill me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(alert);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (alert.parentNode) {
                alert.parentNode.removeChild(alert);
            }
        }, 3000);
    }

    toggleTheme() {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-bs-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-bs-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        this.updateThemeIcon(newTheme);
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-bs-theme', savedTheme);
        this.updateThemeIcon(savedTheme);
    }

    updateThemeIcon(theme) {
        const themeIcon = document.querySelector('#themeToggle i');
        if (themeIcon) {
            themeIcon.className = theme === 'dark' ? 'bi bi-sun-fill' : 'bi bi-moon-stars';
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize authentication manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AuthManager();
});

// Add some nice animations
document.addEventListener('DOMContentLoaded', () => {
    // Add fade-in animation to login card
    const loginCard = document.querySelector('.login-card');
    if (loginCard) {
        loginCard.classList.add('fade-in');
    }
    
    // Add hover effects to form inputs
    const inputs = document.querySelectorAll('.form-control');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'translateY(-2px)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'translateY(0)';
        });
    });
});