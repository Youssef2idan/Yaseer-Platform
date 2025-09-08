// Programs Management System
import { Data } from './data.js';
import { UI } from './ui.js';

class ProgramsManager {
    constructor() {
        this.programsGrid = document.getElementById('programsGrid');
        this.showFreeBtn = document.getElementById('showFree');
        this.showAllBtn = document.getElementById('showAll');
        this.currentFilter = 'all';
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadPrograms();
    }

    setupEventListeners() {
        if (this.showFreeBtn) {
            this.showFreeBtn.addEventListener('click', () => this.filterPrograms('free'));
        }
        
        if (this.showAllBtn) {
            this.showAllBtn.addEventListener('click', () => this.filterPrograms('all'));
        }
    }

    async loadPrograms() {
        try {
            const sports = await Data.getSports();
            this.renderPrograms(sports);
        } catch (error) {
            console.error('Error loading programs:', error);
            this.showError('حدث خطأ في تحميل البرامج');
        }
    }

    filterPrograms(filter) {
        this.currentFilter = filter;
        
        // Update button states
        this.updateFilterButtons();
        
        // Reload programs with filter
        this.loadPrograms();
    }

    updateFilterButtons() {
        if (this.showFreeBtn && this.showAllBtn) {
            this.showFreeBtn.classList.toggle('active', this.currentFilter === 'free');
            this.showAllBtn.classList.toggle('active', this.currentFilter === 'all');
        }
    }

    async renderPrograms(sports) {
        if (!this.programsGrid) return;
        
        this.programsGrid.innerHTML = '';
        
        for (const sport of sports) {
            const sportCard = this.createSportCard(sport);
            this.programsGrid.appendChild(sportCard);
        }

        // Wire up detail buttons after rendering
        this.setupProgramDetailButtons();
    }

    createSportCard(sport) {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-blue-300';
        
        // Filter programs based on current filter
        let programsToShow = sport.levels.flatMap(level => level.programs);
        if (this.currentFilter === 'free') {
            programsToShow = programsToShow.filter(program => program.isFree);
        }
        
        if (programsToShow.length === 0) {
            card.style.display = 'none';
            return card;
        }
        
        card.innerHTML = `
            <div class="p-6">
                <div class="flex items-center gap-4 mb-4">
                    <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                        </svg>
                    </div>
                    <div>
                        <h3 class="text-xl font-bold text-gray-900">${sport.name.ar}</h3>
                        <p class="text-gray-600 text-sm">${sport.description.ar}</p>
                    </div>
                </div>
                
                <div class="space-y-3">
                    ${this.renderProgramsList(programsToShow)}
                </div>
                
                <div class="mt-6 pt-4 border-t border-gray-200">
                    <div class="flex items-center justify-between text-sm text-gray-600">
                        <span>إجمالي البرامج: ${programsToShow.length}</span>
                        <span>البرامج المجانية: ${programsToShow.filter(p => p.isFree).length}</span>
                    </div>
                </div>
            </div>
        `;
        
        return card;
    }

    renderProgramsList(programs) {
        return programs.map(program => `
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                <div class="flex-1">
                    <h4 class="font-semibold text-gray-900">${program.name.ar}</h4>
                    <p class="text-sm text-gray-600">${program.description.ar}</p>
                    <div class="flex items-center gap-2 mt-2">
                        ${program.features.slice(0, 3).map(feature => 
                            `<span class="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">${feature}</span>`
                        ).join('')}
                    </div>
                </div>
                <div class="text-right ml-4">
                    <div class="mb-2">
                        ${program.isFree ? 
                            '<span class="status-badge free">مجاني</span>' : 
                            `<span class="status-badge paid">${program.price} $</span>`
                        }
                    </div>
                    <button class="btn-primary program-detail-btn" data-program-id="${program.id}">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                        التفاصيل
                    </button>
                </div>
            </div>
        `).join('');
    }

    showError(message) {
        if (this.programsGrid) {
            this.programsGrid.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <p class="text-red-600 text-lg">${message}</p>
                    <button class="mt-4 btn-primary" onclick="location.reload()">
                        <svg class="w-4 h-4 inline ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                        </svg>
                        إعادة المحاولة
                    </button>
                </div>
            `;
        }
    }

    setupProgramDetailButtons() {
        const detailButtons = document.querySelectorAll('.program-detail-btn');
        detailButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const programId = button.dataset.programId;
                this.showProgramDetails(programId);
            });
        });
    }

    showProgramDetails(programId) {
        // Navigate to program detail page
        window.location.href = `program.html?program=${programId}`;
    }
}

// Initialize programs manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProgramsManager();
});

export { ProgramsManager }; 