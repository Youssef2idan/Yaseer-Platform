// Nutrition Management System
import { Data } from './data.js';
import { UI } from './ui.js';

class NutritionManager {
    constructor() {
        this.goalSelect = document.getElementById('goalSelect');
        this.planSelect = document.getElementById('planSelect');
        this.startNutritionBtn = document.getElementById('startNutrition');
        this.showFreeBtn = document.getElementById('showFree');
        this.showAllBtn = document.getElementById('showAll');
        this.currentFilter = 'all';
        this.currentGoal = '';
        this.currentPlan = '';
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadGoals();
        this.updateFilterButtons();
    }

    setupEventListeners() {
        if (this.goalSelect) {
            this.goalSelect.addEventListener('change', () => this.onGoalChange());
        }
        
        if (this.planSelect) {
            this.planSelect.addEventListener('change', () => this.onPlanChange());
        }
        
        if (this.startNutritionBtn) {
            this.startNutritionBtn.addEventListener('click', () => this.startNutrition());
        }
        
        if (this.showFreeBtn) {
            this.showFreeBtn.addEventListener('click', () => this.filterPlans('free'));
        }
        
        if (this.showAllBtn) {
            this.showAllBtn.addEventListener('click', () => this.filterPlans('all'));
        }
    }

    async loadGoals() {
        try {
            const goals = await Data.getNutritionGoals();
            this.populateGoalSelect(goals);
        } catch (error) {
            console.error('Error loading goals:', error);
            this.showError('حدث خطأ في تحميل الأهداف');
        }
    }

    populateGoalSelect(goals) {
        if (!this.goalSelect) return;
        
        this.goalSelect.innerHTML = '<option value="">اختر هدفك</option>';
        
        goals.forEach(goal => {
            const option = document.createElement('option');
            option.value = goal.id;
            option.textContent = goal.name.ar;
            this.goalSelect.appendChild(option);
        });
    }

    async onGoalChange() {
        this.currentGoal = this.goalSelect.value;
        this.currentPlan = '';
        
        if (this.currentGoal) {
            await this.loadPlans(this.currentGoal);
        } else {
            this.clearPlanSelect();
        }
        
        this.updateStartButton();
    }

    async loadPlans(goalId) {
        try {
            const plans = await Data.getNutritionPlans(goalId);
            this.populatePlanSelect(plans);
        } catch (error) {
            console.error('Error loading plans:', error);
            this.showError('حدث خطأ في تحميل الخطط');
        }
    }

    populatePlanSelect(plans) {
        if (!this.planSelect) return;
        
        this.planSelect.innerHTML = '<option value="">اختر خطتك</option>';
        
        // Filter plans based on current filter
        let plansToShow = plans;
        if (this.currentFilter === 'free') {
            plansToShow = plans.filter(plan => plan.isFree);
        }
        
        plansToShow.forEach(plan => {
            const option = document.createElement('option');
            option.value = plan.id;
            option.textContent = `${plan.name.ar} - ${plan.isFree ? 'مجاني' : plan.price + ' $'}`;
            option.dataset.isFree = plan.isFree;
            this.planSelect.appendChild(option);
        });
    }

    clearPlanSelect() {
        if (this.planSelect) {
            this.planSelect.innerHTML = '<option value="">اختر خطتك</option>';
        }
    }

    onPlanChange() {
        this.currentPlan = this.planSelect.value;
        this.updateStartButton();
    }

    updateStartButton() {
        if (!this.startNutritionBtn) return;
        
        const isValid = this.currentGoal && this.currentPlan;
        this.startNutritionBtn.disabled = !isValid;
        
        if (isValid) {
            this.startNutritionBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        } else {
            this.startNutritionBtn.classList.add('opacity-50', 'cursor-not-allowed');
        }
    }

    filterPlans(filter) {
        this.currentFilter = filter;
        this.updateFilterButtons();
        
        if (this.currentGoal) {
            this.loadPlans(this.currentGoal);
        }
    }

    updateFilterButtons() {
        if (this.showFreeBtn && this.showAllBtn) {
            this.showFreeBtn.classList.toggle('active', this.currentFilter === 'free');
            this.showAllBtn.classList.toggle('active', this.currentFilter === 'all');
        }
    }

    async startNutrition() {
        if (!this.currentGoal || !this.currentPlan) {
            this.showNotification('يرجى اختيار الهدف والخطة', 'warning');
            return;
        }

        try {
            const plan = await this.getCurrentPlan();
            
            if (plan.isFree) {
                this.showNotification('تم تفعيل خطتك المجانية! 🎉', 'success');
                // Redirect to nutrition plan page or show plan details
                setTimeout(() => {
                    window.location.href = 'nutrition-plan.html?id=' + plan.id;
                }, 1500);
            } else {
                // Show paywall modal for paid plans
                UI.createPaywallModal({
                    title: 'خطة تغذية مدفوعة',
                    message: 'لو عايز تبقى بطل في التغذية لازم تجرب الخطة المدفوعة'
                });
            }
        } catch (error) {
            console.error('Error starting nutrition plan:', error);
            this.showNotification('حدث خطأ في تفعيل الخطة', 'error');
        }
    }

    async getCurrentPlan() {
        const plans = await Data.getNutritionPlans(this.currentGoal);
        return plans.find(plan => plan.id === this.currentPlan);
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

    showError(message) {
        // Show error message in the UI
        console.error(message);
    }
}

// Initialize nutrition manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new NutritionManager();
});

export { NutritionManager }; 