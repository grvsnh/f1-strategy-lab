"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { getTrack } from "../lib/api";

const Plot = dynamic(() => import("react-plotly.js"), {
	ssr: false,
});

interface TrackData {
	driver: string;
	x: number[];
	y: number[];
	speed: number[];
}

interface TrackMapProps {
	driver: string;
	year?: number;
	grandPrix?: string;
	session?: string;
}

export default function TrackMap({ driver, year = 2024, grandPrix = "Bahrain", session = "R" }: TrackMapProps) {
	const [track, setTrack] = useState<TrackData | null>(null);

	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function loadTrack() {
			try {
				setLoading(true);

				const data = await getTrack(year, grandPrix, driver, session);

				setTrack(data);
			} finally {
				setLoading(false);
			}
		}

		loadTrack();
	}, [driver, year, grandPrix, session]);

	if (loading) {
		return (
			<div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 mt-8">
				Loading track...
			</div>
		);
	}

	if (!track) {
		return null;
	}

	return (
		<div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 mt-8">
			<div className="flex justify-between items-center mb-6">
				<h3 className="text-2xl font-bold">Track Heatmap</h3>

				<span className="text-zinc-400">{driver}</span>
			</div>

			<Plot
				data={[
					{
						x: track.x,
						y: track.y,
						mode: "markers",
						type: "scatter",
						marker: {
							size: 8,
							color: track.speed,
							colorscale: "Turbo",
							showscale: true,
							colorbar: {
								title: "km/h",
							},
						},
					},
				]}
				layout={{
					height: 700,
					paper_bgcolor: "rgb(24,24,27)",
					plot_bgcolor: "rgb(24,24,27)",
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
						l: 0,
						r: 0,
						t: 0,
						b: 0,
					},
				}}
				style={{
					width: "100%",
				}}
				config={{
					responsive: true,
				}}
			/>
		</div>
	);
}
