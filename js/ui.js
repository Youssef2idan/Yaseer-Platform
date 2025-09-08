/**
 * يسير Platform - UI Components
 */

	export const UI = {
		createProgramCard(program) {
			const colorMap = {
				red: 'from-red-400 to-red-600',
				blue: 'from-blue-400 to-blue-600',
				green: 'from-green-400 to-green-600',
				purple: 'from-purple-400 to-purple-600'
			};
			const gradient = colorMap[program.color] || 'from-slate-400 to-slate-600';
			const card = document.createElement('article');
			card.className = 'bg-white rounded-2xl shadow hover:shadow-lg transition p-5 flex flex-col';
			card.innerHTML = `
				<div class="h-32 rounded-xl mb-4 bg-gradient-to-r ${gradient}"></div>
				<h3 class="text-lg font-semibold">${program.name.ar}</h3>
				<p class="text-gray-600 text-sm mt-1 mb-3">${program.description.ar}</p>
				<div class="mt-auto flex items-center justify-between">
					<span class="text-sm ${program.isFree ? 'text-green-600' : 'text-gray-700'}">${program.isFree ? 'مجاني' : program.price + ' $'}</span>
					<a href="#" data-detail class="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm">التفاصيل</a>
				</div>
			`;
			const detailBtn = card.querySelector('[data-detail]');
			detailBtn.addEventListener('click', (e) => {
				e.preventDefault();
				if (!program.isFree) {
					UI.createPaywallModal({ title: 'خطة تدريب مدفوعة' });
					return;
				}
				const features = (program.features || []).map(f => `
					<li class="flex items-center gap-2">
						<span class="w-2 h-2 rounded-full bg-blue-500"></span>
						<span>${f}</span>
					</li>
				`).join('');
				UI.createModal({
					title: program.name.ar,
					content: `
						<p class="text-gray-700 mb-4">${program.description.ar}</p>
						<ul class="space-y-2 mb-6">${features}</ul>
						<div class="flex items-center justify-end gap-3">
							<button data-close class="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200">إغلاق</button>
							<button data-start class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">ابدأ الآن</button>
						</div>
					`
				});
				const overlay = document.querySelector('.modal')?.parentElement || document.body.lastElementChild;
				if (overlay) {
					const modalEl = overlay.querySelector('.modal') || overlay;
					modalEl.addEventListener('click', (ev) => {
						if (ev.target && ev.target.hasAttribute && ev.target.hasAttribute('data-start')) {
							window.toast?.success?.('تم تفعيل البرنامج المجاني!');
							overlay.remove();
						}
						if (ev.target && ev.target.hasAttribute && ev.target.hasAttribute('data-close')) {
							overlay.remove();
						}
					});
				}
			});
			return card;
		},

	// Simple modal
	createModal({ title, content }) {
		const overlay = document.createElement('div');
		overlay.className = 'fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50';
		const modal = document.createElement('div');
		modal.className = 'bg-white rounded-2xl shadow-xl w-full max-w-lg p-6';
		modal.innerHTML = `
			<div class="flex items-center justify-between mb-4">
				<h3 class="text-lg font-semibold">${title}</h3>
				<button class="p-2 rounded hover:bg-gray-100" aria-label="close">
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
				</button>
			</div>
			<div>${content}</div>
		`;
		modal.querySelector('button').addEventListener('click', () => overlay.remove());
		overlay.appendChild(modal);
		document.body.appendChild(overlay);
		return overlay;
	},

	createPaywallModal({ title = 'خطة مدفوعة', message = 'لو عايز تبقى بطل في مجالك لازم تجرب الخطة المدفوعة' } = {}) {
		const overlay = document.createElement('div');
		overlay.className = 'fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50';
		const modal = document.createElement('div');
		modal.className = 'bg-white rounded-2xl shadow-xl w-full max-w-lg p-6';
		modal.innerHTML = `
			<div class="space-y-4">
				<h3 class="text-xl font-bold text-gray-900">${title}</h3>
				<p class="text-gray-700">${message}</p>
				<div class="flex items-center justify-end gap-3">
					<button data-cancel class="px-4 py-2 rounded-lg border hover:bg-gray-50">إلغاء</button>
					<button data-show-payments class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">طرق الدفع</button>
				</div>
			</div>
		`;
		function renderPayments() {
			modal.innerHTML = `
				<div class="space-y-4">
					<h3 class="text-xl font-bold text-gray-900">طرق الدفع</h3>
					<div class="grid gap-3">
						<a target="_blank" rel="noopener" href="#" class="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium transition-colors text-center">Vodafone Cash</a>
						<a target="_blank" rel="noopener" href="#" class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors text-center">InstaPay</a>
						<a target="_blank" rel="noopener" href="#" class="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-4 rounded-lg font-medium transition-colors text-center">طرق أخرى</a>
					</div>
					<div class="pt-2 border-t">
						<div class="text-sm text-gray-600">للتواصل والاستفسار عبر واتساب:</div>
						<a class="text-green-600 font-semibold" target="_blank" rel="noopener" href="https://wa.me/201094677006">01094677006</a>
					</div>
					<div class="flex items-center justify-end gap-3 pt-2">
						<button data-close class="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200">إغلاق</button>
					</div>
				</div>
			`;
			const closeBtn = modal.querySelector('[data-close]');
			if (closeBtn) closeBtn.addEventListener('click', () => overlay.remove());
		}
		modal.addEventListener('click', (e) => {
			if (e.target.hasAttribute('data-cancel')) overlay.remove();
			if (e.target.hasAttribute('data-show-payments')) renderPayments();
		});
		overlay.appendChild(modal);
		document.body.appendChild(overlay);
		return overlay;
	},

	// Tabs helper
	initTabs(container) {
		const tabButtons = container.querySelectorAll('[data-tab]');
		const tabPanels = container.querySelectorAll('[data-panel]');
		tabButtons.forEach(btn => {
			btn.addEventListener('click', () => {
				const id = btn.getAttribute('data-tab');
				tabButtons.forEach(b => b.classList.remove('bg-blue-600','text-white'));
				btn.classList.add('bg-blue-600','text-white');
				tabPanels.forEach(p => p.classList.add('hidden'));
				container.querySelector(`[data-panel="${id}"]`).classList.remove('hidden');
			});
		});
	}
}; 