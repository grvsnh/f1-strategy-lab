"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { getAdvancedRaceAnalytics } from "../lib/api";

const Plot = dynamic(() => import("react-plotly.js"), {
	ssr: false,
});

interface AdvancedRaceAnalyticsProps {
	year: number;
	grandPrix: string;
	session: string;
}

const COLOR_PALETTE = [
	"#3b82f6", // Blue
	"#ef4444", // Red
	"#10b981", // Emerald
	"#f59e0b", // Amber
	"#8b5cf6", // Purple
	"#ec4899", // Pink
	"#06b6d4", // Cyan
	"#84cc16", // Lime
	"#f97316", // Orange
	"#6366f1", // Indigo
];

export default function AdvancedRaceAnalytics({
	year,
	grandPrix,
	session,
}: AdvancedRaceAnalyticsProps) {
	const [data, setData] = useState<any>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		async function loadAnalytics() {
			try {
				setLoading(true);
				const res = await getAdvancedRaceAnalytics(year, grandPrix, session);
				setData(res);
			} catch (err) {
				console.error("Failed to load advanced analytics", err);
			} finally {
				setLoading(false);
			}
		}

		loadAnalytics();
	}, [year, grandPrix, session]);

	if (loading) {
		return (
			<div className="apple-card rounded-2xl p-8 my-6 text-center animate-pulse font-sans">
				<span className="text-[var(--text-secondary)] font-semibold text-xs uppercase">
					Computing position progression & race pace matrix...
				</span>
			</div>
		);
	}

	if (!data || !data.position_progression) return null;

	const posTraces = Object.keys(data.position_progression).map((drv, idx) => {
		const posArr = data.position_progression[drv];
		return {
			x: posArr.map((_: any, i: number) => i + 1),
			y: posArr,
			type: "scatter",
			mode: "lines",
			name: drv,
			line: {
				color: COLOR_PALETTE[idx % COLOR_PALETTE.length],
				width: 2.5,
			},
		};
	});

	return (
		<div className="apple-card rounded-2xl p-6 my-6 shadow-xl space-y-8 font-sans">
			<h3 className="text-xl font-bold uppercase text-[var(--text-primary)] flex items-center gap-2 tracking-wide">
				📈 Advanced Race Analytics & Pace Performance
			</h3>

			{/* Position Progression Chart */}
			<div className="apple-glass p-5 rounded-2xl">
				<h4 className="text-sm font-bold text-[var(--text-primary)] mb-2 uppercase tracking-wide">
					Race Position Progression (Lap-by-Lap)
				</h4>
				<Plot
					data={posTraces as any}
					layout={{
						height: 420,
						paper_bgcolor: "transparent",
						plot_bgcolor: "transparent",
						font: { color: "gray", family: "sans-serif" },
						margin: { l: 40, r: 20, t: 20, b: 40 },
						xaxis: { title: "Sampled Laps", gridcolor: "gray" },
						yaxis: {
							title: "Position",
							autorange: "reversed",
							gridcolor: "gray",
							dtick: 1,
						},
					}}
					style={{ width: "100%" }}
					config={{ responsive: true, displayModeBar: false }}
				/>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Race Pace Medians */}
				<div className="apple-glass p-5 rounded-2xl">
					<h4 className="text-sm font-bold text-[var(--text-primary)] mb-4 uppercase tracking-wide flex items-center gap-2">
						⏱️ Median Race Pace (Seconds)
					</h4>
					<div className="space-y-2 max-h-64 overflow-y-auto pr-1">
						{Object.keys(data.pace_medians || {}).map((drv) => (
							<div
								key={drv}
								className="flex items-center justify-between apple-card p-3 rounded-xl font-mono text-sm"
							>
								<span className="font-extrabold text-[var(--text-primary)]">{drv}</span>
								<span className="text-[var(--accent-emerald)] font-bold">
									{data.pace_medians[drv]}s
								</span>
							</div>
						))}
					</div>
				</div>

				{/* Sector Split & Speed Trap Matrix */}
				<div className="apple-glass p-5 rounded-2xl">
					<h4 className="text-sm font-bold text-[var(--text-primary)] mb-4 uppercase tracking-wide flex items-center gap-2">
						⚡ Sector Splits & Speed Trap Matrix
					</h4>
					<div className="overflow-x-auto">
						<table className="w-full text-left text-xs font-mono">
							<thead>
								<tr className="border-b border-[var(--border-color)] text-[var(--text-secondary)]">
									<th className="pb-2">Driver</th>
									<th className="pb-2">S1</th>
									<th className="pb-2">S2</th>
									<th className="pb-2">S3</th>
									<th className="pb-2 text-right">Top Speed</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-[var(--border-color)]">
								{Object.keys(data.sector_matrix || {}).map((drv) => {
									const m = data.sector_matrix[drv];
									return (
										<tr key={drv} className="hover:bg-[var(--bg-card-hover)]">
											<td className="py-2.5 font-bold text-[var(--text-primary)]">{drv}</td>
											<td className="py-2.5 text-[var(--text-secondary)]">{m.s1 ? `${m.s1}s` : "-"}</td>
											<td className="py-2.5 text-[var(--text-secondary)]">{m.s2 ? `${m.s2}s` : "-"}</td>
											<td className="py-2.5 text-[var(--text-secondary)]">{m.s3 ? `${m.s3}s` : "-"}</td>
											<td className="py-2.5 text-right font-bold text-[var(--accent-blue)]">
												{m.speed_trap} km/h
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
}
