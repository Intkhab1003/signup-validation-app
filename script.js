document.addEventListener('DOMContentLoaded', () => {
    // Selectors
    const card = document.getElementById('tilt-card');
    const form = document.getElementById('signup-form');
    const successState = document.getElementById('success-state');
    const resetBtn = document.getElementById('reset-btn');
    const submitBtn = document.getElementById('submit-btn');
    
    const inputs = {
        fullname: document.getElementById('fullname'),
        email: document.getElementById('email'),
        password: document.getElementById('password')
    };
    
    const togglePasswordBtn = document.getElementById('toggle-password');
    const eyeIcon = document.getElementById('eye-icon');
    
    // 3D Tilt Effect
    const handleMouseMove = (e) => {
        // Disable tilt on small screens for performance and UX
        if (window.innerWidth < 960) return;
        
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -5; // max rotation degrees
        const rotateY = ((x - centerX) / centerX) * 5;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };
    
    const handleMouseLeave = () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
    };
    
    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);
    
    // Password Visibility Toggle
    togglePasswordBtn.addEventListener('click', () => {
        const type = inputs.password.getAttribute('type') === 'password' ? 'text' : 'password';
        inputs.password.setAttribute('type', type);
        eyeIcon.setAttribute('name', type === 'password' ? 'eye-outline' : 'eye-off-outline');
    });

    // Validation Rules
    const validators = {
        fullname: (value) => {
            const trimmed = value.trim();
            if (!trimmed) return "Name is required.";
            if (trimmed.length < 2) return "Name must be at least 2 characters.";
            return "";
        },
        email: (value) => {
            const trimmed = value.trim();
            if (!trimmed) return "Email is required.";
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!regex.test(trimmed)) return "Please enter a valid email address.";
            return "";
        },
        password: (value) => {
            if (!value) return "Password is required.";
            if (value.length < 8) return "Password must be at least 8 characters.";
            return "";
        }
    };

    // UI Feedback Helpers
    const setError = (element, message) => {
        const group = element.parentElement;
        const errorDisplay = group.querySelector('.error-message');
        group.classList.remove('success');
        group.classList.add('error');
        errorDisplay.innerText = message;
    };

    const setSuccess = (element) => {
        const group = element.parentElement;
        const errorDisplay = group.querySelector('.error-message');
        group.classList.remove('error');
        group.classList.add('success');
        errorDisplay.innerText = '';
    };

    // Password Strength Logic
    const calculateStrength = (password) => {
        let score = 0;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        return Math.min(score, 4); // Max score 4
    };

    const updateStrengthUI = (password) => {
        const strength = calculateStrength(password);
        const bars = document.querySelectorAll('.bar');
        const text = document.getElementById('strength-text');
        
        // Reset bars
        bars.forEach(bar => bar.style.background = 'rgba(255,255,255,0.1)');
        
        if (password.length === 0) {
            text.innerText = "Password Strength";
            text.style.color = "var(--text-muted)";
            return;
        }
        
        let color = '';
        let label = '';
        
        switch(strength) {
            case 1:
            case 2:
                color = 'var(--error)';
                label = 'Weak';
                break;
            case 3:
                color = 'var(--warning)';
                label = 'Medium';
                break;
            case 4:
                color = 'var(--success)';
                label = 'Strong';
                break;
        }
        
        for(let i = 0; i < strength; i++) {
            bars[i].style.background = color;
        }
        text.innerText = label;
        text.style.color = color;
    };

    // Event Listeners for Input/Blur
    let formSubmitted = false; // Flag to only show errors aggressively after first submit attempt

    const validateField = (field) => {
        const value = inputs[field].value;
        const errorMsg = validators[field](value);
        if (errorMsg) {
            setError(inputs[field], errorMsg);
            return false;
        } else {
            setSuccess(inputs[field]);
            return true;
        }
    };

    Object.keys(inputs).forEach(key => {
        inputs[key].addEventListener('blur', () => {
            validateField(key);
        });
        
        inputs[key].addEventListener('input', (e) => {
            if (formSubmitted) validateField(key);
            if (key === 'password') updateStrengthUI(e.target.value);
        });
    });

    // Form Submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        formSubmitted = true;
        
        // Validate all
        const isNameValid = validateField('fullname');
        const isEmailValid = validateField('email');
        const isPasswordValid = validateField('password');
        
        if (isNameValid && isEmailValid && isPasswordValid) {
            // Trim actual values before simulated sending
            inputs.fullname.value = inputs.fullname.value.trim();
            inputs.email.value = inputs.email.value.trim();

            // Loading state
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            
            // Simulate network request
            setTimeout(() => {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                
                // Switch UI State
                form.style.display = 'none';
                successState.style.display = 'block';
                
            }, 2000);
        }
    });

    // Reset Form for another test
    resetBtn.addEventListener('click', () => {
        form.reset();
        formSubmitted = false;
        
        // Reset UI validation classes
        Object.keys(inputs).forEach(key => {
            const group = inputs[key].parentElement;
            group.classList.remove('success', 'error');
            group.querySelector('.error-message').innerText = '';
        });
        
        updateStrengthUI('');
        
        // Switch UI State back
        successState.style.display = 'none';
        form.style.display = 'block';
    });
});