class TypewriterEffect {
    constructor(element, text, options = {}) {
        this.element = element;
        this.text = text;
        this.speed = options.speed || 100;
        this.deleteSpeed = options.deleteSpeed || 50;
        this.pauseTime = options.pauseTime || 2000;
        this.currentIndex = 0;
        this.isDeleting = false;
        
        this.type();
    }

    type() {
        const currentText = this.text.substring(0, this.currentIndex);
        this.element.textContent = currentText;

        if (!this.isDeleting && this.currentIndex < this.text.length) {
            this.currentIndex++;
            setTimeout(() => this.type(), this.speed + Math.random() * 50);
        } else if (this.isDeleting && this.currentIndex > 0) {
            this.currentIndex--;
            setTimeout(() => this.type(), this.deleteSpeed);
        } else if (!this.isDeleting && this.currentIndex === this.text.length) {
            this.element.classList.add('typing-complete');
            setTimeout(() => {
                this.isDeleting = true;
                this.element.classList.remove('typing-complete');
                this.type();
            }, this.pauseTime);
        } else if (this.isDeleting && this.currentIndex === 0) {
            this.isDeleting = false;
            setTimeout(() => this.type(), 500);
        }
    }
}

// Animation pour texte en cascade
class CascadeTypewriter {
    constructor(elements, texts, options = {}) {
        this.elements = elements;
        this.texts = texts;
        this.speed = options.speed || 80;
        this.delay = options.delay || 1000;
        
        this.startSequence();
    }

    async typeText(element, text) {
        return new Promise((resolve) => {
            let index = 0;
            element.textContent = '';
            const typing = () => {
                if (index < text.length) {
                    element.textContent += text.charAt(index);
                    index++;
                    setTimeout(typing, this.speed + Math.random() * 40);
                } else {
                    element.classList.add('typing-complete');
                    resolve();
                }
            };
            typing();
        });
    }

    async startSequence() {
        for (let i = 0; i < this.elements.length; i++) {
            if (i > 0) {
                await new Promise(resolve => setTimeout(resolve, this.delay));
            }
            await this.typeText(this.elements[i], this.texts[i]);
        }
    }
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    // Démarrer les animations typewriter
    startTypewriterAnimations();
    
    // Animation d'apparition progressive des sections professionnelles
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Délai progressif pour les animations
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    
                    // Animation des éléments enfants
                    const textElements = entry.target.querySelectorAll('.section-text');
                    const visualElements = entry.target.querySelectorAll('.section-visual');
                    
                    textElements.forEach((el, i) => {
                        setTimeout(() => {
                            el.classList.add('animate-fade-left');
                        }, i * 200);
                    });
                    
                    visualElements.forEach((el, i) => {
                        setTimeout(() => {
                            el.classList.add('animate-fade-right');
                        }, i * 200 + 100);
                    });
                    
                    // Animation spéciale pour les cartes de compétences
                    const skillCards = entry.target.querySelectorAll('.skill-card');
                    skillCards.forEach((card, i) => {
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, i * 150 + 300);
                    });
                    
                    // Animation pour les éléments de portfolio
                    const portfolioItems = entry.target.querySelectorAll('.portfolio-item');
                    portfolioItems.forEach((item, i) => {
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, i * 200 + 400);
                    });
                    
                }, index * 100);
            }
        });
    }, observerOptions);
    
    // Observer toutes les sections professionnelles
    document.querySelectorAll('.section-professional').forEach(section => {
        // Initialiser l'état des sections
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        section.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        
        // Initialiser les cartes de compétences
        section.querySelectorAll('.skill-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        
        // Initialiser les éléments de portfolio
        section.querySelectorAll('.portfolio-item').forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px)';
            item.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        
        observer.observe(section);
    });
    
    // Amélioration des interactions avec les formulaires
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.style.borderColor = '#695aa6';
            this.style.boxShadow = '0 0 0 3px rgba(105, 90, 166, 0.1)';
        });
        
        input.addEventListener('blur', function() {
            this.style.borderColor = '#e1e5e9';
            this.style.boxShadow = 'none';
        });
    });
    
    // Animation pour les statistiques
    const statsNumbers = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = target.textContent.replace('+', '');
                let currentValue = 0;
                const increment = finalValue / 50;
                
                const counter = setInterval(() => {
                    currentValue += increment;
                    if (currentValue >= finalValue) {
                        target.textContent = finalValue + '+';
                        clearInterval(counter);
                    } else {
                        target.textContent = Math.floor(currentValue) + '+';
                    }
                }, 50);
                
                statsObserver.unobserve(target);
            }
        });
    });
    
    statsNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });
});

function startTypewriterAnimations() {
    const heroElement = document.querySelector('.text-hero');
    const impactElement = document.querySelector('.text-impact');
    
    if (heroElement && impactElement) {
        // Réinitialiser le contenu
        heroElement.textContent = '';
        impactElement.textContent = '';
        heroElement.classList.remove('typing-complete');
        impactElement.classList.remove('typing-complete');
        
        // Démarrer l'animation en cascade
        new CascadeTypewriter(
            [heroElement, impactElement],
            ['Hello World!', 'Je suis Salomon'],
            { 
                speed: 120, 
                delay: 800
            }
        );
    }
}

// Fonction pour smooth scroll améliorée
function smoothScrollTo(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Effet de parallaxe léger pour les sections
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const sections = document.querySelectorAll('.section-professional');
    
    sections.forEach((section, index) => {
        const rate = scrolled * -0.5;
        const background = section.querySelector('.section-visual');
        if (background) {
            background.style.transform = `translateY(${rate * 0.1}px)`;
        }
    });
});
