// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Detect device capabilities
    const isMobile = window.innerWidth < 768;
    const isLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;

    // 1. Hero Animation Sequence (Only if motion is allowed)
    if (!prefersReducedMotion) {
        const heroTimeline = gsap.timeline();

        heroTimeline
            .from('.badge-pill', { y: -20, opacity: 0, duration: 0.8, ease: 'power3.out' })
            .from('.hero-title', { y: 30, opacity: 0, duration: 1, ease: 'power3.out' }, '-=0.6')
            .from('.hero-subtitle', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
            .from('.hero-btns a', { y: 20, opacity: 0, duration: 0.6, stagger: 0.2, ease: 'back.out(1.7)' }, '-=0.4')
            .from('.hero-stats', { opacity: 0, duration: 0.8 }, '-=0.4')
            .from('.main-hero-img', { x: 50, opacity: 0, rotationY: 15, duration: 1.2, ease: 'power3.out' }, '-=1')
            .from('.floating-card', { y: 30, opacity: 0, scale: 0.8, stagger: 0.15, duration: 0.8, ease: 'back.out(1.7)' }, '-=0.8')
            .from('.floating-illustration', { y: 40, opacity: 0, scale: 0.9, duration: 1, ease: 'power3.out' }, '-=0.6');
    }

    // 2. Scroll Animations with Intersection Observer (Performance)
    if (!prefersReducedMotion) {
        // Section Headers
        gsap.utils.toArray('.section-header').forEach(header => {
            gsap.from(header, {
                scrollTrigger: {
                    trigger: header,
                    start: 'top 85%',
                },
                y: 40,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out'
            });
        });

        // Features Stagger
        gsap.from('.feature-card', {
            scrollTrigger: {
                trigger: '.features-grid',
                start: 'top 80%',
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out'
        });

        // Pricing Cards with Stagger
        gsap.from('.pricing-card-horizontal', {
            scrollTrigger: {
                trigger: '.pricing-grid',
                start: 'top 80%',
            },
            y: 60,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power3.out'
        });

        // Contact Section Zoom
        gsap.from('.contact-wrapper', {
            scrollTrigger: {
                trigger: '.contact',
                start: 'top 80%',
            },
            scale: 0.95,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        });
    }

    // 3. Testimonials Carousel with Enhanced Auto-Scroll
    const track = document.querySelector('.testimonials-track');
    if (track) {
        // Clone items for infinite loop
        const items = track.querySelectorAll('.testimonial-card');
        items.forEach(item => {
            const clone = item.cloneNode(true);
            track.appendChild(clone);
        });

        // GSAP Horizontal Loop with pause on hover
        const animation = gsap.to(track, {
            xPercent: -50,
            ease: "none",
            duration: 30,
            repeat: -1,
            paused: prefersReducedMotion // Pause if reduced motion
        });

        // Pause on hover
        track.addEventListener('mouseenter', () => {
            gsap.to(animation, { timeScale: 0, duration: 0.5 });
        });

        track.addEventListener('mouseleave', () => {
            if (!prefersReducedMotion) {
                gsap.to(animation, { timeScale: 1, duration: 0.5 });
            }
        });

        // Scroll trigger animation for testimonial section
        if (!prefersReducedMotion) {
            gsap.from('.testimonial-card', {
                scrollTrigger: {
                    trigger: '.testimonials',
                    start: 'top 70%',
                },
                y: 60,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: 'power3.out'
            });
        }
    }

    // 4. Enhanced Pricing Toggle Logic with GSAP
    const toggle = document.getElementById('pricing-toggle');
    const cards = document.querySelectorAll('.pricing-card-horizontal');
    const pricingSection = document.querySelector('.pricing');

    if (toggle) {
        toggle.addEventListener('change', function () {
            const isYearly = this.checked;

            // Animate Background
            if (!prefersReducedMotion) {
                if (isYearly) {
                    gsap.to(pricingSection, { backgroundColor: '#F0F9FF', duration: 0.5 });
                } else {
                    gsap.to(pricingSection, { backgroundColor: 'transparent', duration: 0.5 });
                }
            }

            cards.forEach((card, index) => {
                const priceEl = card.querySelector('.price');
                const amountEl = card.querySelector('.amount');
                const periodEl = card.querySelector('.period');
                const badgeEl = card.querySelector('.yearly-discount-badge');

                const monthlyPrice = parseInt(priceEl.getAttribute('data-monthly'));
                const yearlyPrice = parseInt(priceEl.getAttribute('data-yearly'));

                const endValue = isYearly ? yearlyPrice : monthlyPrice;

                // GSAP Animation for Price Change with Counter
                if (!prefersReducedMotion) {
                    gsap.to(amountEl, {
                        innerHTML: endValue,
                        duration: 0.6,
                        snap: { innerHTML: 1 },
                        ease: 'power2.inOut',
                        delay: index * 0.1
                    });

                    // Period Update
                    gsap.to(periodEl, {
                        opacity: 0,
                        duration: 0.2,
                        onComplete: () => {
                            periodEl.textContent = isYearly ? '/yr' : '/mo';
                            gsap.to(periodEl, { opacity: 1, duration: 0.2 });
                        }
                    });

                    // Card Scale Pulse & Glow
                    if (isYearly) {
                        card.classList.add('glow-active');
                        gsap.to(card, {
                            scale: 1.03,
                            duration: 0.3,
                            ease: 'power2.out',
                            yoyo: true,
                            repeat: 1
                        });
                    } else {
                        card.classList.remove('glow-active');
                    }
                } else {
                    // Instant update if reduced motion
                    amountEl.textContent = endValue;
                    periodEl.textContent = isYearly ? '/yr' : '/mo';
                }

                // Show/Hide yearly badge
                if (badgeEl) {
                    if (isYearly) {
                        badgeEl.classList.add('show');
                    } else {
                        badgeEl.classList.remove('show');
                    }
                }
            });
        });
    }

    // 5. Enhanced Particle Background Animation (Optimized)
    const canvas = document.getElementById('hero-particles');
    if (canvas && !prefersReducedMotion && !isLowEndDevice) {
        const ctx = canvas.getContext('2d', { alpha: true });
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let particlesArray;

        // Reduce particle count on mobile
        const particleCount = isMobile ? 30 : 60;

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.directionX = (Math.random() * 0.5) - 0.25;
                this.directionY = (Math.random() * 0.5) - 0.25;
                this.size = Math.random() * 3 + 1;
                this.color = Math.random() > 0.5 ? 'rgba(79, 70, 229, 0.15)' : 'rgba(236, 72, 153, 0.15)';
            }
            update() {
                if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
                if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;
                this.x += this.directionX;
                this.y += this.directionY;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }

        function initParticles() {
            particlesArray = [];
            for (let i = 0; i < particleCount; i++) {
                particlesArray.push(new Particle());
            }
        }

        let animationId;
        function animateParticles() {
            animationId = requestAnimationFrame(animateParticles);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
                particlesArray[i].draw();
            }
        }

        initParticles();
        animateParticles();

        // Throttled resize handler
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                initParticles();
            }, 250);
        });

        // Pause animation when page is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                cancelAnimationFrame(animationId);
            } else {
                animateParticles();
            }
        });
    }

    // 6. Sticky Header with Smooth Transition
    const header = document.getElementById('header');
    let lastScroll = 0;

    const handleScroll = () => {
        const currentScroll = window.scrollY;

        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    };

    // Throttled scroll handler
    let scrollTimer;
    window.addEventListener('scroll', () => {
        if (!scrollTimer) {
            scrollTimer = setTimeout(() => {
                handleScroll();
                updateScrollProgress();
                updateBackToTop();
                scrollTimer = null;
            }, 10);
        }
    });

    // 7. Mobile Menu Toggle
    const mobileMenuIcon = document.querySelector('.mobile-menu-icon');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuIcon) {
        // Click handler
        mobileMenuIcon.addEventListener('click', toggleMenu);

        // Keyboard handler
        mobileMenuIcon.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMenu();
            }
        });

        function toggleMenu() {
            navLinks.classList.toggle('active');
            const icon = mobileMenuIcon.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');

            // Update ARIA
            const isExpanded = navLinks.classList.contains('active');
            mobileMenuIcon.setAttribute('aria-expanded', isExpanded);
        }

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = mobileMenuIcon.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                mobileMenuIcon.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // 8. Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '') return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 9. Scroll Progress Bar
    const scrollProgress = document.getElementById('scrollProgress');

    function updateScrollProgress() {
        if (!scrollProgress) return;

        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.scrollY;
        const progress = (scrolled / documentHeight) * 100;

        scrollProgress.style.width = `${progress}%`;
    }

    // 10. Back to Top Button
    const backToTop = document.getElementById('backToTop');

    function updateBackToTop() {
        if (!backToTop) return;

        if (window.scrollY > 500) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    }

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 11. Form Validation Enhancement
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        const inputs = contactForm.querySelectorAll('input, textarea');

        // Real-time validation
        inputs.forEach(input => {
            input.addEventListener('blur', function () {
                validateField(this);
            });

            input.addEventListener('input', function () {
                // Remove error on input if present
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
        });

        function validateField(field) {
            const value = field.value.trim();
            let isValid = true;

            if (field.hasAttribute('required') && value === '') {
                isValid = false;
            }

            if (field.type === 'email' && value !== '') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                isValid = emailRegex.test(value);
            }

            if (isValid) {
                field.classList.remove('error');
                field.style.borderColor = '';
            } else {
                field.classList.add('error');
                field.style.borderColor = '#EF4444';
            }

            return isValid;
        }

        // Form submission
        contactForm.addEventListener('submit', function (e) {
            let isFormValid = true;

            inputs.forEach(input => {
                if (!validateField(input)) {
                    isFormValid = false;
                }
            });

            if (!isFormValid) {
                e.preventDefault();

                // Focus first error field
                const firstError = contactForm.querySelector('.error');
                if (firstError) {
                    firstError.focus();
                }
            }
        });
    }

    // 12. Lazy Loading Images (Native with fallback)
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.src;
        });
    } else {
        // Fallback for browsers that don't support native lazy loading
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // 13. Initialize AOS (if reduced motion is not preferred)
    if (!prefersReducedMotion && typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out',
            once: true,
            offset: 100
        });
    }

    // 14. Performance: Add will-change hints
    if (!prefersReducedMotion) {
        const animatedElements = document.querySelectorAll('.feature-card, .testimonial-card, .pricing-card-horizontal');

        const observerOptions = {
            root: null,
            rootMargin: '50px',
            threshold: 0.1
        };

        const willChangeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.willChange = 'transform, opacity';
                } else {
                    entry.target.style.willChange = 'auto';
                }
            });
        }, observerOptions);

        animatedElements.forEach(el => willChangeObserver.observe(el));
    }

    // 15. Console Easter Egg (Optional fun element)
    console.log('%cQuickPOS 🚀', 'font-size: 24px; font-weight: bold; color: #4F46E5;');
    console.log('%cLooking for a career in tech? We\'re hiring! Email: careers@quickpos.com', 'font-size: 14px; color: #64748B;');
});
