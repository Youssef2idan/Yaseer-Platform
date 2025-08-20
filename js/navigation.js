// Navigation and Authentication Management
class NavigationManager {
    constructor() {
        this.isAuthenticated = false;
        this.currentUser = null;
        this.currentLanguage = 'ar'; // Default language
        this.init();
    }

    init() {
        console.log('NavigationManager initialized');
        this.setupMobileMenu();
        this.setupUserDropdown();
        this.setupAuthenticationState();
        this.setupLanguageToggle();
        this.setupClickOutsideListeners();
        this.setupDemoButtons();
        this.updateSystemStatus();
    }

    setupMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mobileMenu = document.getElementById('mobileMenu');

        console.log('Setting up mobile menu:', { mobileMenuBtn, mobileMenu });

        if (mobileMenuBtn && mobileMenu) {
            console.log('Mobile menu elements found, setting up event listeners');
            
            // Toggle mobile menu
            mobileMenuBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Mobile menu button clicked');
                
                const isHidden = mobileMenu.classList.contains('hidden');
                console.log('Menu is hidden:', isHidden);
                
                if (isHidden) {
                    mobileMenu.classList.remove('hidden');
                    mobileMenu.classList.add('animate-fade-in-up');
                    console.log('Menu opened');
                } else {
                    mobileMenu.classList.add('hidden');
                    console.log('Menu closed');
                }
            });

            // Close mobile menu when clicking on a link
            const mobileLinks = mobileMenu.querySelectorAll('a');
            console.log('Found mobile links:', mobileLinks.length);
            mobileLinks.forEach(link => {
                link.addEventListener('click', () => {
                    console.log('Mobile link clicked, closing menu');
                    mobileMenu.classList.add('hidden');
                });
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                    mobileMenu.classList.add('hidden');
                }
            });
            
            console.log('Mobile menu setup complete');
        } else {
            console.error('Mobile menu elements not found:', { mobileMenuBtn, mobileMenu });
        }
    }

    setupUserDropdown() {
        const userMenuBtn = document.getElementById('userMenuBtn');
        const userDropdown = document.getElementById('userDropdown');
        const logoutBtn = document.getElementById('logoutBtn');
        const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');

        if (userMenuBtn && userDropdown) {
            userMenuBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                userDropdown.classList.toggle('hidden');
                
                // Rotate arrow icon
                const arrow = userMenuBtn.querySelector('svg');
                if (arrow) {
                    arrow.style.transform = userDropdown.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(180deg)';
                }
            });
        }

        // Logout functionality
        [logoutBtn, mobileLogoutBtn].forEach(btn => {
            if (btn) {
                btn.addEventListener('click', () => {
                    this.logout();
                });
            }
        });
    }

    setupClickOutsideListeners() {
        // Close user dropdown when clicking outside
        document.addEventListener('click', (e) => {
            const userMenuBtn = document.getElementById('userMenuBtn');
            const userDropdown = document.getElementById('userDropdown');
            
            if (userMenuBtn && userDropdown && !userMenuBtn.contains(e.target) && !userDropdown.contains(e.target)) {
                userDropdown.classList.add('hidden');
                const arrow = userMenuBtn.querySelector('svg');
                if (arrow) {
                    arrow.style.transform = 'rotate(0deg)';
                }
            }
        });
    }

    setupAuthenticationState() {
        console.log('Setting up authentication state');
        
        // Check if user is logged in using localStorage
        const savedUser = localStorage.getItem('yaseer_user');
        console.log('Saved user from localStorage:', savedUser);
        
        if (savedUser) {
            try {
                this.currentUser = JSON.parse(savedUser);
                this.isAuthenticated = true;
                console.log('User is authenticated:', this.currentUser);
                this.updateUIForAuthenticatedUser();
            } catch (error) {
                console.error('Error parsing saved user data:', error);
                localStorage.removeItem('yaseer_user');
                this.updateUIForGuestUser();
            }
        } else {
            console.log('No user found, showing guest UI');
            this.updateUIForGuestUser();
        }
    }

    updateUIForAuthenticatedUser() {
        const authSection = document.getElementById('authSection');
        const userSection = document.getElementById('userSection');
        const mobileAuthSection = document.getElementById('mobileAuthSection');
        const mobileUserSection = document.getElementById('mobileUserSection');
        const userName = document.getElementById('userName');
        const mobileUserName = document.getElementById('mobileUserName');

        if (authSection) authSection.classList.add('hidden');
        if (userSection) userSection.classList.remove('hidden');
        if (mobileAuthSection) mobileAuthSection.classList.add('hidden');
        if (mobileUserSection) mobileUserSection.classList.remove('hidden');

        if (userName && this.currentUser) {
            userName.textContent = this.currentUser.name || 'اسم المستخدم';
        }
        if (mobileUserName && this.currentUser) {
            mobileUserName.textContent = this.currentUser.name || 'اسم المستخدم';
        }
    }

    updateUIForGuestUser() {
        const authSection = document.getElementById('authSection');
        const userSection = document.getElementById('userSection');
        const mobileAuthSection = document.getElementById('mobileAuthSection');
        const mobileUserSection = document.getElementById('mobileUserSection');

        if (authSection) authSection.classList.remove('hidden');
        if (userSection) userSection.classList.add('hidden');
        if (mobileAuthSection) mobileAuthSection.classList.remove('hidden');
        if (mobileUserSection) mobileUserSection.classList.add('hidden');
    }

    login(userData) {
        this.currentUser = userData;
        this.isAuthenticated = true;
        localStorage.setItem('yaseer_user', JSON.stringify(userData));
        this.updateUIForAuthenticatedUser();
    }

    logout() {
        this.currentUser = null;
        this.isAuthenticated = false;
        localStorage.removeItem('yaseer_user');
        this.updateUIForGuestUser();
        
        // Close any open dropdowns
        const userDropdown = document.getElementById('userDropdown');
        if (userDropdown) userDropdown.classList.add('hidden');
        
        // Reset arrow rotation
        const userMenuBtn = document.getElementById('userMenuBtn');
        if (userMenuBtn) {
            const arrow = userMenuBtn.querySelector('svg');
            if (arrow) arrow.style.transform = 'rotate(0deg)';
        }
        
        // Redirect to home page
        window.location.href = 'index.html';
    }

    setupLanguageToggle() {
        const langToggle = document.getElementById('langToggle');
        const mobileLangToggle = document.getElementById('mobileLangToggle');

        console.log('Setting up language toggle:', { langToggle, mobileLangToggle });

        // Set initial language state
        this.updateLanguageUI();

        [langToggle, mobileLangToggle].forEach(btn => {
            if (btn) {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log('Language toggle clicked, current language:', this.currentLanguage);
                    this.toggleLanguage();
                });
            }
        });
    }

    toggleLanguage() {
        if (this.currentLanguage === 'ar') {
            this.currentLanguage = 'en';
            document.documentElement.lang = 'en';
            document.documentElement.dir = 'ltr';
        } else {
            this.currentLanguage = 'ar';
            document.documentElement.lang = 'ar';
            document.documentElement.dir = 'rtl';
        }
        
        this.updateLanguageUI();
        
        // Save language preference
        localStorage.setItem('yaseer_language', this.currentLanguage);
    }

    updateLanguageUI() {
        const langTexts = document.querySelectorAll('.lang-text');
        const mobileLangTexts = document.querySelectorAll('.mobile-lang-text');
        
        if (this.currentLanguage === 'ar') {
            langTexts.forEach(el => el.textContent = 'EN');
            mobileLangTexts.forEach(el => el.textContent = 'تغيير اللغة');
        } else {
            langTexts.forEach(el => el.textContent = 'AR');
            mobileLangTexts.forEach(el => el.textContent = 'Change Language');
        }
    }

    setupDemoButtons() {
        const demoLoginBtn = document.getElementById('demoLoginBtn');
        const demoLogoutBtn = document.getElementById('demoLogoutBtn');

        if (demoLoginBtn) {
            demoLoginBtn.addEventListener('click', () => {
                const userData = {
                    name: 'مستخدم تجريبي',
                    code: 'DEMO123'
                };
                this.login(userData);
                
                // Show success message
                demoLoginBtn.textContent = 'تم تسجيل الدخول!';
                demoLoginBtn.classList.remove('bg-green-600', 'hover:bg-green-700');
                demoLoginBtn.classList.add('bg-green-500');
                
                setTimeout(() => {
                    demoLoginBtn.textContent = 'تسجيل دخول تجريبي';
                    demoLoginBtn.classList.remove('bg-green-500');
                    demoLoginBtn.classList.add('bg-green-600', 'hover:bg-green-700');
                }, 2000);
            });
        }

        if (demoLogoutBtn) {
            demoLogoutBtn.addEventListener('click', () => {
                this.logout();
                
                // Show success message
                demoLogoutBtn.textContent = 'تم تسجيل الخروج!';
                demoLogoutBtn.classList.remove('bg-red-600', 'hover:bg-red-700');
                demoLogoutBtn.classList.add('bg-red-500');
                
                setTimeout(() => {
                    demoLogoutBtn.textContent = 'تسجيل خروج';
                    demoLoginBtn.classList.remove('bg-red-500');
                    demoLoginBtn.classList.add('bg-red-600', 'hover:bg-red-700');
                }, 2000);
            });
        }
    }

    updateSystemStatus() {
        const statusElement = document.getElementById('systemStatus');
        if (statusElement) {
            const mobileMenuBtn = document.getElementById('mobileMenuBtn');
            const mobileMenu = document.getElementById('mobileMenu');
            const langToggle = document.getElementById('langToggle');
            
            let status = '✅ JavaScript is working!';
            
            if (mobileMenuBtn && mobileMenu) {
                status += ' | ✅ Mobile menu elements found';
            } else {
                status += ' | ❌ Mobile menu elements missing';
            }
            
            if (langToggle) {
                status += ' | ✅ Language toggle found';
            } else {
                status += ' | ❌ Language toggle missing';
            }
            
            statusElement.innerHTML = status;
            statusElement.classList.remove('text-yellow-800');
            statusElement.classList.add('text-green-800');
        }
    }

    // Method to check if user is authenticated (for external use)
    isUserAuthenticated() {
        return this.isAuthenticated;
    }

    // Method to get current user (for external use)
    getCurrentUser() {
        return this.currentUser;
    }
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing NavigationManager');
    window.navigationManager = new NavigationManager();
    
    // Load saved language preference
    const savedLanguage = localStorage.getItem('yaseer_language');
    if (savedLanguage && window.navigationManager) {
        window.navigationManager.currentLanguage = savedLanguage;
        window.navigationManager.updateLanguageUI();
    }
}); 