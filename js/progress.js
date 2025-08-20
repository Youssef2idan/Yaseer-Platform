/**
 * يسير Platform - Progress Module
 * Stores entries and draws simple SVG charts
 */

const KEY = 'progress_v1';

function getData() {
	try {
		return JSON.parse(localStorage.getItem('yaseer_' + KEY)) || {
			weights: [], // {date, value}
			measurements: [], // {date, waist, chest}
			prs: [] // {date, squat, bench, deadlift}
		};
	} catch {
		return { weights: [], measurements: [], prs: [] };
	}
}

function saveData(data) {
	localStorage.setItem('yaseer_' + KEY, JSON.stringify(data));
}

function todayISO() {
	return new Date().toISOString();
}

function createSVG(width, height) {
	const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
	svg.setAttribute('width', '100%');
	svg.setAttribute('height', '100%');
	return svg;
}

function polyline(points, color) {
	const pl = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
	pl.setAttribute('points', points.map(p => p.join(',')).join(' '));
	pl.setAttribute('fill', 'none');
	pl.setAttribute('stroke', color);
	pl.setAttribute('stroke-width', '2');
	pl.setAttribute('stroke-linecap', 'round');
	pl.setAttribute('stroke-linejoin', 'round');
	return pl;
}

function axis(width, height) {
	const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
	const style = 'stroke:#cbd5e1;stroke-width:1';
	const h = document.createElementNS('http://www.w3.org/2000/svg', 'line');
	h.setAttribute('x1', '30'); h.setAttribute('y1', String(height - 20));
	h.setAttribute('x2', String(width - 10)); h.setAttribute('y2', String(height - 20));
	h.setAttribute('style', style);
	const v = document.createElementNS('http://www.w3.org/2000/svg', 'line');
	v.setAttribute('x1', '30'); v.setAttribute('y1', '10');
	v.setAttribute('x2', '30'); v.setAttribute('y2', String(height - 20));
	v.setAttribute('style', style);
	g.appendChild(h); g.appendChild(v);
	return g;
}

export const Progress = {
	addWeight(value) {
		const data = getData();
		data.weights.push({ date: todayISO(), value });
		saveData(data);
	},
	addMeasurements({ waist, chest }) {
		const data = getData();
		data.measurements.push({ date: todayISO(), waist, chest });
		saveData(data);
	},
	addPRs({ squat, bench, deadlift }) {
		const data = getData();
		data.prs.push({ date: todayISO(), squat, bench, deadlift });
		saveData(data);
	},

	drawWeightChart(container) {
		const data = getData().weights.slice(-20);
		container.innerHTML = '';
		const svg = createSVG(400, 160);
		svg.appendChild(axis(400, 160));
		if (data.length < 2) { container.append('لا توجد بيانات كافية'); container.appendChild(svg); return; }
		const min = Math.min(...data.map(d => d.value));
		const max = Math.max(...data.map(d => d.value));
		const xStep = (360) / (data.length - 1);
		const points = data.map((d, i) => {
			const x = 30 + i * xStep;
			const y = 140 - ((d.value - min) / (max - min || 1)) * 120;
			return [x, y];
		});
		svg.appendChild(polyline(points, '#3b82f6'));
		container.appendChild(svg);
	},

	drawPRsChart(container) {
		const data = getData().prs;
		container.innerHTML = '';
		const svg = createSVG(400, 160);
		svg.appendChild(axis(400, 160));
		if (!data.length) { container.append('لا توجد بيانات'); container.appendChild(svg); return; }
		const latest = data[data.length - 1];
		const maxVal = Math.max(latest.squat, latest.bench, latest.deadlift);
		const bars = [
			{ label: 'سكوات', value: latest.squat, color: '#22c55e' },
			{ label: 'بنش', value: latest.bench, color: '#f59e0b' },
			{ label: 'ديدلفت', value: latest.deadlift, color: '#ef4444' },
		];
		const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
		bars.forEach((b, i) => {
			const x = 60 + i * 90;
			const h = (b.value / (maxVal || 1)) * 120;
			const y = 140 - h;
			const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
			rect.setAttribute('x', String(x));
			rect.setAttribute('y', String(y));
			rect.setAttribute('width', '40');
			rect.setAttribute('height', String(h));
			rect.setAttribute('fill', b.color);
			g.appendChild(rect);
			const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
			text.setAttribute('x', String(x + 20));
			text.setAttribute('y', '150');
			text.setAttribute('text-anchor', 'middle');
			text.setAttribute('font-size', '10');
			text.textContent = b.label;
			g.appendChild(text);
		});
		svg.appendChild(g);
		container.appendChild(svg);
	}
}; 