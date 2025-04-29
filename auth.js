document.addEventListener('DOMContentLoaded', function () {
    const loginTab = document.getElementById('loginTab');
    const signupTab = document.getElementById('signupTab');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const loginError = document.getElementById('loginError');
    const signupError = document.getElementById('signupError');

    // Tab switching
    loginTab.addEventListener('click', function () {
        loginTab.classList.add('active');
        signupTab.classList.remove('active');
        loginForm.classList.remove('hidden');
        signupForm.classList.add('hidden');
        loginError.textContent = '';
        signupError.textContent = '';
    });
    signupTab.addEventListener('click', function () {
        signupTab.classList.add('active');
        loginTab.classList.remove('active');
        signupForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
        loginError.textContent = '';
        signupError.textContent = '';
    });

    // Signup logic
    signupForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const username = document.getElementById('signupUsername').value.trim();
        const email = document.getElementById('signupEmail').value.trim().toLowerCase();
        const password = document.getElementById('signupPassword').value;
        signupError.textContent = '';
        if (!username || !email || !password) {
            signupError.textContent = 'Please fill in all fields.';
            return;
        }
        let users = JSON.parse(localStorage.getItem('users') || '{}');
        if (users[email]) {
            signupError.textContent = 'Email already registered.';
            return;
        }
        users[email] = { username, email, password };
        localStorage.setItem('users', JSON.stringify(users));
        signupError.style.color = '#16a34a';
        signupError.textContent = 'Signup successful! You can now login.';
        setTimeout(() => {
            signupError.textContent = '';
            loginTab.click();
        }, 1200);
        signupError.style.color = '';
        signupForm.reset();
    });

    // Login logic
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim().toLowerCase();
        const password = document.getElementById('loginPassword').value;
        loginError.textContent = '';
        if (!email || !password) {
            loginError.textContent = 'Please fill in all fields.';
            return;
        }
        let users = JSON.parse(localStorage.getItem('users') || '{}');
        if (!users[email] || users[email].password !== password) {
            loginError.textContent = 'Invalid email or password.';
            return;
        }
        loginError.style.color = '#16a34a';
        loginError.textContent = 'Login successful!';
        setTimeout(() => {
            loginError.textContent = '';
            // Redirect or further logic here
        }, 1200);
        loginError.style.color = '';
        loginForm.reset();
    });
});