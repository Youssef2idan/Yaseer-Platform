/**
 * يسير Platform - Main Application File
 * Handles routing, internationalization, localStorage utilities, and toast notifications
 */

// Internationalization object
const i18n = {
    ar: {
        // Navigation
        home: 'الرئيسية',
        programs: 'البرامج',
        nutrition: 'التغذية',
        live: 'الحصص المباشرة',
        progress: 'تتبع التقدم',
        account: 'حسابي',
        login: 'تسجيل الدخول',
        
        // Common
        loading: 'جاري التحميل...',
        error: 'حدث خطأ',
        success: 'تم بنجاح',
        save: 'حفظ',
        cancel: 'إلغاء',
        edit: 'تعديل',
        delete: 'حذف',
        close: 'إغلاق',
        
        // Actions
        start: 'ابدأ',
        explore: 'استكشف',
        join: 'انضم',
        book: 'احجز',
        track: 'تتبع',
        
        // Status
        free: 'مجاني',
        premium: 'مميز',
        active: 'نشط',
        inactive: 'غير نشط'
    },
    en: {
        // Navigation
        home: 'Home',
        programs: 'Programs',
        nutrition: 'Nutrition',
        live: 'Live Classes',
        progress: 'Progress',
        account: 'My Account',
        login: 'Login',
        
        // Common
        loading: 'Loading...',
        error: 'Error occurred',
        success: 'Success',
        save: 'Save',
        cancel: 'Cancel',
        edit: 'Edit',
        delete: 'Delete',
        close: 'Close',
        
        // Actions
        start: 'Start',
        explore: 'Explore',
        join: 'Join',
        book: 'Book',
        track: 'Track',
        
        // Status
        free: 'Free',
        premium: 'Premium',
        active: 'Active',
        inactive: 'Inactive'
    }
};

// Current language state
let currentLang = 'ar';

// Language toggle functionality
function toggleLanguage() {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    
    // Update language toggle button
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        langToggle.textContent = currentLang === 'ar' ? 'EN' : 'AR';
    }
    
    // Update all translatable elements
    updatePageLanguage();
    
    // Save preference
    localStorage.setItem('yaseer_lang', currentLang);
}

// Update page language
function updatePageLanguage() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (i18n[currentLang][key]) {
            element.textContent = i18n[currentLang][key];
        }
    });
}

// Get translated text
function t(key) {
    return i18n[currentLang][key] || key;
}

// LocalStorage utilities
const Storage = {
    set(key, value) {
        try {
            localStorage.setItem(`yaseer_${key}`, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Storage set error:', error);
            return false;
        }
    },
    
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(`yaseer_${key}`);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Storage get error:', error);
            return defaultValue;
        }
    },
    
    remove(key) {
        try {
            localStorage.removeItem(`yaseer_${key}`);
            return true;
        } catch (error) {
            console.error('Storage remove error:', error);
            return false;
        }
    },
    
    clear() {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith('yaseer_')) {
                    localStorage.removeItem(key);
                }
            });
            return true;
        } catch (error) {
            console.error('Storage clear error:', error);
            return false;
        }
    }
};

// Toast notification system
class Toast {
    constructor() {
        this.createToastContainer();
    }
    
    createToastContainer() {
        if (!document.getElementById('toast-container')) {
            const container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'fixed top-4 right-4 z-50 space-y-2';
            if (currentLang === 'ar') {
                container.className = 'fixed top-4 left-4 z-50 space-y-2';
            }
            document.body.appendChild(container);
        }
    }
    
    show(message, type = 'info', duration = 3000) {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        
        const bgColor = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            warning: 'bg-yellow-500',
            info: 'bg-blue-500'
        }[type] || 'bg-blue-500';
        
        toast.className = `${bgColor} text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 translate-x-full opacity-0`;
        if (currentLang === 'ar') {
            toast.className = `${bgColor} text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 -translate-x-full opacity-0`;
        }
        
        toast.innerHTML = `
            <div class="flex items-center justify-between">
                <span>${message}</span>
                <button class="ml-4 text-white hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
        `;
        
        container.appendChild(toast);
        
        // Animate in
        setTimeout(() => {
            toast.classList.remove('translate-x-full', 'opacity-0');
            if (currentLang === 'ar') {
                toast.classList.remove('-translate-x-full');
            }
        }, 100);
        
        // Auto remove
        setTimeout(() => {
            toast.classList.add('translate-x-full', 'opacity-0');
            if (currentLang === 'ar') {
                toast.classList.add('-translate-x-full');
            }
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }
    
    success(message, duration) {
        this.show(message, 'success', duration);
    }
    
    error(message, duration) {
        this.show(message, 'error', duration);
    }
    
    warning(message, duration) {
        this.show(message, 'warning', duration);
    }
    
    info(message, duration) {
        this.show(message, 'info', duration);
    }
}

// Router helpers
const Router = {
    // Navigate to a page
    navigate(page) {
        window.location.href = page;
    },
    
    // Get current page
    getCurrentPage() {
        return window.location.pathname.split('/').pop() || 'index.html';
    },
    
    // Check if current page matches
    isCurrentPage(page) {
        return this.getCurrentPage() === page;
    },
    
    // Update active navigation
    updateActiveNav() {
        const currentPage = this.getCurrentPage();
        const navLinks = document.querySelectorAll('nav a');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage) {
                link.classList.add('text-blue-600');
                link.classList.remove('text-gray-700', 'hover:text-blue-600');
            } else {
                link.classList.remove('text-blue-600');
                link.classList.add('text-gray-700', 'hover:text-blue-600');
            }
        });
    }
};

// Utility functions
const Utils = {
    // Format date
    formatDate(date) {
        if (currentLang === 'ar') {
            return new Intl.DateTimeFormat('ar-SA', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }).format(date);
        } else {
            return new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }).format(date);
        }
    },
    
    // Format number
    formatNumber(num) {
        if (currentLang === 'ar') {
            return new Intl.NumberFormat('ar-SA').format(num);
        } else {
            return new Intl.NumberFormat('en-US').format(num);
        }
    },
    
    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Generate unique ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
};

// Main application file
import { NavigationManager } from './navigation.js';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('يسير Platform loaded successfully!');
    
    // Initialize navigation manager
    window.navigationManager = new NavigationManager();
    
    // Add any additional app initialization here
    setupGlobalEventListeners();
});

function setupGlobalEventListeners() {
    // Global event listeners can be added here
    
    // Example: Handle payment modal clicks
    document.addEventListener('click', function(e) {
        if (e.target.matches('[data-payment-trigger]')) {
            const paymentModal = document.getElementById('paymentModal');
            if (paymentModal) {
                paymentModal.classList.remove('hidden');
            }
        }
    });
    
    // Example: Handle form submissions
    document.addEventListener('submit', function(e) {
        if (e.target.matches('form')) {
            e.preventDefault();
            // Handle form submission
            console.log('Form submitted:', e.target);
        }
    });
}

// Export for use in other modules
export { NavigationManager }; 