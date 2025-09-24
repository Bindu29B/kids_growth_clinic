document.getElementById('login-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');

    emailError.textContent = '';
    passwordError.textContent = '';

    if (!email) {
        emailError.textContent = 'Email is required';
        return;
    }
    if (!password) {
        passwordError.textContent = 'Password is required';
        return;
    }

    try {
        // console.log('Credentials:', { email, password });
        const response = await fetch('http://localhost:5000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (response.ok) {
            window.location.href = 'admin_dashboard.html';
        } else {
            emailError.textContent = data.message;
        }
    } catch (error) {
        console.error('Login error:', error);
    }
});
