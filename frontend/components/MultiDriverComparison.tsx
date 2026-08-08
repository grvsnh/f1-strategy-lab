"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { getCompareDrivers } from "../lib/api";

const Plot = dynamic(() => import("react-plotly.js"), {
	ssr: false,
});

interface MultiDriverComparisonProps {
	availableDrivers: string[];
	year: number;
	grandPrix: string;
	session: string;
}

const AVAILABLE_METRICS = [
	{ id: "speed", label: "Speed (km/h)" },
	{ id: "throttle", label: "Throttle (%)" },
	{ id: "brake", label: "Brake" },
	{ id: "rpm", label: "RPM" },
];

const COLOR_PALETTE = [
	"#3b82f6", // Blue
	"#ef4444", // Red
	"#10b981", // Emerald
	"#f59e0b", // Amber
	"#8b5cf6", // Purple
	"#ec4899", // Pink
	"#06b6d4", // Cyan
];

export default function MultiDriverComparison({
	availableDrivers,
	year,
	grandPrix,
	session,
}: MultiDriverComparisonProps) {
	const [selectedDrivers, setSelectedDrivers] = useState<string[]>(
		availableDrivers.slice(0, 3)
	);
	const [selectedMetrics, setSelectedMetrics] = useState<string[]>(["speed"]);
	const [comparisonData, setComparisonData] = useState<any>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const toggleDriver = (drv: string) => {
		if (selectedDrivers.includes(drv)) {
			if (selectedDrivers.length > 2) {
				setSelectedDrivers(selectedDrivers.filter((d) => d !== drv));
			}
		} else {
			setSelectedDrivers([...selectedDrivers, drv]);
		}
	};

	const toggleMetric = (metId: string) => {
		if (selectedMetrics.includes(metId)) {
			if (selectedMetrics.length > 1) {
				setSelectedMetrics(selectedMetrics.filter((m) => m !== metId));
			}
		} else {
			setSelectedMetrics([...selectedMetrics, metId]);
		}
	};

	const handleLoadComparison = async () => {
		try {
			setLoading(true);
			setError("");
			const data = await getCompareDrivers(
				year,
				grandPrix,
				selectedDrivers,
				selectedMetrics,
				session
			);
			setComparisonData(data);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to load comparison");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 backdrop-blur-md p-6 mb-6">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
				<div>
					<h3 className="text-2xl font-bold text-white flex items-center gap-2">
						📊 Multi-Driver Comparison Analytics
					</h3>
					<p className="text-xs text-zinc-400">
						Select 2+ drivers and specific metrics to load requested analytics on-demand
					</p>
				</div>
				<button
					onClick={handleLoadComparison}
					disabled={loading}
					className="bg-red-600 hover:bg-red-500 text-white font-bold px-5 py-2.5 rounded-xl transition shadow-lg shadow-red-950/50 disabled:opacity-50 text-sm flex items-center justify-center gap-2"
				>
					{loading ? "Loading Metrics..." : "⚡ Run Analytics"}
				</button>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
				{/* Drivers Selection */}
				<div className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-700/60">
					<span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-2">
						Drivers ({selectedDrivers.length} Selected)
					</span>
					<div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
						{availableDrivers.map((drv) => {
							const isSelected = selectedDrivers.includes(drv);
							return (
								<button
									key={drv}
									onClick={() => toggleDriver(drv)}
									className={`px-2.5 py-1 text-xs font-mono font-bold rounded-lg border transition ${
										isSelected
											? "bg-red-950 border-red-600 text-red-300"
											: "bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white"
									}`}
								>
									{drv}
								</button>
							);
						})}
					</div>
				</div>

				{/* Metrics Selection */}
				<div className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-700/60">
					<span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-2">
						Analytics Metrics
					</span>
					<div className="grid grid-cols-2 gap-2">
						{AVAILABLE_METRICS.map((met) => {
							const isSelected = selectedMetrics.includes(met.id);
							return (
								<button
									key={met.id}
									onClick={() => toggleMetric(met.id)}
									className={`px-3 py-2 text-xs font-semibold rounded-lg border text-left transition ${
										isSelected
											? "bg-blue-950 border-blue-600 text-blue-300"
											: "bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white"
									}`}
								>
									{met.label}
								</button>
							);
						})}
					</div>
				</div>
			</div>

			{error && (
				<div className="p-4 bg-red-950/80 border border-red-800 rounded-xl text-red-300 text-sm mb-4">
					{error}
				</div>
			)}

			{/* Comparison Charts */}
			{comparisonData && comparisonData.drivers_data && (
				<div className="space-y-6">
					{selectedMetrics.map((metric) => {
						const traces = Object.keys(comparisonData.drivers_data).map(
							(drv, idx) => {
								const dData = comparisonData.drivers_data[drv];
								return {
									x: dData.samples || [],
									y: dData[metric] || [],
									type: "scatter",
									mode: "lines",
									name: drv,
									line: {
										color: COLOR_PALETTE[idx % COLOR_PALETTE.length],
										width: 2,
									},
								};
							}
						);

						return (
							<div
								key={metric}
								className="bg-zinc-800/40 p-4 rounded-xl border border-zinc-800"
							>
								<h4 className="text-lg font-bold text-white mb-2 uppercase tracking-wide">
									{metric} Telemetry Overlay
								</h4>
								<Plot
									data={traces as any}
									layout={{
										height: 380,
										paper_bgcolor: "transparent",
										plot_bgcolor: "transparent",
										font: { color: "white" },
										margin: { l: 50, r: 20, t: 30, b: 40 },
										xaxis: { gridcolor: "#27272a" },
										yaxis: { gridcolor: "#27272a" },
									}}
									style={{ width: "100%" }}
									config={{ responsive: true, displayModeBar: false }}
								/>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}
