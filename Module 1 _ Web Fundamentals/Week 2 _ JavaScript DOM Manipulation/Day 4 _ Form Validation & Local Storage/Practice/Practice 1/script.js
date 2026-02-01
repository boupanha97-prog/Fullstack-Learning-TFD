const form = document.getElementById('registration-form');
const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirm-password');
const submitBtn = document.getElementById('submit-btn');

// Validation patterns
const patterns = {
    username: /^[a-zA-Z0-9]{3,20}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
};

// State object to track validity of each field
const validity = {
    username: false,
    email: false,
    password: false,
    confirm: false
};

// Helper function to update UI based on validity
function updateFieldStatus(input, isValid, errorId, errorMessage) {
    const errorElement = document.getElementById(errorId);
    
    if (isValid) {
        input.classList.remove('invalid');
        input.classList.add('valid');
        errorElement.textContent = '';
    } else {
        input.classList.remove('valid');
        input.classList.add('invalid');
        errorElement.textContent = errorMessage;
    }
}

// Check overall form validity to enable/disable submit button
function checkFormValidity() {
    const isFormValid = Object.values(validity).every(status => status === true);
    submitBtn.disabled = !isFormValid;
}

// Event Listeners for Real-time Validation

username.addEventListener('input', () => {
    const isValid = patterns.username.test(username.value);
    updateFieldStatus(
        username, 
        isValid, 
        'username-error', 
        'Username must be 3-20 alphanumeric characters'
    );
    validity.username = isValid;
    checkFormValidity();
});

email.addEventListener('input', () => {
    const isValid = patterns.email.test(email.value);
    updateFieldStatus(
        email, 
        isValid, 
        'email-error', 
        'Please enter a valid email address'
    );
    validity.email = isValid;
    checkFormValidity();
});

password.addEventListener('input', () => {
    const isValid = patterns.password.test(password.value);
    updateFieldStatus(
        password, 
        isValid, 
        'password-error', 
        'Password must be 8+ chars with uppercase, lowercase, and number'
    );
    validity.password = isValid;
    
    // Re-validate confirm password if main password changes
    if (confirmPassword.value) {
        confirmPassword.dispatchEvent(new Event('input'));
    }
    checkFormValidity();
});

confirmPassword.addEventListener('input', () => {
    const isValid = confirmPassword.value === password.value && confirmPassword.value !== '';
    updateFieldStatus(confirmPassword, isValid, 'confirm-error', 'Passwords do not match');
    validity.confirm = isValid;
    checkFormValidity();
});

// Handle Form Submission
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const userData = {
        username: username.value,
        email: email.value,
        registeredAt: new Date().toISOString()
    };
    
    localStorage.setItem('userData', JSON.stringify(userData));
    
    alert('Registration successful! Data saved to Local Storage.');
    console.log('Stored data:', userData);
    
    form.reset();
    // Reset visual states
    document.querySelectorAll('.valid').forEach(el => el.classList.remove('valid'));
    submitBtn.disabled = true;
    Object.keys(validity).forEach(key => validity[key] = false);
});