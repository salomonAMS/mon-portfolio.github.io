// Script d'initialisation principal - Portfolio optimisé
// Gestionnaire principal de l'application avec optimisations de performance

(function() {
    'use strict';
    
    // Configuration de l'application
    const AppConfig = {
        ANIMATION_DELAY: 100,
        SCROLL_OFFSET: 100,
        TYPING_SPEED: 100,
        PERFORMANCE_BUDGET: 3000, // 3 secondes max pour le chargement critique
        
        // Seuils de performance
        PERFORMANCE_THRESHOLDS: {
            LCP: 2500, // Largest Contentful Paint
            FID: 100,  // First Input Delay
            CLS: 0.1   // Cumulative Layout Shift
        }
    };

    // Gestionnaire principal de l'application
    class PortfolioApp {
        constructor() {
            this.startTime = performance.now();
            this.isInitialized = false;
            this.performanceMetrics = {};
            
            this.init();
        }

        init() {
            // Initialisation immédiate
            this.setupErrorHandling();
            this.detectCapabilities();
            
            // Attendre que le DOM soit prêt
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.onDOMReady());
            } else {
                this.onDOMReady();
            }
            
            // Attendre que tout soit chargé
            window.addEventListener('load', () => this.onWindowLoad());
        }

        setupErrorHandling() {
            // Gestionnaire d'erreurs global
            window.addEventListener('error', (event) => {
                console.error('Erreur JavaScript:', event.error);
                this.handleError(event.error);
            });

            // Gestionnaire d'erreurs pour les promesses non catchées
            window.addEventListener('unhandledrejection', (event) => {
                console.error('Promise rejetée:', event.reason);
                this.handleError(event.reason);
            });
        }

        detectCapabilities() {
            // Détection des capacités du navigateur
            this.capabilities = {
                intersectionObserver: 'IntersectionObserver' in window,
                performanceObserver: 'PerformanceObserver' in window,
                fontLoading: 'fonts' in document,
                webAnimations: 'animate' in HTMLElement.prototype,
                customProperties: CSS.supports('color', 'var(--test)'),
                passiveEvents: this.supportsPassiveEvents(),
                serviceWorker: 'serviceWorker' in navigator
            };

            console.log('Capacités détectées:', this.capabilities);
        }

        supportsPassiveEvents() {
            let passiveSupported = false;
            try {
                const options = {
                    get passive() {
                        passiveSupported = true;
                        return false;
                    }
                };
                window.addEventListener('test', null, options);
                window.removeEventListener('test', null, options);
            } catch(err) {}
            return passiveSupported;
        }

        onDOMReady() {
            console.log('DOM prêt');
            
            // Initialiser les fonctionnalités principales
            this.initializeCore();
            this.initializeAnimations();
            this.initializeNavigation();
            this.initializeSkillCards();
            this.initializeProgressBars();
            this.initializeContactForm();
            
            // Marquer comme initialisé
            this.isInitialized = true;
            
            // Mesurer le temps d'initialisation
            const initTime = performance.now() - this.startTime;
            console.log(`Initialisation terminée en ${initTime.toFixed(2)}ms`);
        }

        onWindowLoad() {
            console.log('Toutes les ressources chargées');
            
            // Cacher le spinner avec animation
            this.hideLoadingSpinner();
            
            // Déclencher les animations finales
            this.triggerFinalAnimations();
            
            // Mesurer les performances finales
            this.measurePerformance();
            
            // Précharger les ressources optionnelles
            this.preloadOptionalResources();
        }

        initializeCore() {
            // Fonctionnalités core de l'application
            this.setupSmoothScrolling();
            this.setupResponsiveBehavior();
            this.setupKeyboardNavigation();
        }

        setupSmoothScrolling() {
            // Scroll fluide pour les liens d'ancrage
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', (e) => {
                    e.preventDefault();
                    const target = document.querySelector(anchor.getAttribute('href'));
                    if (target) {
                        const offsetTop = target.offsetTop - AppConfig.SCROLL_OFFSET;
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    }
                });
            });
        }

        setupResponsiveBehavior() {
            // Gestion responsive avancée
            const mediaQuery = window.matchMedia('(max-width: 768px)');
            
            const handleResponsiveChange = (e) => {
                if (e.matches) {
                    document.body.classList.add('mobile-layout');
                    this.optimizeForMobile();
                } else {
                    document.body.classList.remove('mobile-layout');
                    this.optimizeForDesktop();
                }
            };
            
            mediaQuery.addListener(handleResponsiveChange);
            handleResponsiveChange(mediaQuery);
        }

        setupKeyboardNavigation() {
            // Navigation au clavier pour l'accessibilité
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    document.body.classList.add('keyboard-navigation');
                }
            });
            
            document.addEventListener('mousedown', () => {
                document.body.classList.remove('keyboard-navigation');
            });
        }

        initializeAnimations() {
            if (!this.capabilities.intersectionObserver) {
                // Fallback pour les navigateurs sans IntersectionObserver
                this.initAnimationsFallback();
                return;
            }

            // Observer pour les animations au scroll
            const animationObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                        animationObserver.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            // Observer tous les éléments à animer
            document.querySelectorAll('.animate-on-scroll').forEach(element => {
                animationObserver.observe(element);
            });
        }

        initAnimationsFallback() {
            // Animation simple pour les navigateurs anciens
            window.addEventListener('scroll', () => {
                document.querySelectorAll('.animate-on-scroll').forEach(element => {
                    const rect = element.getBoundingClientRect();
                    if (rect.top < window.innerHeight && rect.bottom > 0) {
                        element.classList.add('animate-in');
                    }
                });
            });
        }

        initializeNavigation() {
            // Navigation mobile avec hamburger
            const navToggle = document.querySelector('.nav-toggle');
            const navMenu = document.querySelector('.nav-menu');
            
            if (navToggle && navMenu) {
                navToggle.addEventListener('click', () => {
                    navMenu.classList.toggle('active');
                    navToggle.classList.toggle('active');
                    document.body.classList.toggle('nav-open');
                });

                // Fermer le menu lors du clic sur un lien
                navMenu.querySelectorAll('a').forEach(link => {
                    link.addEventListener('click', () => {
                        navMenu.classList.remove('active');
                        navToggle.classList.remove('active');
                        document.body.classList.remove('nav-open');
                    });
                });
            }

            // Navigation sticky
            this.initStickyNavigation();
        }

        initStickyNavigation() {
            const navbar = document.querySelector('.custom-navbar');
            if (!navbar) return;

            if (this.capabilities.intersectionObserver) {
                // Utiliser IntersectionObserver pour de meilleures performances
                const sentinel = document.createElement('div');
                sentinel.style.height = '1px';
                document.body.insertBefore(sentinel, document.body.firstChild);

                const observer = new IntersectionObserver(([entry]) => {
                    navbar.classList.toggle('scrolled', !entry.isIntersecting);
                });

                observer.observe(sentinel);
            } else {
                // Fallback avec scroll event
                let ticking = false;
                window.addEventListener('scroll', () => {
                    if (!ticking) {
                        requestAnimationFrame(() => {
                            navbar.classList.toggle('scrolled', window.scrollY > 50);
                            ticking = false;
                        });
                        ticking = true;
                    }
                });
            }
        }

        initializeSkillCards() {
            // Cartes de compétences avec animations
            const skillCards = document.querySelectorAll('.skill-card');
            
            skillCards.forEach((card, index) => {
                // Délai d'animation basé sur l'index
                card.style.setProperty('--animation-delay', `${index * AppConfig.ANIMATION_DELAY}ms`);
                
                // Effet hover amélioré
                card.addEventListener('mouseenter', () => {
                    card.classList.add('hovered');
                });
                
                card.addEventListener('mouseleave', () => {
                    card.classList.remove('hovered');
                });
            });
        }

        initializeProgressBars() {
            if (!this.capabilities.intersectionObserver) {
                return;
            }

            const progressObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const progressBar = entry.target.querySelector('.progress-bar');
                        if (progressBar) {
                            const percentage = progressBar.dataset.percentage || '0';
                            this.animateProgressBar(progressBar, percentage);
                        }
                        progressObserver.unobserve(entry.target);
                    }
                });
            });

            document.querySelectorAll('.progress-item').forEach(item => {
                progressObserver.observe(item);
            });
        }

        animateProgressBar(progressBar, targetPercentage) {
            let currentPercentage = 0;
            const increment = targetPercentage / 60; // 60 frames pour 1 seconde
            
            const animate = () => {
                currentPercentage += increment;
                if (currentPercentage >= targetPercentage) {
                    currentPercentage = targetPercentage;
                    progressBar.style.width = currentPercentage + '%';
                    return;
                }
                
                progressBar.style.width = currentPercentage + '%';
                requestAnimationFrame(animate);
            };
            
            animate();
        }

        initializeContactForm() {
            const form = document.querySelector('#contact-form');
            if (!form) return;

            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission(form);
            });

            // Validation en temps réel
            form.querySelectorAll('input, textarea').forEach(field => {
                field.addEventListener('blur', () => {
                    this.validateField(field);
                });
            });
        }

        validateField(field) {
            const value = field.value.trim();
            let isValid = true;

            // Validation basique
            if (field.required && !value) {
                isValid = false;
            }

            if (field.type === 'email' && value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                isValid = emailRegex.test(value);
            }

            // Mettre à jour l'UI
            field.classList.toggle('invalid', !isValid);
            field.classList.toggle('valid', isValid && value);

            return isValid;
        }

        handleFormSubmission(form) {
            // Valider tous les champs
            let isFormValid = true;
            form.querySelectorAll('input, textarea').forEach(field => {
                if (!this.validateField(field)) {
                    isFormValid = false;
                }
            });

            if (isFormValid) {
                // Simuler l'envoi (remplacer par votre logique)
                this.showFormSuccess();
            } else {
                this.showFormError('Veuillez corriger les erreurs dans le formulaire.');
            }
        }

        showFormSuccess() {
            // Afficher le message de succès
            console.log('Formulaire envoyé avec succès!');
        }

        showFormError(message) {
            // Afficher le message d'erreur
            console.error('Erreur du formulaire:', message);
        }

        optimizeForMobile() {
            // Optimisations spécifiques mobile
            console.log('Mode mobile activé');
        }

        optimizeForDesktop() {
            // Optimisations spécifiques desktop
            console.log('Mode desktop activé');
        }

        hideLoadingSpinner() {
            const spinner = document.getElementById('loadingSpinner');
            if (spinner) {
                spinner.style.opacity = '0';
                setTimeout(() => {
                    spinner.style.display = 'none';
                    document.body.classList.add('loaded');
                }, 300);
            }
        }

        triggerFinalAnimations() {
            // Animations finales après chargement
            document.body.classList.add('animations-ready');
            
            // Déclencher l'effet typewriter s'il existe
            const typewriterElement = document.querySelector('.typewriter-text');
            if (typewriterElement && window.TypewriterEffect) {
                new window.TypewriterEffect(typewriterElement);
            }
        }

        measurePerformance() {
            // Mesurer les métriques de performance
            if (this.capabilities.performanceObserver) {
                this.setupPerformanceObserver();
            }

            // Navigation Timing
            const perfData = performance.getEntriesByType('navigation')[0];
            if (perfData) {
                this.performanceMetrics = {
                    domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                    loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
                    totalTime: performance.now() - this.startTime
                };
                
                console.log('Métriques de performance:', this.performanceMetrics);
            }
        }

        setupPerformanceObserver() {
            // Observer pour les Core Web Vitals
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    console.log(`${entry.entryType}:`, entry);
                }
            });

            observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'first-input', 'layout-shift'] });
        }

        preloadOptionalResources() {
            // Précharger les ressources optionnelles
            const optionalImages = [
                'assets/imgs/analytics.svg',
                'assets/imgs/toolbox.svg',
                'assets/imgs/responsive.svg'
            ];

            optionalImages.forEach(src => {
                const link = document.createElement('link');
                link.rel = 'prefetch';
                link.href = src;
                document.head.appendChild(link);
            });
        }

        handleError(error) {
            // Gestion gracieuse des erreurs
            console.warn('Erreur gérée:', error);
            
            // Continuer le fonctionnement de base
            if (!this.isInitialized) {
                setTimeout(() => this.onDOMReady(), 100);
            }
        }

        // API publique
        getMetrics() {
            return {
                ...this.performanceMetrics,
                capabilities: this.capabilities,
                isInitialized: this.isInitialized
            };
        }
    }

    // Initialiser l'application
    const app = new PortfolioApp();
    
    // Exposer globalement pour le debugging
    window.PortfolioApp = app;
    
})();
