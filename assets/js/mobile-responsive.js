/**
 * Mobile Responsive JavaScript
 * Gestion complète de l'expérience mobile
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // ===========================================
    // MENU HAMBURGER MOBILE
    // ===========================================
    
    const hamburger = document.getElementById('nav-toggle');
    const navMenu = document.querySelector('.custom-navbar .nav');
    const navLinks = document.querySelectorAll('.custom-navbar .nav .link');
    
    // Toggle menu hamburger
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            this.classList.toggle('is-active');
            navMenu.classList.toggle('show');
            
            // Prévenir le scroll du body quand le menu est ouvert
            if (navMenu.classList.contains('show')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Fermer le menu quand on clique sur un lien
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('is-active');
                navMenu.classList.remove('show');
                document.body.style.overflow = '';
            });
        });
        
        // Fermer le menu quand on clique en dehors
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('is-active');
                navMenu.classList.remove('show');
                document.body.style.overflow = '';
            }
        });
        
        // Fermer le menu avec la touche Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('show')) {
                hamburger.classList.remove('is-active');
                navMenu.classList.remove('show');
                document.body.style.overflow = '';
            }
        });
    }
    
    // ===========================================
    // DETECTION MOBILE ET OPTIMISATIONS
    // ===========================================
    
    function isMobile() {
        return window.innerWidth <= 767;
    }
    
    function isTablet() {
        return window.innerWidth >= 768 && window.innerWidth <= 991;
    }
    
    // ===========================================
    // OPTIMISATION DES ANIMATIONS MOBILE
    // ===========================================
    
    function optimizeAnimationsForMobile() {
        if (isMobile()) {
            // Réduire les animations sur mobile pour de meilleures performances
            const styleSheet = document.createElement('style');
            styleSheet.innerHTML = `
                @media (max-width: 767px) {
                    * {
                        transition-duration: 0.2s !important;
                        animation-duration: 0.2s !important;
                    }
                    
                    .skill-card-details {
                        transform: none !important;
                    }
                }
            `;
            document.head.appendChild(styleSheet);
        }
    }
    
    // ===========================================
    // GESTION DU SCROLL ET NAVIGATION
    // ===========================================
    
    function handleSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - (isMobile() ? 80 : 100);
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Fermer le menu mobile s'il est ouvert
                    if (isMobile() && navMenu && navMenu.classList.contains('show')) {
                        hamburger.classList.remove('is-active');
                        navMenu.classList.remove('show');
                        document.body.style.overflow = '';
                    }
                }
            });
        });
    }
    
    // ===========================================
    // OPTIMISATION DES IMAGES
    // ===========================================
    
    function optimizeImagesForMobile() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            img.addEventListener('load', function() {
                this.style.opacity = '1';
            });
            
            // Lazy loading pour mobile
            if (isMobile() && 'IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            if (img.dataset.src) {
                                img.src = img.dataset.src;
                                img.classList.remove('lazy');
                                imageObserver.unobserve(img);
                            }
                        }
                    });
                });
                
                if (img.dataset.src) {
                    imageObserver.observe(img);
                }
            }
        });
    }
    
    // ===========================================
    // GESTION DE L'ORIENTATION
    // ===========================================
    
    function handleOrientationChange() {
        window.addEventListener('orientationchange', function() {
            setTimeout(() => {
                // Recalculer les dimensions après changement d'orientation
                window.scrollTo(0, window.scrollY);
                
                // Fermer le menu mobile s'il est ouvert
                if (navMenu && navMenu.classList.contains('show')) {
                    hamburger.classList.remove('is-active');
                    navMenu.classList.remove('show');
                    document.body.style.overflow = '';
                }
            }, 100);
        });
    }
    
    // ===========================================
    // OPTIMISATION DES PERFORMANCE MOBILE
    // ===========================================
    
    function optimizePerformanceForMobile() {
        if (isMobile()) {
            // Débounce pour resize
            let resizeTimeout;
            window.addEventListener('resize', function() {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    // Recalculer les éléments si nécessaire
                    handleResponsiveElements();
                }, 250);
            });
            
            // Optimiser les événements scroll
            let scrollTimeout;
            window.addEventListener('scroll', function() {
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    handleScrollEffects();
                }, 16); // 60fps
            });
        }
    }
    
    function handleResponsiveElements() {
        // Ajuster les éléments dynamiquement selon la taille d'écran
        const skillCards = document.querySelectorAll('.skill-card');
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        
        if (isMobile()) {
            skillCards.forEach(card => {
                card.style.minHeight = '180px';
            });
            
            portfolioItems.forEach(item => {
                const img = item.querySelector('.portfolio-image');
                if (img) {
                    img.style.height = '200px';
                }
            });
        }
    }
    
    function handleScrollEffects() {
        // Effets de scroll optimisés pour mobile
        const navbar = document.querySelector('.custom-navbar');
        
        if (navbar) {
            const scrolled = window.scrollY > 50;
            
            if (scrolled) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = 'none';
            }
        }
    }
    
    // ===========================================
    // GESTION DU TOUCH
    // ===========================================
    
    function handleTouchOptimization() {
        // Améliorer les interactions touch
        const touchElements = document.querySelectorAll('.btn, .portfolio-link, .skill-card, .nav .link');
        
        touchElements.forEach(element => {
            element.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.98)';
            });
            
            element.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            });
        });
    }
    
    // ===========================================
    // VALIDATION DES FORMULAIRES MOBILE
    // ===========================================
    
    function optimizeFormsForMobile() {
        const inputs = document.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            // Améliorer l'expérience de saisie sur mobile
            input.addEventListener('focus', function() {
                if (isMobile()) {
                    // Scroll vers l'input en focus avec un délai pour le clavier virtuel
                    setTimeout(() => {
                        this.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center'
                        });
                    }, 300);
                }
            });
            
            // Validation en temps réel
            input.addEventListener('blur', function() {
                if (this.required && !this.value.trim()) {
                    this.style.borderColor = '#ec185d';
                } else {
                    this.style.borderColor = '#695aa6';
                }
            });
        });
    }
    
    // ===========================================
    // INITIALISATION
    // ===========================================
    
    function init() {
        optimizeAnimationsForMobile();
        handleSmoothScrolling();
        optimizeImagesForMobile();
        handleOrientationChange();
        optimizePerformanceForMobile();
        handleTouchOptimization();
        optimizeFormsForMobile();
        handleResponsiveElements();
        
        console.log('Mobile responsive optimizations loaded ✓');
    }
    
    // Lancer l'initialisation
    init();
    
    // ===========================================
    // UTILITAIRES PUBLICS
    // ===========================================
    
    window.MobileUtils = {
        isMobile: isMobile,
        isTablet: isTablet,
        closeMenu: function() {
            if (hamburger && navMenu) {
                hamburger.classList.remove('is-active');
                navMenu.classList.remove('show');
                document.body.style.overflow = '';
            }
        }
    };
});

// ===========================================
// PRÉCHARGEMENT DES RESSOURCES CRITIQUES
// ===========================================

// Précharger les images importantes pour mobile
if (window.innerWidth <= 767) {
    const criticalImages = [
        'assets/imgs/mon logo.png',
        'assets/imgs/télécharger (3).jpeg'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Service Worker pour cache (optionnel - peut être ajouté plus tard)
if ('serviceWorker' in navigator && window.innerWidth <= 767) {
    window.addEventListener('load', function() {
        // Peut être implémenté pour un cache offline
        console.log('Mobile device detected - Service Worker ready for implementation');
    });
}
