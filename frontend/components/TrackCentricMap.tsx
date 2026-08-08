"use client";

import dynamic from "next/dynamic";

const Plot = dynamic(() => import("react-plotly.js"), {
	ssr: false,
});

interface TrackOutlineData {
	circuit: string;
	location: string;
	year: number;
	x: number[];
	y: number[];
	speed: number[];
	driver?: string;
}

interface TrackCentricMapProps {
	trackData: TrackOutlineData | null;
	selectedDriver?: string;
	title?: string;
}

export default function TrackCentricMap({
	trackData,
	selectedDriver,
	title = "Circuit Layout & Telemetry Heatmap",
}: TrackCentricMapProps) {
	if (!trackData || !trackData.x || trackData.x.length === 0) {
		return (
			<div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-md p-8 flex items-center justify-center min-h-[400px]">
				<span className="text-zinc-500 font-medium">
					No track layout data available
				</span>
			</div>
		);
	}

	return (
		<div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 backdrop-blur-md p-6 shadow-2xl">
			<div className="flex justify-between items-center mb-4">
				<div>
					<h3 className="text-xl font-bold text-white flex items-center gap-2">
						📍 {title}
					</h3>
					<p className="text-xs text-zinc-400">
						{trackData.circuit} ({trackData.location})
					</p>
				</div>
				{selectedDriver && (
					<span className="bg-red-950/80 text-red-400 border border-red-800 text-xs px-3 py-1 rounded-full font-mono font-bold">
						{selectedDriver}
					</span>
				)}
			</div>

			<div className="w-full relative">
				<Plot
					data={[
						{
							x: trackData.x,
							y: trackData.y,
							mode: "markers+lines",
							type: "scatter",
							line: {
								color: "#3f3f46",
								width: 2,
							},
							marker: {
								size: 6,
								color: trackData.speed,
								colorscale: "Turbo",
								showscale: true,
								colorbar: {
									title: "km/h",
									tickfont: { color: "#a1a1aa" },
									titlefont: { color: "#ffffff" },
								},
							},
						},
					]}
					layout={{
						height: 520,
						paper_bgcolor: "transparent",
						plot_bgcolor: "transparent",
						font: {
							color: "white",
						},
						xaxis: {
							visible: false,
						},
						yaxis: {
							visible: false,
							scaleanchor: "x",
							scaleratio: 1,
						},
						margin: {
							l: 10,
							r: 10,
							t: 10,
							b: 10,
						},
					}}
					style={{
						width: "100%",
					}}
					config={{
						responsive: true,
						displayModeBar: false,
					}}
				/>
			</div>
		</div>
	);
}
