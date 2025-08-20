/**
 * يسير Platform - Schedule Module
 * Provides mock classes and calendar helpers
 */

function pad(n){ return String(n).padStart(2,'0'); }

export const Schedule = {
	getWeekStart(date) {
		const d = new Date(date);
		const day = d.getDay(); // 0 Sun ... 6 Sat
		const diff = (day === 0 ? -6 : 1) - day; // week starts Monday
		d.setDate(d.getDate() + diff);
		d.setHours(0,0,0,0);
		return d;
	},
	getWeekDays(weekStart) {
		return Array.from({ length: 7 }, (_, i) => {
			const d = new Date(weekStart);
			d.setDate(d.getDate() + i);
			return d;
		});
	},
	formatWeekLabel(weekStart) {
		const end = new Date(weekStart);
		end.setDate(end.getDate() + 6);
		const fmt = new Intl.DateTimeFormat(document.documentElement.lang === 'ar' ? 'ar-SA' : 'en-US', { month: 'short', day: 'numeric' });
		return `${fmt.format(weekStart)} - ${fmt.format(end)}`;
	},
	formatDay(date) {
		const fmt = new Intl.DateTimeFormat(document.documentElement.lang === 'ar' ? 'ar-SA' : 'en-US', { weekday: 'short', month: 'short', day: 'numeric' });
		return fmt.format(date);
	},
	formatTimeRange(start, end) {
		const tf = new Intl.DateTimeFormat(document.documentElement.lang === 'ar' ? 'ar-SA' : 'en-US', { hour: '2-digit', minute: '2-digit' });
		return `${tf.format(new Date(start))} - ${tf.format(new Date(end))}`;
	},
	isSameDay(a, b) {
		return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
	},
	getClassesForWeek(weekStart) {
		// Mock classes repeating weekly
		const base = [
			{ dow: 1, hour: 18, title: 'كيك بوكسينج - للمبتدئين' },
			{ dow: 2, hour: 19, title: 'كمال الأجسام - تمارين صدر' },
			{ dow: 3, hour: 20, title: 'رفع الأثقال - سكوات' },
			{ dow: 4, hour: 18, title: 'لياقة بدنية - HIIT' },
			{ dow: 6, hour: 17, title: 'كيك بوكسينج - متقدم' },
		];
		return base.map(b => {
			const d = new Date(weekStart);
			d.setDate(d.getDate() + (b.dow - 1));
			d.setHours(b.hour, 0, 0, 0);
			const start = new Date(d);
			const end = new Date(d);
			end.setHours(end.getHours() + 1);
			return { title: b.title, start, end };
		});
	}
}; 