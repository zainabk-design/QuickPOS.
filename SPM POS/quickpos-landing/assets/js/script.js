/**
 * QuickPOS Landing Page - JavaScript
 * Handles pricing toggle, scroll animations, form submission
 * 
 * Features:
 * - Navbar scroll blur effect
 * - Pricing period toggle (monthly/yearly)
 * - Form validation and submission
 * - Scroll-triggered section animations
 * - Mobile menu toggle
 */

// ==================== Configuration ====================
const CONFIG = {
    scrollThreshold: 50,
    animationDuration: 800,
    formResetDelay: 3000,
    errorDisplayDelay: 2000,
};

// ==================== DOM Elements ====================
const navbar = document.getElementById('navbar');
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');
const pricingToggles = document.querySelectorAll('.pricing-toggle');
const pricingCards = document.getElementById('pricing-cards');
const formContact = document.getElementById('form-contact');
const formStatus = document.getElementById('form-status');
const contactForm = document.getElementById('contact-form');
const formName = document.getElementById('form-name');
const formEmail = document.getElementById('form-email');
const formMessage = document.getElementById('form-message');

// ==================== State Management ====================
let currentPricingPeriod = 'monthly';
let isFormSubmitting = false;
let mobileMenuOpen = false;

// ==================== Navbar Scroll Effect ====================
/**
 * Handle navbar blur effect on scroll
 */
function handleNavbarScroll() {
    if (window.scrollY > CONFIG.scrollThreshold) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

window.addEventListener('scroll', handleNavbarScroll);

// ==================== Section Animation on Scroll ====================
/**
 * Animate sections when they come into view
 */
function handleSectionAnimation() {
    const sections = document.querySelectorAll('.section-animate');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });

    sections.forEach(section => observer.observe(section));
}

// Initialize section animations when DOM is ready
document.addEventListener('DOMContentLoaded', handleSectionAnimation);

// ==================== Pricing Toggle ====================
/**
 * Handle pricing period toggle (monthly/yearly)
 */
function setupPricingToggle() {
    pricingToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const period = toggle.getAttribute('data-period');
            changePricingPeriod(period);
        });
    });
}

/**
 * Change pricing period and re-render cards
 */
function changePricingPeriod(period) {
    currentPricingPeriod = period;
    
    // Add animation class to pricing cards container
    pricingCards.classList.add('price-animating');
    
    // Update button states
    pricingToggles.forEach(toggle => {
        const isActive = toggle.getAttribute('data-period') === period;
        if (isActive) {
            toggle.classList.add('active');
            toggle.style.background = 'linear-gradient(135deg, #7c3aed, #3b82f6)';
            toggle.style.color = 'white';
        } else {
            toggle.classList.remove('active');
            toggle.style.background = 'transparent';
            toggle.style.color = '#4b5563';
        }
    });

    // Wait for animation to complete halfway, then update cards
    setTimeout(() => {
        renderPricingCards(period);
        // Remove animation class for next toggle
        setTimeout(() => {
            pricingCards.classList.remove('price-animating');
        }, 300);
    }, 300);
}

/**
 * Render pricing cards based on period
 */
function renderPricingCards(period) {
    if (!pricingData || !pricingData[period]) {
        console.error('Pricing data not found for period:', period);
        return;
    }

    pricingCards.innerHTML = '';
    const plans = pricingData[period];

    plans.forEach((plan, idx) => {
        const card = createPricingCard(plan, idx, period);
        // Add fade-in animation to each card
        card.style.animation = `fadeUp 0.6s ease-out forwards`;
        card.style.animationDelay = `${idx * 0.15}s`;
        pricingCards.appendChild(card);
    });
}

/**
 * Create a pricing card element
 */
function createPricingCard(plan, idx, period) {
    const div = document.createElement('div');
    const periodLabel = period === 'monthly' ? 'mo' : 'yr';
    
    let cardHTML = `
        <div class="bg-white rounded-3xl p-8 card-hover ${
            plan.highlight ? 'ring-4 ring-purple-500 relative' : ''
        }" style="animation-delay: ${idx * 0.1}s;">
    `;

    if (plan.highlight) {
        cardHTML += `
            <div class="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-blue-500 text-white px-6 py-2 rounded-full text-sm font-semibold">
                Most Popular
            </div>
        `;
    }

    cardHTML += `
        <h3 class="text-2xl font-bold mb-2">${escapeHtml(plan.name)}</h3>
        <div class="mb-6 price-display" style="min-height: 60px; display: flex; align-items: center;">
            <span class="text-5xl font-bold gradient-text">$${plan.price}</span>
            <span class="text-gray-500 ml-2">/${periodLabel}</span>
        </div>
        <ul class="space-y-4 mb-8">
    `;

    plan.features.forEach(feature => {
        cardHTML += `
            <li class="flex items-center gap-3">
                <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                </svg>
                <span class="text-gray-700">${escapeHtml(feature)}</span>
            </li>
        `;
    });

    cardHTML += `
        </ul>
        <button class="w-full py-3 rounded-full font-semibold transition ${
            plan.highlight
                ? 'btn-primary text-white'
                : 'border-2 border-purple-600 text-purple-600 hover:bg-purple-50'
        }">
            Get Started
        </button>
        </div>
    `;

    div.innerHTML = cardHTML;
    return div.firstElementChild;
}

// ==================== Form Submission ====================
/**
 * Handle form submission
 */
formContact.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Prevent multiple submissions
    if (isFormSubmitting) return;

    const name = formName.value.trim();
    const email = formEmail.value.trim();
    const message = formMessage.value.trim();

    // Basic validation
    if (!name || !email || !message) {
        showFormStatus('error', 'Please fill in all fields');
        contactForm.classList.add('animate-shake');
        setTimeout(() => {
            contactForm.classList.remove('animate-shake');
        }, 500);
        return;
    }

    // Email validation
    if (!isValidEmail(email)) {
        showFormStatus('error', 'Please enter a valid email address');
        return;
    }

    isFormSubmitting = true;

    try {
        // Submit form to PHP backend
        const response = await fetch('submit.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: `name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&message=${encodeURIComponent(message)}`
        });

        const data = await response.json();

        if (data.success) {
            // Redirect to thank-you page
            window.location.href = 'thank-you.html';
        } else {
            showFormStatus('error', data.message || 'Failed to send message. Please try again.');
        }
    } catch (error) {
        console.error('Form submission error:', error);
        showFormStatus('error', 'An error occurred. Please try again later.');
    } finally {
        isFormSubmitting = false;
    }
});

/**
 * Display form status message
 */
function showFormStatus(type, message) {
    const statusClass = type === 'success' ? 'success' : 'error';
    const icon = type === 'success' ? 
        '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>' :
        '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path></svg>';
    
    const bgClass = type === 'success' ? 'bg-green-50' : 'bg-red-50';
    const textClass = type === 'success' ? 'text-green-700' : 'text-red-700';

    formStatus.innerHTML = `
        <div class="flex items-center gap-3 p-4 ${bgClass} rounded-xl ${textClass} animate-fadeUp">
            ${icon}
            <span class="font-semibold">${escapeHtml(message)}</span>
        </div>
    `;
    formStatus.style.display = 'flex';

    if (type === 'error') {
        setTimeout(() => {
            formStatus.style.display = 'none';
        }, CONFIG.errorDisplayDelay);
    }
}

// ==================== Mobile Menu Toggle ====================
/**
 * Handle mobile menu toggle
 */
menuToggle.addEventListener('click', () => {
    mobileMenuOpen = !mobileMenuOpen;
    if (mobileMenuOpen) {
        navLinks.style.display = 'flex';
        navLinks.style.flexDirection = 'column';
    } else {
        navLinks.style.display = 'none';
    }
});

// Close menu when a link is clicked
document.querySelectorAll('#nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuOpen = false;
        navLinks.style.display = 'none';
    });
});

// ==================== Utility Functions ====================
/**
 * Validate email format
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ==================== Initialize ====================
/**
 * Initialize all components
 */
function initialize() {
    // Setup pricing toggle
    setupPricingToggle();
    
    // Render initial pricing cards
    renderPricingCards(currentPricingPeriod);
    
    // Set active pricing toggle button
    document.querySelector(`[data-period="monthly"]`).classList.add('active');
    document.querySelector(`[data-period="monthly"]`).style.background = 'linear-gradient(135deg, #7c3aed, #3b82f6)';
    document.querySelector(`[data-period="monthly"]`).style.color = 'white';
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    initialize();
}

// ==================== Smooth Scroll for Anchor Links ====================
/**
 * Smooth scroll for navigation links
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==================== Performance: Lazy Load Animations ====================
/**
 * Use Intersection Observer for better performance
 */
function observeElements() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all animatable elements
    document.querySelectorAll('.section-animate, .card-hover').forEach(el => {
        observer.observe(el);
    });
}

document.addEventListener('DOMContentLoaded', observeElements);

// ==================== Accessibility Enhancements ====================
/**
 * Handle keyboard navigation for pricing toggle
 */
document.querySelectorAll('.pricing-toggle').forEach(toggle => {
    toggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggle.click();
        }
    });
});
