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
	title = "RACETRACK CIRCUIT MAP",
}: TrackCentricMapProps) {
	if (!trackData || !trackData.x || trackData.x.length === 0) {
		return (
			<div className="border border-zinc-800/80 bg-zinc-900/60 rounded-2xl p-8 flex items-center justify-center min-h-[440px] font-mono">
				<span className="text-zinc-500 font-medium text-xs uppercase">
					NO TRACK LAYOUT DATA AVAILABLE
				</span>
			</div>
		);
	}

	return (
		<div className="border border-zinc-800/80 bg-zinc-900/60 rounded-2xl p-4 font-mono shadow-xl">
			<div className="flex justify-between items-center mb-3 border-b border-zinc-800/80 pb-2">
				<div>
					<h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
						🏁 {title}
					</h3>
					<p className="text-[10px] text-zinc-500 font-medium uppercase mt-0.5">
						{trackData.circuit} • {trackData.location}
					</p>
				</div>
				{selectedDriver && (
					<span className="bg-emerald-950 border border-emerald-800 text-emerald-400 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase">
						DRIVER: {selectedDriver}
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
								color: "#10b981",
								width: 2.5,
							},
							marker: {
								size: 5,
								color: trackData.speed,
								colorscale: "Turbo",
								showscale: true,
								colorbar: {
									title: "KM/H",
									tickfont: { color: "#a1a1aa", family: "monospace" },
									titlefont: { color: "#ffffff", family: "monospace" },
								},
							},
						},
					]}
					layout={{
						height: 480,
						paper_bgcolor: "transparent",
						plot_bgcolor: "transparent",
						font: {
							color: "white",
							family: "monospace",
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
