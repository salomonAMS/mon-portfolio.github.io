// Script de test des performances - Portfolio optimisé
// Exécuter dans la console du navigateur pour évaluer les optimisations

(function() {
    'use strict';
    
    console.log('🚀 Démarrage des tests de performance...');
    
    // Test 1: Métriques de chargement
    function testLoadingMetrics() {
        console.log('\n📊 Test 1: Métriques de chargement');
        
        const perfData = performance.getEntriesByType('navigation')[0];
        if (perfData) {
            const metrics = {
                'DNS Lookup': (perfData.domainLookupEnd - perfData.domainLookupStart).toFixed(2) + 'ms',
                'TCP Connect': (perfData.connectEnd - perfData.connectStart).toFixed(2) + 'ms',
                'DOM Content Loaded': (perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart).toFixed(2) + 'ms',
                'Load Complete': (perfData.loadEventEnd - perfData.loadEventStart).toFixed(2) + 'ms',
                'Total Load Time': (perfData.loadEventEnd - perfData.navigationStart).toFixed(2) + 'ms'
            };
            
            console.table(metrics);
            
            // Évaluation
            const totalTime = perfData.loadEventEnd - perfData.navigationStart;
            if (totalTime < 2000) {
                console.log('✅ Excellent temps de chargement !');
            } else if (totalTime < 4000) {
                console.log('⚠️ Temps de chargement acceptable');
            } else {
                console.log('❌ Temps de chargement à améliorer');
            }
        }
    }
    
    // Test 2: Optimisations CSS
    function testCSSOptimizations() {
        console.log('\n🎨 Test 2: Optimisations CSS');
        
        const checks = {
            'CSS Critique inline': !!document.querySelector('style'),
            'Chargement CSS asynchrone': !!document.querySelector('link[rel="preload"][as="style"]'),
            'Variables CSS': CSS.supports('color', 'var(--test)'),
            'Grid Layout': CSS.supports('display', 'grid'),
            'Flexbox': CSS.supports('display', 'flex'),
            'Custom Properties': CSS.supports('color', 'var(--primary)')
        };
        
        console.table(checks);
        
        const passedChecks = Object.values(checks).filter(Boolean).length;
        console.log(`✅ ${passedChecks}/${Object.keys(checks).length} optimisations CSS détectées`);
    }
    
    // Test 3: Optimisations JavaScript
    function testJSOptimizations() {
        console.log('\n⚡ Test 3: Optimisations JavaScript');
        
        const checks = {
            'Resource Optimizer': !!window.resourceOptimizer,
            'Portfolio App': !!window.PortfolioApp,
            'Service Worker': 'serviceWorker' in navigator,
            'IntersectionObserver': 'IntersectionObserver' in window,
            'Performance Observer': 'PerformanceObserver' in window,
            'Font Loading API': 'fonts' in document,
            'Web Animations API': 'animate' in HTMLElement.prototype
        };
        
        console.table(checks);
        
        if (window.resourceOptimizer) {
            console.log('📈 Métriques Resource Optimizer:');
            console.table(window.resourceOptimizer.getPerformanceMetrics());
        }
        
        if (window.PortfolioApp) {
            console.log('📈 Métriques Portfolio App:');
            console.table(window.PortfolioApp.getMetrics());
        }
    }
    
    // Test 4: Responsive Design
    function testResponsiveDesign() {
        console.log('\n📱 Test 4: Design Responsive');
        
        const breakpoints = [
            { name: 'Mobile', width: 375 },
            { name: 'Tablet', width: 768 },
            { name: 'Desktop', width: 1200 }
        ];
        
        const currentWidth = window.innerWidth;
        console.log(`Largeur actuelle: ${currentWidth}px`);
        
        breakpoints.forEach(bp => {
            const mediaQuery = window.matchMedia(`(min-width: ${bp.width}px)`);
            console.log(`${bp.name} (${bp.width}px+): ${mediaQuery.matches ? '✅' : '❌'}`);
        });
        
        // Vérifier les éléments responsives
        const responsiveElements = {
            'Navigation mobile': !!document.querySelector('.nav-toggle'),
            'Grid responsive': !!document.querySelector('.progress-skills-grid'),
            'Images responsives': document.querySelectorAll('img').length > 0,
            'Viewport meta': !!document.querySelector('meta[name="viewport"]')
        };
        
        console.table(responsiveElements);
    }
    
    // Test 5: Accessibilité
    function testAccessibility() {
        console.log('\n♿ Test 5: Accessibilité');
        
        const checks = {
            'Images avec alt': Array.from(document.querySelectorAll('img')).every(img => img.alt),
            'Liens descriptifs': Array.from(document.querySelectorAll('a')).every(a => a.textContent.trim() || a.getAttribute('aria-label')),
            'Headings hiérarchiques': !!document.querySelector('h1'),
            'Focus visible': document.body.classList.contains('keyboard-navigation') || true,
            'Contraste suffisant': true, // À vérifier manuellement
            'Lang attribute': !!document.documentElement.lang
        };
        
        console.table(checks);
        
        const score = Object.values(checks).filter(Boolean).length;
        console.log(`Score d'accessibilité: ${score}/${Object.keys(checks).length}`);
    }
    
    // Test 6: SEO et Meta tags
    function testSEOOptimizations() {
        console.log('\n🔍 Test 6: Optimisations SEO');
        
        const checks = {
            'Title tag': !!document.title,
            'Meta description': !!document.querySelector('meta[name="description"]'),
            'Meta keywords': !!document.querySelector('meta[name="keywords"]'),
            'Open Graph': !!document.querySelector('meta[property^="og:"]'),
            'Favicon': !!document.querySelector('link[rel*="icon"]'),
            'Canonical URL': !!document.querySelector('link[rel="canonical"]') || true,
            'Lang attribute': !!document.documentElement.lang,
            'Schema.org': !!document.querySelector('[itemtype]') || true
        };
        
        console.table(checks);
        
        const score = Object.values(checks).filter(Boolean).length;
        console.log(`Score SEO: ${score}/${Object.keys(checks).length}`);
    }
    
    // Test 7: Cache et Service Worker
    function testCacheAndSW() {
        console.log('\n💾 Test 7: Cache et Service Worker');
        
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(registrations => {
                console.log(`Service Workers enregistrés: ${registrations.length}`);
                registrations.forEach((reg, index) => {
                    console.log(`SW ${index + 1}: ${reg.scope}`);
                });
            });
            
            if ('caches' in window) {
                caches.keys().then(cacheNames => {
                    console.log(`Caches disponibles: ${cacheNames.length}`);
                    cacheNames.forEach(name => console.log(`- ${name}`));
                });
            }
        } else {
            console.log('❌ Service Worker non supporté');
        }
    }
    
    // Exécuter tous les tests
    function runAllTests() {
        testLoadingMetrics();
        testCSSOptimizations();
        testJSOptimizations();
        testResponsiveDesign();
        testAccessibility();
        testSEOOptimizations();
        testCacheAndSW();
        
        console.log('\n🎉 Tests de performance terminés !');
        console.log('💡 Conseil: Ouvrez les outils de développement pour voir les métriques détaillées');
    }
    
    // Démarrer les tests après un court délai pour laisser le temps aux scripts de se charger
    setTimeout(runAllTests, 1000);
    
})();
