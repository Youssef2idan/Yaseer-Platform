/**
 * يسير Platform - Forms & Validation
 */

export const Forms = {
	isEmail(value) {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).toLowerCase());
	},

	isPhone(value) {
		return /^(\+\d{1,3}[- ]?)?\d{8,14}$/.test(String(value));
	},

	isPositiveNumber(value) {
		const n = Number(value);
		return !isNaN(n) && n > 0;
	}
}; 