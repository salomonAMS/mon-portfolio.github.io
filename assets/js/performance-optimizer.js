/**
 * Performance Optimizer
 * Optimisation des performances et gestion du chargement
 */

(function() {
    'use strict';
    
    // ===========================================
    // VARIABLES GLOBALES
    // ===========================================
    
    let isPageLoaded = false;
    let resourcesLoaded = 0;
    let totalResources = 0;
    
    // ===========================================
    // CHARGEMENT PROGRESSIF DES FONTS
    // ===========================================
    
    function loadFontsOptimized() {
        // Chargement progressif des Google Fonts avec fallback
        const fontDisplaySwap = `
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
            @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600;700&display=swap');
            @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap');
        `;
        
        // Création du style optimisé
        const styleElement = document.createElement('style');
        styleElement.textContent = fontDisplaySwap;
        
        // Ajout avec gestion d'erreur
        try {
            document.head.appendChild(styleElement);
            console.log('✓ Fonts optimisées chargées avec display=swap');
        } catch (error) {
            console.warn('⚠ Erreur chargement fonts, utilisation des fallbacks');
            useFallbackFonts();
        }
        
        // Préchargement des fonts critiques
        preloadCriticalFonts();
    }
    
    function preloadCriticalFonts() {
        const criticalFonts = [
            'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2',
            'https://fonts.gstatic.com/s/firacoded/v21/uU9eCBsR6Z2vfE9aq3bL0fxyUs4tcw4W_D1sJV37MOTgOwl_pjPMITpz.woff2'
        ];
        
        criticalFonts.forEach(fontUrl => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = fontUrl;
            link.as = 'font';
            link.type = 'font/woff2';
            link.crossOrigin = 'anonymous';
            
            link.onerror = () => {
                console.warn(`⚠ Impossible de précharger: ${fontUrl}`);
            };
            
            document.head.appendChild(link);
        });
    }
    
    function useFallbackFonts() {
        const fallbackCSS = `
            :root {
                --font-primary: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                --font-code: "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace;
                --font-decorative: "Apple Chancery", "Dancing Script", cursive, serif;
            }
            
            body, .section-title-pro, .section-subtitle-pro {
                font-family: var(--font-primary) !important;
            }
            
            code, pre, .tech-tag, .stat-number {
                font-family: var(--font-code) !important;
            }
            
            .header-title, .highlight {
                font-family: var(--font-decorative) !important;
            }
        `;
        
        const fallbackStyle = document.createElement('style');
        fallbackStyle.textContent = fallbackCSS;
        fallbackStyle.id = 'fallback-fonts';
        document.head.appendChild(fallbackStyle);
    }
    
    // ===========================================
    // GESTION DU CHARGEMENT DES RESSOURCES
    // ===========================================
    
    function initResourceTracking() {
        // Compter les ressources à charger
        const images = document.querySelectorAll('img');
        const links = document.querySelectorAll('link[rel="stylesheet"]');
        const scripts = document.querySelectorAll('script[src]');
        
        totalResources = images.length + links.length + scripts.length;
        
        // Tracker le chargement des images
        images.forEach(img => {
            if (img.complete) {
                resourceLoaded();
            } else {
                img.addEventListener('load', resourceLoaded);
                img.addEventListener('error', resourceLoaded);
            }
        });
        
        // Tracker le chargement des CSS
        links.forEach(link => {
            link.addEventListener('load', resourceLoaded);
            link.addEventListener('error', resourceLoaded);
        });
        
        // Tracker le chargement des scripts
        scripts.forEach(script => {
            script.addEventListener('load', resourceLoaded);
            script.addEventListener('error', resourceLoaded);
        });
    }
    
    function resourceLoaded() {
        resourcesLoaded++;
        updateLoadingProgress();
        
        if (resourcesLoaded >= totalResources) {
            setTimeout(showPage, 300); // Petit délai pour éviter le flash
        }
    }
    
    function updateLoadingProgress() {
        const progress = totalResources > 0 ? (resourcesLoaded / totalResources) * 100 : 100;
        
        // Mise à jour visuelle du spinner (optionnel)
        const spinner = document.querySelector('.spinner');
        if (spinner) {
            spinner.style.borderTopColor = `hsl(${progress * 1.2}, 70%, 50%)`;
        }
    }
    
    function showPage() {
        if (isPageLoaded) return;
        isPageLoaded = true;
        
        const loadingSpinner = document.getElementById('loading-spinner');
        const pageContent = document.getElementById('page-content');
        
        if (pageContent) {
            pageContent.classList.add('loaded');
        }
        
        if (loadingSpinner) {
            loadingSpinner.style.opacity = '0';
            setTimeout(() => {
                loadingSpinner.remove();
            }, 500);
        }
        
        // Lancer les animations d'entrée
        setTimeout(initPageAnimations, 100);
        
        console.log('✓ Page entièrement chargée et optimisée');
    }
    
    // ===========================================
    // ANIMATIONS D'ENTRÉE
    // ===========================================
    
    function initPageAnimations() {
        // Animation progressive des éléments
        const elementsToAnimate = [
            '.header-content',
            '.section-professional',
            '.skill-card',
            '.portfolio-item'
        ];
        
        elementsToAnimate.forEach((selector, index) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach((element, elemIndex) => {
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, (index * 100) + (elemIndex * 50));
            });
        });
    }
    
    // ===========================================
    // OPTIMISATION DES IMAGES
    // ===========================================
    
    function optimizeImages() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            // Lazy loading natif si supporté
            if ('loading' in HTMLImageElement.prototype) {
                img.loading = 'lazy';
            }
            
            // Optimisation des dimensions
            img.addEventListener('load', function() {
                // Vérifier si l'image est plus grande que nécessaire
                const displayWidth = this.offsetWidth;
                const naturalWidth = this.naturalWidth;
                
                if (naturalWidth > displayWidth * 2) {
                    console.info(`📷 Image ${this.src} pourrait être optimisée (${naturalWidth}px → ${displayWidth}px)`);
                }
            });
            
            // Gestion des erreurs d'images
            img.addEventListener('error', function() {
                console.warn(`❌ Erreur chargement image: ${this.src}`);
                
                // Image de fallback si nécessaire
                if (this.src.includes('header.jpg')) {
                    this.style.display = 'none';
                    console.info('🔧 Image header.jpg manquante - masquée');
                }
            });
        });
    }
    
    // ===========================================
    // OPTIMISATION DES PERFORMANCES
    // ===========================================
    
    function optimizePerformance() {
        // Debounce pour les événements fréquents
        let scrollTimeout;
        let resizeTimeout;
        
        // Optimisation du scroll
        window.addEventListener('scroll', function() {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(handleOptimizedScroll, 16); // 60fps
        }, { passive: true });
        
        // Optimisation du resize
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(handleOptimizedResize, 250);
        });
        
        // Préchargement des ressources critiques
        if ('requestIdleCallback' in window) {
            requestIdleCallback(preloadCriticalResources);
        } else {
            setTimeout(preloadCriticalResources, 1000);
        }
    }
    
    function handleOptimizedScroll() {
        // Logique de scroll optimisée
        const scrolled = window.pageYOffset;
        const navbar = document.querySelector('.custom-navbar');
        
        if (navbar) {
            if (scrolled > 50) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = 'none';
            }
        }
    }
    
    function handleOptimizedResize() {
        // Recalculer les éléments responsifs si nécessaire
        if (window.MobileUtils && typeof window.MobileUtils.handleResize === 'function') {
            window.MobileUtils.handleResize();
        }
    }
    
    function preloadCriticalResources() {
        // Précharger les images importantes
        const criticalImages = [
            'assets/imgs/mon logo.png',
            'assets/imgs/télécharger (3).jpeg'
        ];
        
        criticalImages.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }
    
    // ===========================================
    // GESTION DES ERREURS
    // ===========================================
    
    function setupErrorHandling() {
        // Gestion globale des erreurs de ressources
        window.addEventListener('error', function(e) {
            if (e.target !== window) {
                const resource = e.target;
                console.warn(`❌ Erreur de ressource: ${resource.src || resource.href}`);
                
                // Actions correctives spécifiques
                if (resource.tagName === 'IMG') {
                    handleImageError(resource);
                } else if (resource.tagName === 'LINK') {
                    handleCSSError(resource);
                } else if (resource.tagName === 'SCRIPT') {
                    handleScriptError(resource);
                }
            }
        }, true);
    }
    
    function handleImageError(img) {
        // Cacher l'image cassée ou utiliser un placeholder
        img.style.display = 'none';
        console.info(`🔧 Image ${img.src} masquée (erreur de chargement)`);
    }
    
    function handleCSSError(link) {
        console.warn(`⚠ CSS non chargé: ${link.href}`);
        // Continuer avec les styles de fallback
    }
    
    function handleScriptError(script) {
        console.warn(`⚠ Script non chargé: ${script.src}`);
        // Essayer des alternatives si nécessaire
    }
    
    // ===========================================
    // INITIALISATION
    // ===========================================
    
    function init() {
        console.log('🚀 Initialisation de l\'optimiseur de performance');
        
        // Configuration initiale
        setupErrorHandling();
        loadFontsOptimized();
        optimizeImages();
        initResourceTracking();
        optimizePerformance();
        
        // Fallback de sécurité pour l'affichage de la page
        setTimeout(() => {
            if (!isPageLoaded) {
                console.warn('⏰ Timeout - Affichage forcé de la page');
                showPage();
            }
        }, 3000);
        
        console.log('✅ Optimiseur de performance initialisé');
    }
    
    // ===========================================
    // LANCEMENT
    // ===========================================
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Export des utilitaires
    window.PerformanceOptimizer = {
        showPage: showPage,
        optimizeImages: optimizeImages,
        resourceLoaded: resourceLoaded
    };
    
})();
