// Account Management System
import { Auth } from './auth.js';

class AccountManager {
    constructor() {
        this.guestView = document.getElementById('guestView');
        this.userView = document.getElementById('userView');
        this.nameInput = document.getElementById('nameInput');
        this.codeInput = document.getElementById('codeInput');
        this.loginBtn = document.getElementById('loginBtn');
        this.logoutBtn = document.getElementById('logoutBtn');
        this.userName = document.getElementById('userName');
        this.userCode = document.getElementById('userCode');
        this.subStatus = document.getElementById('subStatus');
        this.subUntil = document.getElementById('subUntil');
        this.subDaysLeft = document.getElementById('subDaysLeft');
        this.editProfileBtn = document.getElementById('editProfile');
        this.saveChangesBtn = document.getElementById('saveChanges');
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.refresh();
        this.setupFormValidation();
    }

    setupEventListeners() {
        if (this.loginBtn) {
            this.loginBtn.addEventListener('click', () => this.handleLogin());
        }
        
        if (this.logoutBtn) {
            this.logoutBtn.addEventListener('click', () => this.handleLogout());
        }
        
        if (this.editProfileBtn) {
            this.editProfileBtn.addEventListener('click', () => this.enableEditMode());
        }
        
        if (this.saveChangesBtn) {
            this.saveChangesBtn.addEventListener('click', () => this.saveProfile());
        }

        // Enter key support
        if (this.codeInput) {
            this.codeInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleLogin();
                }
            });
        }
    }

    setupFormValidation() {
        if (this.nameInput) {
            this.nameInput.addEventListener('input', () => this.validateForm());
        }
        
        if (this.codeInput) {
            this.codeInput.addEventListener('input', () => this.validateForm());
        }
    }

    validateForm() {
        const name = this.nameInput?.value.trim() || '';
        const code = this.codeInput?.value.trim() || '';
        const isValid = name.length >= 2 && code.length >= 4;
        
        if (this.loginBtn) {
            this.loginBtn.disabled = !isValid;
            this.loginBtn.classList.toggle('opacity-50', !isValid);
            this.loginBtn.classList.toggle('cursor-not-allowed', !isValid);
        }
        
        return isValid;
    }

    async handleLogin() {
        if (!this.validateForm()) {
            this.showNotification('يرجى إدخال بيانات صحيحة', 'error');
            return;
        }

        const name = this.nameInput.value.trim();
        const code = this.codeInput.value.trim();

        try {
            // Show loading state
            this.setLoginLoading(true);
            
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Login
            Auth.login({ name, code });
            
            this.showNotification('تم تسجيل الدخول بنجاح! 🎉', 'success');
            
            // Clear form
            this.nameInput.value = '';
            this.codeInput.value = '';
            
            // Refresh view
            this.refresh();
            
            // Redirect if needed
            const redirect = new URL(window.location.href).searchParams.get('redirect');
            if (redirect) {
                setTimeout(() => {
                    window.location.href = redirect;
                }, 1500);
            }
            
        } catch (error) {
            this.showNotification('حدث خطأ في تسجيل الدخول', 'error');
        } finally {
            this.setLoginLoading(false);
        }
    }

    setLoginLoading(loading) {
        if (this.loginBtn) {
            this.loginBtn.disabled = loading;
            if (loading) {
                this.loginBtn.innerHTML = `
                    <svg class="animate-spin w-5 h-5 inline ml-2" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    جاري تسجيل الدخول...
                `;
            } else {
                this.loginBtn.innerHTML = `
                    <svg class="w-5 h-5 inline ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                    </svg>
                    دخول
                `;
            }
        }
    }

    handleLogout() {
        // Show confirmation dialog
        if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
            Auth.logout();
            this.showNotification('تم تسجيل الخروج بنجاح', 'info');
            this.refresh();
        }
    }

    enableEditMode() {
        // Enable editing of profile fields
        this.showNotification('وضع التعديل مفعل', 'info');
        
        // Add edit functionality here
        // For now, just show a message
    }

    saveProfile() {
        // Save profile changes
        this.showNotification('تم حفظ التغييرات بنجاح', 'success');
        
        // Add save functionality here
        // For now, just show a message
    }

    refresh() {
        const user = Auth.getUser();
        
        if (!user) {
            this.showGuestView();
        } else {
            this.showUserView(user);
        }
    }

    showGuestView() {
        if (this.guestView) this.guestView.classList.remove('hidden');
        if (this.userView) this.userView.classList.add('hidden');
    }

    showUserView(user) {
        if (this.guestView) this.guestView.classList.add('hidden');
        if (this.userView) this.userView.classList.remove('hidden');
        
        // Update user info
        if (this.userName) this.userName.textContent = user.name;
        if (this.userCode) this.userCode.textContent = user.code;
        
        // Update subscription info
        const info = Auth.getSubscriptionInfo();
        if (this.subStatus) {
            this.subStatus.textContent = info.active ? 'نشط' : 'غير نشط';
            this.subStatus.className = info.active ? 'text-green-600' : 'text-red-600';
        }
        if (this.subUntil) this.subUntil.textContent = info.untilStr;
        if (this.subDaysLeft) this.subDaysLeft.textContent = info.daysLeft;
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-lg text-white font-medium transition-all duration-300 transform translate-x-full';
        
        switch (type) {
            case 'success':
                notification.className += ' bg-green-500';
                break;
            case 'error':
                notification.className += ' bg-red-500';
                break;
            case 'warning':
                notification.className += ' bg-yellow-500';
                break;
            default:
                notification.className += ' bg-blue-500';
        }
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);
        
        // Remove after 4 seconds
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }
}

// Initialize account manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AccountManager();
});

export { AccountManager }; 