// Theme Management
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.init();
    }

    init() {
        // Check for saved theme or system preference
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        // Set initial theme
        if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
            this.setDarkTheme();
        } else {
            this.setLightTheme();
        }

        // Add event listener
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                e.matches ? this.setDarkTheme() : this.setLightTheme();
            }
        });
    }

    setDarkTheme() {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        this.themeToggle.setAttribute('aria-label', 'Switch to light theme');
    }

    setLightTheme() {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        this.themeToggle.setAttribute('aria-label', 'Switch to dark theme');
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            this.setLightTheme();
        } else {
            this.setDarkTheme();
        }
        
        // Add click animation
        this.themeToggle.style.transform = 'scale(0.9)';
        setTimeout(() => {
            this.themeToggle.style.transform = '';
        }, 200);
    }
}

// Initialize Theme Manager
const themeManager = new ThemeManager();

// Contact Form Handler
document.getElementById("contactForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const message = document.getElementById("message").value;
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    const responseMsg = document.getElementById("responseMsg");

    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    responseMsg.innerHTML = '';
    responseMsg.style.display = 'none';

    try {
        // Using Formspree endpoint
        const formData = new FormData();
        formData.append('name', name);
        formData.append('phone', phone);
        formData.append('message', message);

        const res = await fetch(this.action, {
            method: "POST",
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (res.ok) {
            responseMsg.innerHTML = '✅ Message sent successfully! We\'ll contact you soon.';
            responseMsg.style.color = '#10b981';
            responseMsg.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
            responseMsg.style.display = 'block';
            this.reset();
            
            // Success animation
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Sent!';
            setTimeout(() => {
                submitBtn.innerHTML = originalBtnText;
            }, 2000);
        } else {
            throw new Error('Form submission failed');
        }

    } catch (err) {
        responseMsg.innerHTML = '⚠️ Failed to send message. Please try again or WhatsApp us directly.';
        responseMsg.style.color = '#ef4444';
        responseMsg.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
        responseMsg.style.display = 'block';
        
        // Error state
        submitBtn.innerHTML = '<i class="fas fa-exclamation-circle"></i> Try Again';
        setTimeout(() => {
            submitBtn.innerHTML = originalBtnText;
        }, 3000);
    } finally {
        submitBtn.disabled = false;
    }
});

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if(targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if(targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe service cards and template cards
document.querySelectorAll('.service-card, .template-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Add keyboard shortcut for theme toggle (Ctrl/Cmd + T)
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 't') {
        e.preventDefault();
        themeManager.toggleTheme();
    }
});
