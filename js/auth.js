/**
 * يسير Platform - Auth Module
 * Simple LocalStorage-based auth with first-month-free logic
 */

const AUTH_KEY = 'user';

function now() {
	return new Date();
}

function addDays(date, days) {
	const d = new Date(date);
	d.setDate(d.getDate() + days);
	return d;
}

export const Auth = {
	login({ name, code }) {
		const createdAt = now().toISOString();
		const freeUntil = addDays(now(), 30).toISOString();
		const user = { name, code, createdAt, freeUntil };
		localStorage.setItem('yaseer_' + AUTH_KEY, JSON.stringify(user));
		return user;
	},

	logout() {
		localStorage.removeItem('yaseer_' + AUTH_KEY);
	},

	getUser() {
		try {
			const raw = localStorage.getItem('yaseer_' + AUTH_KEY);
			return raw ? JSON.parse(raw) : null;
		} catch (e) {
			return null;
		}
	},

	isSubscribed() {
		const user = this.getUser();
		if (!user) return false;
		return new Date(user.freeUntil) > now();
	},

	getSubscriptionInfo() {
		const user = this.getUser();
		if (!user) return { active: false, until: null, untilStr: '-', daysLeft: 0 };
		const until = new Date(user.freeUntil);
		const active = until > now();
		const daysLeft = Math.max(0, Math.ceil((until - now()) / (1000 * 60 * 60 * 24)));
		const untilStr = new Intl.DateTimeFormat(document.documentElement.lang === 'ar' ? 'ar-SA' : 'en-US', {
			year: 'numeric', month: 'long', day: 'numeric'
		}).format(until);
		return { active, until, untilStr, daysLeft };
	}
}; 