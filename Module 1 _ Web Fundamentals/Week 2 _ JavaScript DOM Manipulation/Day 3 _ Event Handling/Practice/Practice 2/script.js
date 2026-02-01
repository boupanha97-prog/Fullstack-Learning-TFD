const form = document.getElementById('signup-form');
const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');

const usernameError = document.getElementById('username-error');
const emailError = document.getElementById('email-error');
const passwordError = document.getElementById('password-error');

let isValid = { username: false, email: false, password: false };

// 1. Validate username on input
username.addEventListener('input', () => {
    if (username.value.length < 3) {
        usernameError.textContent = '⚠️ Username must be at least 3 characters';
        username.style.borderColor = 'red';
        isValid.username = false;
    } else {
        usernameError.textContent = ''; // Clear error
        username.style.borderColor = 'green';
        isValid.username = true;
    }
});

// 2. Validate email on blur (when user leaves the field)
email.addEventListener('blur', () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.value)) {
        emailError.textContent = '⚠️ Please enter a valid email';
        email.style.borderColor = 'red';
        isValid.email = false;
    } else {
        emailError.textContent = '';
        email.style.borderColor = 'green';
        isValid.email = true;
    }
});

// 3. Validate password on input
password.addEventListener('input', () => {
    if (password.value.length < 8) {
        passwordError.textContent = '⚠️ Password must be at least 8 characters';
        password.style.borderColor = 'red';
        isValid.password = false;
    } else {
        passwordError.textContent = '';
        password.style.borderColor = 'green';
        isValid.password = true;
    }
});

// 4. Handle form submission
form.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent actual form submission
    
    // Check all validations
    if (isValid.username && isValid.email && isValid.password) {
        alert('Form submitted successfully! ✅');
        console.log('Username:', username.value);
        console.log('Email:', email.value);
        form.reset();
        // Reset styles
        [username, email, password].forEach(input => input.style.borderColor = '#ccc');
        isValid = { username: false, email: false, password: false };
    } else {
        alert('Please fix all errors before submitting! ❌');
    }
});