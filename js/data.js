/**
 * يسير Platform - Data Module
 * Fetches local JSON and provides getters
 */

const ROOT_PREFIX = window.location.pathname.includes('/pages/') ? '../' : './';

async function fetchJSON(path) {
	const url = path.startsWith('http')
		? path
		: (path.startsWith('data/')
			? `/data/${path.slice(5)}`
			: `${ROOT_PREFIX}${path.replace(/^\/?/, '')}`);
	const res = await fetch(url);
	if (!res.ok) throw new Error('Failed to load ' + url);
	return res.json();
}

let programsCache = null;
let nutritionCache = null;

export const Data = {
	async getSports() {
		if (!programsCache) programsCache = await fetchJSON('data/programs.json');
		return programsCache.sports;
	},

	async getSportById(id) {
		const sports = await this.getSports();
		return sports.find(s => s.id === id);
	},

	async getAllPrograms({ sport = 'all', level = 'all' } = {}) {
		const sports = await this.getSports();
		const filtered = sport === 'all' ? sports : sports.filter(s => s.id === sport);
		const items = [];
		filtered.forEach(s => {
			s.levels.forEach(lvl => {
				if (level !== 'all' && lvl.id !== level) return;
				lvl.programs.forEach(p => items.push({
					...p,
					sportId: s.id,
					sportName: s.name,
					levelId: lvl.id,
					levelName: lvl.name,
					color: s.color
				}));
			});
		});
		return items;
	},

	getSampleDay(sportId) {
		if (!programsCache) throw new Error('Programs not loaded yet');
		return programsCache.sampleWorkouts[sportId];
	},

	// Nutrition
	async getNutritionGoals() {
		if (!nutritionCache) nutritionCache = await fetchJSON('data/nutrition.json');
		return nutritionCache.goals;
	},

	async getNutritionPlans(goalId) {
		const goals = await this.getNutritionGoals();
		const goal = goals.find(g => g.id === goalId);
		return goal ? goal.plans : [];
	},

	async getNutritionPlanById(goalId, planId) {
		const plans = await this.getNutritionPlans(goalId);
		return plans.find(p => p.id === planId);
	}
}; 