document.addEventListener('DOMContentLoaded', () => {
    // 1. Intersection Observer for Fade-In-Up Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const elementObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                // Optional: stop observing once animated
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all animate-up sections
    document.querySelectorAll('.animate-up').forEach(el => {
        elementObserver.observe(el);
    });

    // 2. Intersection Observer for Staggered Table Rows
    const tableObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const tbody = entry.target;
                tbody.classList.add('in-view');
                const rows = tbody.querySelectorAll('tr');
                rows.forEach((row, index) => {
                    row.style.transitionDelay = `${index * 0.05}s`;
                });
                observer.unobserve(tbody);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.stagger-rows').forEach(tbody => {
        tableObserver.observe(tbody);
    });

    // 3. Number Counter Animation on Intersection
    const counters = document.querySelectorAll('.counter');
    
    const decimalPlaces = (num) => {
        const match = ('' + num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
        if (!match) return 0;
        return Math.max(
            0,
            (match[1] ? match[1].length : 0) - (match[2] ? +match[2] : 0)
        );
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseFloat(counter.getAttribute('data-target'));
                const duration = 2000; // ms
                const decimals = decimalPlaces(target);
                
                let startTime = null;
                
                const updateCounter = (currentTime) => {
                    if (!startTime) startTime = currentTime;
                    const progress = Math.min((currentTime - startTime) / duration, 1);
                    
                    // Easing func (easeOutExpo)
                    const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                    
                    const currentVal = (easeProgress * target).toFixed(decimals);
                    counter.innerText = currentVal;
                    
                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.innerText = target.toFixed(decimals); // ensure exact target at end
                    }
                };
                
                requestAnimationFrame(updateCounter);
                observer.unobserve(counter);
            }
        });
    }, observerOptions);

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });

    // 4. Navbar transition on scroll
    let lastScrollY = window.scrollY;
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.5)';
        } else {
            navbar.style.boxShadow = 'none';
        }
        lastScrollY = window.scrollY;
    }, { passive: true });
});
