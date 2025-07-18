// Navigation functionality
class Navigation {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.hamburger = document.getElementById('hamburger');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');

        this.init();
    }

    init() {
        // Scroll effect
        window.addEventListener('scroll', () => this.handleScroll());

        // Mobile menu toggle
        this.hamburger.addEventListener('click', () => this.toggleMobileMenu());

        // Close mobile menu when clicking on a link
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMobileMenu());
        });

        // Active link highlighting
        window.addEventListener('scroll', () => this.highlightActiveLink());

        // Smooth scrolling for navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', e => this.smoothScroll(e));
        });
    }

    handleScroll() {
        if (window.scrollY > 100) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
    }

    toggleMobileMenu() {
        this.hamburger.classList.toggle('active');
        this.navMenu.classList.toggle('active');

        // Animate hamburger bars
        const bars = this.hamburger.querySelectorAll('.bar');
        bars.forEach((bar, index) => {
            if (this.hamburger.classList.contains('active')) {
                if (index === 0) {
                    bar.style.transform = 'rotate(45deg) translate(6px, 6px)';
                }
                if (index === 1) {
                    bar.style.opacity = '0';
                }
                if (index === 2) {
                    bar.style.transform = 'rotate(-45deg) translate(6px, -6px)';
                }
            } else {
                bar.style.transform = '';
                bar.style.opacity = '';
            }
        });
    }
    
    closeMobileMenu() {
        this.hamburger.classList.remove('active');
        this.navMenu.classList.remove('active');

        const bars = this.hamburger.querySelectorAll('.bar');
        bars.forEach(bar => {
            bar.style.transform = '';
            bar.style.opacity = '';
        });
    }

    highlightActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.pageYOffset + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    smoothScroll(e) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }
}

// Typing animation for hero text
class TypingAnimation {
    constructor(element, texts, speed = 100, pause = 2000) {
        this.element = element;
        this.texts = texts;
        this.speed = speed;
        this.pause = pause;
        this.currentTextIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        
        this.init();
    }

    init() {
        this.type();
    }

    type() {
        const currentText = this.texts[this.currentTextIndex];
        
        if (!this.isDeleting) {
            // Typing
            this.element.textContent = currentText.substring(0, this.currentCharIndex + 1);
            this.currentCharIndex++;
            
            if (this.currentCharIndex === currentText.length) {
                // Finished typing, wait then start deleting
                setTimeout(() => {
                    this.isDeleting = true;
                    this.type();
                }, this.pause);
                return;
            }
        } else {
            // Deleting
            this.element.textContent = currentText.substring(0, this.currentCharIndex - 1);
            this.currentCharIndex--;
            
            if (this.currentCharIndex === 0) {
                // Finished deleting, move to next text
                this.isDeleting = false;
                this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
            }
        }
        
        const timeout = this.isDeleting ? this.speed / 2 : this.speed;
        setTimeout(() => this.type(), timeout);
    }
}

// Simplified project cards
class ProjectCards {
    constructor() {
        this.cards = document.querySelectorAll('.project-card');
        this.init();
    }

    init() {
        this.cards.forEach(card => {
            card.addEventListener('mouseenter', () => this.handleCardHover(card));
            card.addEventListener('mouseleave', () => this.handleCardLeave(card));
            card.addEventListener('click', (e) => this.handleCardClick(e, card));
        });
    }

    handleCardHover(card) {
        const overlay = card.querySelector('.project-overlay');
        if (overlay) {
            overlay.style.opacity = '1';
        }
    }

    handleCardLeave(card) {
        const overlay = card.querySelector('.project-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
        }
    }

    handleCardClick(e, card) {
        // Não executar se clicou diretamente no link
        if (e.target.closest('.project-link')) {
            return;
        }

        const link = card.querySelector('.project-link');
        if (link && link.href && link.href !== window.location.href + '#') {
            // Se tem um link válido, abrir
            window.open(link.href, '_blank');
        } else {
            // Se é projeto privado, mostrar tooltip
            this.showPrivateProjectTooltip(e);
        }
    }

    showPrivateProjectTooltip(e) {
        const existingTooltip = document.querySelector('.project-tooltip');
        if (existingTooltip) {
            existingTooltip.remove();
        }

        const tooltip = document.createElement('div');
        tooltip.className = 'project-tooltip';
        tooltip.innerHTML = `
            <div class="tooltip-content">
                <i class="fas fa-lock"></i>
                <span>Projeto Privado</span>
                <p>Este projeto é comercial e não está disponível publicamente</p>
            </div>
        `;

        tooltip.style.cssText = `
            position: fixed;
            top: ${e.clientY - 10}px;
            left: ${e.clientX + 10}px;
            background: var(--card-bg);
            border: 1px solid var(--primary-color);
            border-radius: 8px;
            padding: 15px;
            z-index: 10000;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            animation: tooltipFadeIn 0.3s ease;
            max-width: 250px;
        `;

        const style = document.createElement('style');
        style.textContent = `
            @keyframes tooltipFadeIn {
                from { opacity: 0; transform: scale(0.8); }
                to { opacity: 1; transform: scale(1); }
            }
            .tooltip-content {
                color: var(--text-primary);
                text-align: center;
            }
            .tooltip-content i {
                color: var(--primary-color);
                font-size: 1.5rem;
                margin-bottom: 8px;
                display: block;
            }
            .tooltip-content span {
                font-weight: 600;
                display: block;
                margin-bottom: 5px;
            }
            .tooltip-content p {
                font-size: 0.9rem;
                color: var(--text-secondary);
                margin: 0;
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(tooltip);

        // Remover tooltip após 3 segundos ou ao clicar fora
        setTimeout(() => {
            if (tooltip.parentNode) {
                tooltip.remove();
            }
        }, 3000);

        const removeTooltip = () => {
            if (tooltip.parentNode) {
                tooltip.remove();
            }
            document.removeEventListener('click', removeTooltip);
        };

        setTimeout(() => {
            document.addEventListener('click', removeTooltip);
        }, 100);
    }
}

// Automatic Translation System
class TranslationSystem {
    constructor() {
        this.currentLanguage = 'pt';
        this.supportedLanguages = ['pt', 'en'];
        this.translations = {};
        this.init();
    }

    async init() {
        this.loadTranslations();
        await this.detectUserLanguage();
        this.applyTranslations();
        this.createLanguageSelector();
    }

    loadTranslations() {
        this.translations = {
            pt: {
                'nav.home': 'Início',
                'nav.about': 'Sobre',
                'nav.skills': 'Habilidades',
                'nav.projects': 'Projetos',
                'nav.contact': 'Contato',
                
                'hero.greeting': 'Olá, eu sou',
                'hero.description': 'CEO da Ruby Verse LTDA, Backend Developer apaixonado por inovação tecnológica e criação de soluções que transformam negócios.',
                'hero.projects': 'Ver Projetos',
                'hero.contact': 'Contato',
                
                'about.title': 'Sobre Mim',
                'skills.title': 'Tecnologias',
                'projects.title': 'Projetos',
                
                'project.rubyverse.title': 'Ruby Verse LTDA',
                'project.rubyverse.desc': 'Marketplace premium de Robux e soluções para gaming. Plataforma robusta com sistema de pagamentos integrado e interface moderna para toda comunidade gamer.',
                'project.duolingo.title': 'Duolingo XP Automator',
                'project.duolingo.desc': 'Script que automatiza práticas do Duolingo para manter sequência e ganhar XP. Sistema com GitHub Actions para automação diária e estudos programados.',
                'project.kanban.title': 'NotifyMe - Sistema Kanban',
                'project.kanban.desc': 'Sistema Kanban completo com Node.js, Express, MongoDB e frontend vanilla. Inclui autenticação JWT, drag & drop, gerenciamento de usuários e tempo real.',
                'project.gamepass.title': 'Painel de Compras Automático',
                'project.gamepass.desc': 'Sistema automatizado para compra de gamepasses com interface intuitiva e processamento em tempo real para máxima eficiência, integrado com API própria.',
                'project.discord.title': 'IA para Discord',
                'project.discord.desc': 'Bot inteligente para Discord com processamento de linguagem natural e funcionalidades avançadas de moderação e interação.',
                'project.microsoft.title': 'Microsoft Code Redeemer',
                'project.microsoft.desc': 'Ferramenta avançada de automação para resgatar códigos promocionais da Microsoft em lote. Usa Selenium para processar múltiplos códigos automaticamente com logs detalhados e tratamento de erros.',
                
                'contact.title': 'Contato',
                'contact.subtitle': 'Entre em Contato',
                'contact.description': 'Interessado em colaborar? Vamos conversar!',
                'contact.email': 'Email',
                'contact.website': 'Website',
                'contact.instagram': 'Instagram'
            },
            
            en: {
                'nav.home': 'Home',
                'nav.about': 'About',
                'nav.skills': 'Skills',
                'nav.projects': 'Projects',
                'nav.contact': 'Contact',
                
                'hero.greeting': 'Hello, I am',
                'hero.description': 'CEO of Ruby Verse LTDA, Backend Developer passionate about technological innovation and creating transformative business solutions.',
                'hero.projects': 'View Projects',
                'hero.contact': 'Contact',
                
                'about.title': 'About Me',
                'skills.title': 'Technologies',
                'projects.title': 'Projects',
                
                'project.rubyverse.title': 'Ruby Verse LTDA',
                'project.rubyverse.desc': 'Premium Robux marketplace and gaming solutions. Robust platform with integrated payment system and modern interface for the entire gaming community.',
                'project.duolingo.title': 'Duolingo XP Automator',
                'project.duolingo.desc': 'Script that automates Duolingo practices to maintain streaks and gain XP. System with GitHub Actions for daily automation and scheduled studies.',
                'project.kanban.title': 'NotifyMe - Kanban System',
                'project.kanban.desc': 'Complete Kanban system with Node.js, Express, MongoDB and vanilla frontend. Includes JWT authentication, drag & drop, user management and real-time updates.',
                'project.gamepass.title': 'Automatic Purchase Panel',
                'project.gamepass.desc': 'Automated system for gamepass purchases with intuitive interface and real-time processing for maximum efficiency, integrated with custom API.',
                'project.discord.title': 'Discord AI',
                'project.discord.desc': 'Intelligent Discord bot with natural language processing and advanced moderation and interaction features.',
                'project.microsoft.title': 'Microsoft Code Redeemer',
                'project.microsoft.desc': 'Advanced automation tool designed to simplify the process of redeeming Microsoft promotional codes in batches. Uses Selenium web automation with detailed logging and error handling.',
                
                'contact.title': 'Contact',
                'contact.subtitle': 'Get in Touch',
                'contact.description': 'Interested in collaborating? Let\'s talk!',
                'contact.email': 'Email',
                'contact.website': 'Website',
                'contact.instagram': 'Instagram'
            }
        };
    }

    async detectUserLanguage() {
        const savedLang = localStorage.getItem('preferred-language');
        if (savedLang && this.supportedLanguages.includes(savedLang)) {
            this.currentLanguage = savedLang;
            return;
        }

        try {
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            
            const countryToLanguage = {
                'US': 'en', 'GB': 'en', 'CA': 'en', 'AU': 'en',
                'BR': 'pt', 'PT': 'pt'
            };
            
            const detectedLang = countryToLanguage[data.country_code] || 'en';
            this.currentLanguage = this.supportedLanguages.includes(detectedLang) ? detectedLang : 'pt';
        } catch {
            const browserLang = navigator.language.substring(0, 2);
            this.currentLanguage = this.supportedLanguages.includes(browserLang) ? browserLang : 'pt';
        }
    }

    applyTranslations() {
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            const translation = this.translations[this.currentLanguage] && this.translations[this.currentLanguage][key];
            if (translation) {
                element.textContent = translation;
            }
        });
        
        document.documentElement.lang = this.currentLanguage === 'pt' ? 'pt-BR' : this.currentLanguage;
    }

    createLanguageSelector() {
        const languageSelector = document.createElement('div');
        languageSelector.className = 'language-selector';
        languageSelector.innerHTML = `
            <div class="language-toggle">
                <i class="fas fa-globe"></i>
                <span>${this.currentLanguage.toUpperCase()}</span>
                <div class="language-dropdown">
                    <div class="language-option" data-lang="pt">🇧🇷 Português</div>
                    <div class="language-option" data-lang="en">🇺🇸 English</div>
                </div>
            </div>
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            .language-selector {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1000;
            }
            
            .language-toggle {
                background: rgba(0, 255, 251, 0.1);
                border: 1px solid rgba(0, 255, 251, 0.3);
                border-radius: 8px;
                padding: 8px 12px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 8px;
                color: var(--primary-color);
                font-size: 0.9rem;
                transition: all 0.3s ease;
                position: relative;
            }
            
            .language-toggle:hover {
                background: rgba(0, 255, 251, 0.2);
            }
            
            .language-dropdown {
                position: absolute;
                top: 100%;
                right: 0;
                background: var(--dark-bg);
                border: 1px solid rgba(0, 255, 251, 0.3);
                border-radius: 8px;
                min-width: 150px;
                opacity: 0;
                visibility: hidden;
                transform: translateY(-10px);
                transition: all 0.3s ease;
                margin-top: 5px;
            }
            
            .language-toggle:hover .language-dropdown {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }
            
            .language-option {
                padding: 10px 15px;
                cursor: pointer;
                transition: background 0.2s ease;
            }
            
            .language-option:hover {
                background: rgba(0, 255, 251, 0.1);
            }
        `;
        document.head.appendChild(style);
        
        languageSelector.addEventListener('click', (e) => {
            if (e.target.classList.contains('language-option')) {
                const newLang = e.target.getAttribute('data-lang');
                this.changeLanguage(newLang);
            }
        });
        
        document.body.appendChild(languageSelector);
    }

    changeLanguage(newLang) {
        if (this.supportedLanguages.includes(newLang)) {
            this.currentLanguage = newLang;
            this.applyTranslations();
            
            const selector = document.querySelector('.language-toggle span');
            if (selector) {
                selector.textContent = newLang.toUpperCase();
            }
            
            localStorage.setItem('preferred-language', newLang);
        }
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize typing animation
    const typingElement = document.getElementById('typing-text');
    if (typingElement) {
        const texts = ['CEO & Fundador', 'Backend Developer', 'Tech Innovator'];
        new TypingAnimation(typingElement, texts);
    }

    // Handle profile image error
    const profileImage = document.querySelector('.profile-photo');
    if (profileImage) {
        profileImage.addEventListener('error', () => {
            console.log('Profile image not found, using fallback');
            profileImage.style.display = 'none';
            const fallback = document.createElement('div');
            fallback.className = 'profile-fallback';
            fallback.innerHTML = '👨‍💼';
            fallback.style.cssText = `
                width: 100%; height: 100%; display: flex; align-items: center; 
                justify-content: center; background: var(--gradient-primary); 
                border-radius: 50%; font-size: 4rem; color: var(--dark-bg);
            `;
            profileImage.parentNode.appendChild(fallback);
        });
    }

    // Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 600,
            once: true,
            offset: 100,
            easing: 'ease-out-cubic'
        });
    }

    // Initialize components
    new Navigation();
    new ProjectCards();
    new TranslationSystem();
});

// Add console message
window.addEventListener('load', () => {
    console.log(`
    🚀 Portfólio Otimizado para Performance!
    
    ╭─────────────────────────────────────╮
    │  ⚡ Design Limpo e Rápido:         │
    │  • Sem partículas pesadas          │
    │  • Navbar simplificada             │
    │  • Skills reorganizadas            │
    │  • Typing text funcionando         │
    │  • Tradução automática             │
    │  • Performance otimizada           │
    ╰─────────────────────────────────────╯
    
    💬 Roda suave em 240Hz!
    📧 contato@rubyverse.store
    `);
});
