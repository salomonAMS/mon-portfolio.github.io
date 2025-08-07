// Optimiseur de ressources critique - Version 2.0
// Gestion avancée du chargement et de l'optimisation des performances

class ResourceOptimizer {
    constructor() {
        this.startTime = performance.now();
        this.loadedResources = new Set();
        this.criticalResourcesLoaded = false;
        this.performanceMetrics = {
            fontLoadTime: 0,
            cssLoadTime: 0,
            jsLoadTime: 0,
            totalLoadTime: 0
        };
        
        this.init();
    }

    init() {
        // Démarrer l'optimisation immédiatement
        this.preloadCriticalResources();
        this.optimizeFontLoading();
        this.monitorPerformance();
        this.setupLazyLoading();
        
        // Écouter l'événement DOMContentLoaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.onDOMReady());
        } else {
            this.onDOMReady();
        }
    }

    preloadCriticalResources() {
        const criticalResources = [
            {
                href: 'assets/css/meyawo.css',
                as: 'style',
                type: 'css'
            },
            {
                href: 'assets/vendors/themify-icons/css/themify-icons.css',
                as: 'style',
                type: 'css'
            },
            {
                href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
                as: 'style',
                type: 'font'
            }
        ];

        criticalResources.forEach(resource => {
            if (!this.loadedResources.has(resource.href)) {
                this.preloadResource(resource);
            }
        });
    }

    preloadResource(resource) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource.href;
        link.as = resource.as;
        
        if (resource.type === 'font') {
            link.crossOrigin = 'anonymous';
        }

        const startTime = performance.now();
        
        link.onload = () => {
            const loadTime = performance.now() - startTime;
            this.performanceMetrics[resource.type + 'LoadTime'] = loadTime;
            this.loadedResources.add(resource.href);
            
            // Appliquer le style si c'est un CSS
            if (resource.as === 'style') {
                link.rel = 'stylesheet';
            }
            
            this.checkCriticalResourcesLoaded();
        };

        link.onerror = () => {
            console.warn(`Erreur de chargement de la ressource: ${resource.href}`);
            this.handleResourceError(resource);
        };

        document.head.appendChild(link);
    }

    optimizeFontLoading() {
        // Utiliser Font Loading API si disponible
        if ('fonts' in document) {
            const fontPromises = [
                new FontFace('Inter', 'url(https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2)', {
                    weight: '400',
                    style: 'normal',
                    display: 'swap'
                }),
                new FontFace('Inter', 'url(https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiA.woff2)', {
                    weight: '500',
                    style: 'normal',
                    display: 'swap'
                })
            ];

            fontPromises.forEach(font => {
                font.load().then((loadedFont) => {
                    document.fonts.add(loadedFont);
                }).catch(err => {
                    console.warn('Erreur de chargement de police:', err);
                });
            });
        }

        // Fallback pour les navigateurs sans Font Loading API
        this.addFontDisplaySwap();
    }

    addFontDisplaySwap() {
        const style = document.createElement('style');
        style.textContent = `
            @font-face {
                font-family: 'Inter';
                src: url('https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2') format('woff2');
                font-weight: 400;
                font-style: normal;
                font-display: swap;
            }
            @font-face {
                font-family: 'Inter';
                src: url('https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiA.woff2') format('woff2');
                font-weight: 500;
                font-style: normal;
                font-display: swap;
            }
        `;
        document.head.appendChild(style);
    }

    monitorPerformance() {
        // Surveiller les métriques Core Web Vitals
        if ('PerformanceObserver' in window) {
            // Largest Contentful Paint (LCP)
            new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const lastEntry = entries[entries.length - 1];
                console.log('LCP:', lastEntry.startTime);
            }).observe({ entryTypes: ['largest-contentful-paint'] });

            // First Input Delay (FID)
            new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntries()) {
                    console.log('FID:', entry.processingStart - entry.startTime);
                }
            }).observe({ entryTypes: ['first-input'] });

            // Cumulative Layout Shift (CLS)
            new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntries()) {
                    if (!entry.hadRecentInput) {
                        console.log('CLS:', entry.value);
                    }
                }
            }).observe({ entryTypes: ['layout-shift'] });
        }
    }

    setupLazyLoading() {
        // Lazy loading pour les images
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        img.classList.add('lazy-loaded');
                        observer.unobserve(img);
                    }
                });
            });

            // Observer toutes les images avec data-src
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    checkCriticalResourcesLoaded() {
        const criticalResourcesCount = 3; // CSS principal, icons, fonts
        if (this.loadedResources.size >= criticalResourcesCount && !this.criticalResourcesLoaded) {
            this.criticalResourcesLoaded = true;
            this.onCriticalResourcesLoaded();
        }
    }

    onCriticalResourcesLoaded() {
        // Cacher le spinner de chargement
        const spinner = document.querySelector('.loading-spinner');
        if (spinner) {
            spinner.style.opacity = '0';
            setTimeout(() => {
                spinner.style.display = 'none';
            }, 300);
        }

        // Ajouter la classe fade-in au body
        document.body.classList.add('fade-in');
        
        // Démarrer les animations
        this.triggerAnimations();
    }

    onDOMReady() {
        this.performanceMetrics.totalLoadTime = performance.now() - this.startTime;
        console.log('Métriques de performance:', this.performanceMetrics);
        
        // Initialiser les fonctionnalités après le chargement
        this.initializeFeatures();
        
        // Précharger les ressources non-critiques
        this.preloadNonCriticalResources();
    }

    triggerAnimations() {
        // Déclencher les animations en cascade
        const animatedElements = document.querySelectorAll('.animate-on-load');
        animatedElements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('animated');
            }, index * 100);
        });
    }

    initializeFeatures() {
        // Initialiser les fonctionnalités qui dépendent du DOM
        this.initSmoothScroll();
        this.initProgressBars();
        this.initTooltips();
    }

    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    initProgressBars() {
        const progressBars = document.querySelectorAll('.progress-bar');
        if (progressBars.length > 0 && 'IntersectionObserver' in window) {
            const progressObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const progressBar = entry.target;
                        const targetWidth = progressBar.dataset.width || '0%';
                        progressBar.style.width = targetWidth;
                        progressObserver.unobserve(progressBar);
                    }
                });
            });

            progressBars.forEach(bar => progressObserver.observe(bar));
        }
    }

    initTooltips() {
        // Initialiser les tooltips personnalisés si Bootstrap n'est pas disponible
        const tooltipElements = document.querySelectorAll('[data-toggle="tooltip"]');
        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', function() {
                const tooltip = document.createElement('div');
                tooltip.className = 'custom-tooltip';
                tooltip.textContent = this.getAttribute('title') || this.getAttribute('data-title');
                document.body.appendChild(tooltip);
                
                const rect = this.getBoundingClientRect();
                tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
                tooltip.style.top = rect.top - tooltip.offsetHeight - 5 + 'px';
            });
            
            element.addEventListener('mouseleave', function() {
                const tooltip = document.querySelector('.custom-tooltip');
                if (tooltip) {
                    tooltip.remove();
                }
            });
        });
    }

    preloadNonCriticalResources() {
        // Précharger les images et autres ressources non-critiques
        const images = [
            'assets/imgs/man.png',
            'assets/imgs/analytics.svg',
            'assets/imgs/toolbox.svg',
            'assets/imgs/responsive.svg'
        ];

        images.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }

    handleResourceError(resource) {
        // Gestion d'erreur avec fallback
        if (resource.type === 'font') {
            // Utiliser les polices système en fallback
            const fallbackStyle = document.createElement('style');
            fallbackStyle.textContent = `
                body, .navbar, .header {
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
                }
            `;
            document.head.appendChild(fallbackStyle);
        }
    }

    // Méthode publique pour obtenir les métriques
    getPerformanceMetrics() {
        return {
            ...this.performanceMetrics,
            loadedResources: this.loadedResources.size,
            criticalResourcesLoaded: this.criticalResourcesLoaded
        };
    }
}

// Initialiser l'optimiseur dès que possible
const resourceOptimizer = new ResourceOptimizer();

// Exporter pour utilisation globale
window.ResourceOptimizer = ResourceOptimizer;
window.resourceOptimizer = resourceOptimizer;
