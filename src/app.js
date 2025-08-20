// Global App Utilities: theme, i18n, auth, data, pay modal, helpers

// Theme
export function initTheme() {
  const root = document.documentElement;
  const stored = localStorage.getItem('theme');
  if (stored === 'dark') root.classList.add('dark');
  const btn = document.getElementById('themeToggle');
  btn?.addEventListener('click', () => {
    root.classList.toggle('dark');
    localStorage.setItem('theme', root.classList.contains('dark') ? 'dark' : 'light');
  });
}

// i18n
const i18nTexts = {
  en: {
    'nav.home': 'Home', 'nav.programs': 'Programs', 'nav.nutrition': 'Nutrition', 'nav.live': 'Live', 'nav.progress': 'Progress', 'nav.account': 'Account',
    'programs.title': 'Training Programs', 'programs.subtitle': 'Pick your sport and start for free',
    'filters.sport': 'Sport:', 'filters.level': 'Level:', 'filters.all': 'All',
    'level.beginner': 'Beginner', 'level.intermediate': 'Intermediate', 'level.advanced': 'Advanced',
    'pay.title': 'Upgrade to Pro', 'pay.desc': 'To access advanced levels try the paid plan.',
  },
  ar: {}
};

export function initLang(defaultLang = 'ar') {
  const langBtn = document.getElementById('langToggle');
  function applyLang(lang) {
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const k = el.getAttribute('data-i18n');
      const v = i18nTexts[lang]?.[k];
      if (v) el.textContent = v;
    });
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', lang === 'en' ? 'ltr' : 'rtl');
    if (langBtn) langBtn.textContent = lang === 'en' ? 'AR' : 'EN';
    localStorage.setItem('lang', lang);
  }
  const current = localStorage.getItem('lang') || defaultLang;
  applyLang(current);
  langBtn?.addEventListener('click', () => {
    const next = (localStorage.getItem('lang') || defaultLang) === 'ar' ? 'en' : 'ar';
    applyLang(next);
  });
}

// Auth (localStorage-based)
export const Auth = {
  getUser() {
    const raw = localStorage.getItem('app-user');
    return raw ? JSON.parse(raw) : null;
  },
  login({ name, code }) {
    const user = { name, code, createdAt: Date.now() };
    localStorage.setItem('app-user', JSON.stringify(user));
    return user;
  },
  logout() { localStorage.removeItem('app-user'); },
  getSubscriptionInfo() {
    const user = this.getUser();
    if (!user) return { active: false, untilStr: '--', daysLeft: 0 };
    const start = user.createdAt;
    const until = start + 30 * 24 * 60 * 60 * 1000;
    const daysLeft = Math.max(0, Math.ceil((until - Date.now()) / (24 * 60 * 60 * 1000)));
    return { active: true, untilStr: new Date(until).toLocaleDateString(), daysLeft };
  }
};

// Data (mock service)
export const Data = {
  sports: [
    { id: 'kickboxing', name: { ar: 'كيك بوكسينج' }, description: { ar: 'تقنيات وضربات وتحمل' }, levels: ['beginner', 'intermediate', 'advanced'] },
    { id: 'bodybuilding', name: { ar: 'كمال الأجسام' }, description: { ar: 'بناء عضلي وتنشيف' }, levels: ['beginner', 'intermediate', 'advanced'] },
    { id: 'powerlifting', name: { ar: 'رفع الأثقال' }, description: { ar: 'قوة قصوى وتقنية' }, levels: ['beginner', 'intermediate', 'advanced'] },
    { id: 'fitness', name: { ar: 'اللياقة البدنية' }, description: { ar: 'لياقة شاملة وصحة' }, levels: ['beginner', 'intermediate'] },
    { id: 'yoga', name: { ar: 'يوغا' }, description: { ar: 'توازن ومرونة' }, levels: ['beginner', 'intermediate'] },
    { id: 'crossfit', name: { ar: 'كروسفت' }, description: { ar: 'قوة وظيفية وتمارين عالية الشدة' }, levels: ['beginner', 'intermediate'] },
  ],
  getSports() { return Promise.resolve(this.sports); },
  getSportById(id) { return Promise.resolve(this.sports.find((s) => s.id === id)); },
  getAllPrograms({ sport = 'all', level = 'all' } = {}) {
    const base = [
      { title: 'كيك بوكسينج للمبتدئين', sport: 'kickboxing', level: 'beginner', free: true },
      { title: 'كمال أجسام متوسط', sport: 'bodybuilding', level: 'intermediate', free: false },
      { title: 'رفع أثقال متقدم', sport: 'powerlifting', level: 'advanced', free: false },
      { title: 'لياقة شاملة', sport: 'fitness', level: 'beginner', free: true },
      { title: 'يوغا التوازن', sport: 'yoga', level: 'intermediate', free: false },
      { title: 'كروسفت أساسيات', sport: 'crossfit', level: 'beginner', free: true }
    ];
    const items = base.filter((p) => (sport === 'all' || p.sport === sport) && (level === 'all' || p.level === level));
    return Promise.resolve(items);
  },
  getProgramLevels(sport) {
    const levels = ['beginner', 'intermediate', 'advanced'];
    return Promise.resolve(levels);
  },
  getSampleDay(sport) {
    return { warmup: ['قفز حبل 5 د', 'إطالات'], main: ['3x10 سكوات', '3x10 ضغط'], cooldown: ['إطالة عام'] };
  },
  // Nutrition
  getNutritionGoals() { return Promise.resolve([{ id: 'fatloss', name: { ar: 'حرق دهون' } }, { id: 'muscle', name: { ar: 'بناء عضل' } }]); },
  getNutritionPlans(goal) { return Promise.resolve([{ id: 'basic', name: { ar: 'أساسي' }, isFree: true }, { id: 'pro', name: { ar: 'احترافي' }, isFree: false }]); },
  getNutritionPlanById(goal, id) {
    return Promise.resolve({ calories: 2200, macros: { protein: 150, carbs: 220 }, weeklyMenu: { monday: { الإفطار: { ar: 'بيض + شوفان', calories: 500 }, الغداء: { ar: 'دجاج + أرز', calories: 700 }, العشاء: { ar: 'زبادي + مكسرات', calories: 400 } } } });
  },
  // Live
  getLiveSessions() {
    return Promise.resolve([
      { title: 'كيك للمبتدئين', time: 'اليوم 6:00 مساءً', price: 0 },
      { title: 'كمال أجسام متقدم', time: 'اليوم 7:30 مساءً', price: 50 },
      { title: 'رفع أثقال احترافي', time: 'اليوم 8:00 مساءً', price: 100 }
    ]);
  },
  getWeeklySchedule() {
    return Promise.resolve([
      { day: 'الأحد', time: '6:00 مساءً', type: 'كيك بوكسينج', coach: 'أحمد', price: 0 },
      { day: 'الاثنين', time: '7:30 مساءً', type: 'كمال الأجسام', coach: 'محمد', price: 50 },
      { day: 'الثلاثاء', time: '8:00 مساءً', type: 'رفع الأثقال', coach: 'علي', price: 100 }
    ]);
  }
};

// Pay modal (once per page)
export function ensurePayModal() {
  if (document.getElementById('payModal')) return;
  const html = `
    <div id="payModal" class="hidden fixed inset-0 bg-black/50 z-50">
      <div class="container-narrow mt-20">
        <div class="card p-6 max-w-lg mx-auto">
          <h3 class="font-semibold mb-3" data-i18n="pay.title">الترقية إلى الخطة المدفوعة</h3>
          <p class="text-sm text-gray-600 dark:text-gray-300 mb-4" data-i18n="pay.desc">للوصول للمستويات المتقدمة جرّب الخطة المدفوعة.</p>
          <div class="grid gap-3">
            <button class="btn-primary bg-red-600 hover:bg-red-700" id="payVodafone">Vodafone Cash</button>
            <button class="btn-primary bg-blue-600 hover:bg-blue-700" id="payInsta">InstaPay</button>
            <button class="btn-primary bg-green-600 hover:bg-green-700" id="payWhats">WhatsApp Help</button>
          </div>
          <div class="text-right mt-4">
            <button id="closePay" class="nav-link">إغلاق</button>
          </div>
        </div>
      </div>
    </div>`;
  document.body.insertAdjacentHTML('beforeend', html);
  document.getElementById('closePay')?.addEventListener('click', () => document.getElementById('payModal')?.classList.add('hidden'));
  document.getElementById('payVodafone')?.addEventListener('click', () => alert('اتصل بنا على 0100-XXXX-XXX'));
  document.getElementById('payInsta')?.addEventListener('click', () => alert('ارسل عبر InstaPay: example@bank'));
  document.getElementById('payWhats')?.addEventListener('click', () => alert('تواصل واتساب'));
}

export function openPayModal() { ensurePayModal(); document.getElementById('payModal')?.classList.remove('hidden'); }

// Progress helpers
export const Progress = {
  addWeight(w) { const arr = JSON.parse(localStorage.getItem('weights') || '[]'); arr.push(w); localStorage.setItem('weights', JSON.stringify(arr)); },
  addMeasurements(v) { localStorage.setItem('measures', JSON.stringify(v)); },
  addPRs(v) { localStorage.setItem('prs', JSON.stringify(v)); },
  drawWeight(el) { el.textContent = 'وزن: ' + (JSON.parse(localStorage.getItem('weights') || '[]').join(', ') || '--'); },
  drawPRs(el) { const v = localStorage.getItem('prs') || '{}'; el.textContent = 'PRs: ' + v; }
};


