import * as echarts from 'echarts/core';
import { ParallelChart, RadarChart } from 'echarts/charts';
import {
	BrushComponent,
	LegendComponent,
	ParallelComponent,
	RadarComponent,
	TooltipComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
	ParallelChart,
	RadarChart,
	ParallelComponent,
	RadarComponent,
	TooltipComponent,
	LegendComponent,
	BrushComponent,
	CanvasRenderer,
]);

type Bucket = { id: string; label: string };
type Dim = {
	id: string;
	label: string;
	buckets: Bucket[];
};
type Profile = {
	id: string;
	title: string;
	summary: string;
	tone: string;
	estimateM: number;
	traits: Record<string, string>;
};
type Payload = {
	meta: { estimateNote?: string };
	dimensions: Dim[];
	profiles: Profile[];
};

const LINE_COLORS = ['#1f6b76', '#4a7ea8', '#0a1628', '#2f8f9d', '#6b8cae', '#1c2d45', '#3d6f8c', '#247a86'];

function bucketLabel(dim: Dim, bucketId: string) {
	return dim.buckets.find((b) => b.id === bucketId)?.label ?? bucketId;
}

export function mountPopulationsExplorer(root: HTMLElement, payload: Payload) {
	const dimensions = payload.dimensions;
	const profiles = payload.profiles;
	const dimMap = Object.fromEntries(dimensions.map((d) => [d.id, d]));

	const chartEl = root.querySelector<HTMLElement>('#parallel-chart');
	const radarEl = root.querySelector<HTMLElement>('#radar-chart');
	const radarWrap = root.querySelector<HTMLElement>('#radar-wrap');
	const detailEl = root.querySelector<HTMLElement>('#crowd-detail');
	const countEl = root.querySelector<HTMLElement>('#result-count');
	const resetBtn = root.querySelector<HTMLButtonElement>('#reset-view');

	if (!chartEl || !detailEl || !countEl || !resetBtn) return;

	const estimates = profiles.map((p) => p.estimateM);
	const minE = Math.min(...estimates);
	const maxE = Math.max(...estimates);

	function lineWidth(estimateM: number) {
		if (maxE === minE) return 2.4;
		const t = (estimateM - minE) / (maxE - minE);
		return 1.2 + t * 3.2;
	}

	function lineOpacity(estimateM: number) {
		if (maxE === minE) return 0.55;
		const t = (estimateM - minE) / (maxE - minE);
		return 0.28 + t * 0.5;
	}

	function profileValues(profile: Profile) {
		return dimensions.map((dim) => bucketLabel(dim, profile.traits[dim.id]));
	}

	function normalizedScores(profile: Profile) {
		return dimensions.map((dim) => {
			const idx = Math.max(
				0,
				dim.buckets.findIndex((b) => b.id === profile.traits[dim.id]),
			);
			return dim.buckets.length <= 1 ? 50 : Math.round((idx / (dim.buckets.length - 1)) * 100);
		});
	}

	let selectedId: string | null = null;
	let compareIds: string[] = [];

	const chart = echarts.init(chartEl, undefined, { renderer: 'canvas' });
	const radar = radarEl ? echarts.init(radarEl, undefined, { renderer: 'canvas' }) : null;

	function parallelOption() {
		return {
			animationDuration: 450,
			tooltip: {
				trigger: 'item' as const,
				confine: true,
				formatter: (params: { data?: { profileId?: string } }) => {
					const profile = profiles.find((p) => p.id === params.data?.profileId);
					if (!profile) return '';
					return `<strong>${profile.title}</strong><br/>示意规模 ${profile.estimateM}<br/>${profile.summary}`;
				},
			},
			parallel: {
				left: 24,
				right: 24,
				top: 52,
				bottom: 28,
				parallelAxisDefault: {
					nameLocation: 'end' as const,
					nameGap: 14,
					nameTextStyle: {
						color: '#1f6b76',
						fontSize: 11,
						fontWeight: 600,
					},
					axisLine: { lineStyle: { color: 'rgba(90, 112, 138, 0.35)' } },
					axisTick: { lineStyle: { color: 'rgba(90, 112, 138, 0.35)' } },
					splitLine: { show: false },
					areaSelectStyle: {
						width: 18,
						borderWidth: 1,
						borderColor: 'rgba(47, 143, 157, 0.55)',
						color: 'rgba(47, 143, 157, 0.16)',
						opacity: 1,
					},
				},
			},
			parallelAxis: dimensions.map((dim, i) => ({
				dim: i,
				name: dim.label,
				type: 'category' as const,
				data: dim.buckets.map((b) => b.label),
				axisLabel: {
					color: '#5a708a',
					fontSize: 10,
					width: 68,
					overflow: 'truncate' as const,
				},
			})),
			series: [
				{
					type: 'parallel' as const,
					name: '人群框架',
					smooth: 0.12,
					emphasis: {
						lineStyle: { width: 4.5, opacity: 0.95 },
					},
					data: profiles.map((profile) => {
						const focused = profile.id === selectedId || compareIds.includes(profile.id);
						const color = LINE_COLORS[profiles.indexOf(profile) % LINE_COLORS.length];
						return {
							profileId: profile.id,
							name: profile.title,
							value: profileValues(profile),
							lineStyle: {
								color,
								width: focused ? lineWidth(profile.estimateM) + 1.4 : lineWidth(profile.estimateM),
								opacity: focused ? 0.95 : lineOpacity(profile.estimateM),
							},
						};
					}),
				},
			],
		};
	}

	function radarOption() {
		const picks = compareIds
			.map((id) => profiles.find((p) => p.id === id))
			.filter((p): p is Profile => Boolean(p))
			.slice(0, 2);
		if (!picks.length) return null;

		return {
			animationDuration: 400,
			legend: {
				bottom: 0,
				textStyle: { color: '#1c2d45', fontSize: 12 },
				data: picks.map((p) => p.title),
			},
			tooltip: { confine: true },
			radar: {
				center: ['50%', '46%'],
				radius: '56%',
				indicator: dimensions.map((dim) => ({ name: dim.label, max: 100 })),
				axisName: { color: '#5a708a', fontSize: 10 },
				splitLine: { lineStyle: { color: 'rgba(90, 112, 138, 0.2)' } },
				splitArea: {
					areaStyle: {
						color: ['rgba(244, 248, 251, 0.35)', 'rgba(47, 143, 157, 0.06)'],
					},
				},
				axisLine: { lineStyle: { color: 'rgba(90, 112, 138, 0.28)' } },
			},
			series: [
				{
					type: 'radar' as const,
					symbolSize: 4,
					data: picks.map((profile) => {
						const color = LINE_COLORS[profiles.indexOf(profile) % LINE_COLORS.length];
						return {
							name: profile.title,
							value: normalizedScores(profile),
							lineStyle: { color, width: 2 },
							areaStyle: { color, opacity: 0.12 },
							itemStyle: { color },
						};
					}),
				},
			],
		};
	}

	function renderDetail() {
		const profile = profiles.find((p) => p.id === selectedId);
		if (!profile) {
			detailEl.innerHTML = `
				<p class="detail-empty">在图中点击一条折线，查看该人群框架的维度切片。</p>
				<p class="detail-tip">在任意竖轴上按住拖动，可刷选档位并过滤折线。</p>
			`;
			return;
		}

		const facets = dimensions
			.map((dim) => {
				const label = bucketLabel(dimMap[dim.id] ?? dim, profile.traits[dim.id]);
				return `<span class="facet"><em>${dim.label}</em>${label}</span>`;
			})
			.join('');

		const inCompare = compareIds.includes(profile.id);
		const compareFull = compareIds.length >= 2 && !inCompare;

		detailEl.innerHTML = `
			<div class="detail-head">
				<span class="tone">${profile.tone}</span>
				<h2>${profile.title}</h2>
			</div>
			<p class="summary">${profile.summary}</p>
			<p class="estimate">示意规模 <strong>${profile.estimateM}</strong>${
				payload.meta.estimateNote ? ` · ${payload.meta.estimateNote}` : ''
			}</p>
			<div class="facets">${facets}</div>
			<div class="detail-actions">
				<button type="button" class="action" id="toggle-compare" ${compareFull ? 'disabled' : ''}>
					${inCompare ? '移出雷达对照' : '加入雷达对照'}
				</button>
				<button type="button" class="action ghost" id="clear-selection">取消选中</button>
			</div>
		`;

		detailEl.querySelector('#toggle-compare')?.addEventListener('click', () => {
			if (inCompare) {
				compareIds = compareIds.filter((id) => id !== profile.id);
			} else if (compareIds.length < 2) {
				compareIds = [...compareIds, profile.id];
			}
			refresh();
		});
		detailEl.querySelector('#clear-selection')?.addEventListener('click', () => {
			selectedId = null;
			refresh();
		});
	}

	function syncChrome() {
		countEl.textContent = `${profiles.length} 个人群框架 · 线宽示意规模 · 点击折线看详情`;
		resetBtn.hidden = !(selectedId || compareIds.length);
		if (radarWrap && radar) {
			const option = radarOption();
			radarWrap.hidden = !option;
			if (option) {
				radar.setOption(option, true);
				requestAnimationFrame(() => radar.resize());
			}
		}
	}

	function refresh() {
		chart.setOption(parallelOption(), true);
		renderDetail();
		syncChrome();
	}

	chart.on('click', (params) => {
		const data = params.data as { profileId?: string } | undefined;
		if (!data?.profileId) return;
		selectedId = data.profileId;
		refresh();
	});

	resetBtn.addEventListener('click', () => {
		selectedId = null;
		compareIds = [];
		// Recreate option to clear axis area selections.
		chart.clear();
		refresh();
	});

	const onResize = () => {
		chart.resize();
		radar?.resize();
	};
	window.addEventListener('resize', onResize);

	refresh();

	return () => {
		window.removeEventListener('resize', onResize);
		chart.dispose();
		radar?.dispose();
	};
}
