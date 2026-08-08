"use client";

import { useEffect, useState, useRef } from "react";
import { getRaceReplay } from "../lib/api";

interface RaceReplayProps {
	year: number;
	grandPrix: string;
	session: string;
}

const DRIVER_COLORS: Record<string, string> = {
	VER: "#3671C6",
	PER: "#3671C6",
	HAM: "#6CD3BF",
	RUS: "#6CD3BF",
	LEC: "#E8002D",
	SAI: "#E8002D",
	NOR: "#FF8000",
	PIA: "#FF8000",
	ALO: "#229971",
	STR: "#229971",
	TSU: "#6692FF",
	RIC: "#6692FF",
	GAS: "#0093CC",
	OCO: "#0093CC",
	ALB: "#64C4FF",
	SAR: "#64C4FF",
	MAG: "#B6BABD",
	HUL: "#B6BABD",
	BOT: "#52E252",
	ZHO: "#52E252",
};

export default function RaceReplay({
	year,
	grandPrix,
	session,
}: RaceReplayProps) {
	const [replayData, setReplayData] = useState<any>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const [currentFrame, setCurrentFrame] = useState(0);
	const [isPlaying, setIsPlaying] = useState(false);
	const [speed, setSpeed] = useState(1);
	const [visibleDrivers, setVisibleDrivers] = useState<string[]>([]);
	const [spotlightDriver, setSpotlightDriver] = useState<string | null>(null);

	const animationRef = useRef<number | null>(null);

	useEffect(() => {
		async function loadReplay() {
			try {
				setLoading(true);
				setError("");
				setIsPlaying(false);
				const data = await getRaceReplay(year, grandPrix, session);
				setReplayData(data);
				setVisibleDrivers(data.drivers || []);
				setCurrentFrame(0);
			} catch (err) {
				setError(err instanceof Error ? err.message : "Failed to load replay");
			} finally {
				setLoading(false);
			}
		}

		loadReplay();
	}, [year, grandPrix, session]);

	// Animation loop
	useEffect(() => {
		if (!isPlaying || !replayData) return;

		const interval = setInterval(() => {
			setCurrentFrame((prevFrame) => {
				const maxFrames = 200;
				if (prevFrame >= maxFrames - 1) {
					setIsPlaying(false);
					return prevFrame;
				}
				return prevFrame + 1;
			});
		}, 100 / speed);

		return () => clearInterval(interval);
	}, [isPlaying, speed, replayData]);

	const toggleDriverVisibility = (drv: string) => {
		if (visibleDrivers.includes(drv)) {
			setVisibleDrivers(visibleDrivers.filter((d) => d !== drv));
		} else {
			setVisibleDrivers([...visibleDrivers, drv]);
		}
	};

	if (loading) {
		return (
			<div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-8 my-6 text-center animate-pulse">
				<span className="text-zinc-400 font-mono">Loading Interactive Race Replay Engine...</span>
			</div>
		);
	}

	if (error || !replayData) {
		return null;
	}

	const maxFrames = 200;
	const outline = replayData.track_outline || { x: [], y: [] };

	// Compute bounds for canvas coordinate normalization
	const minX = Math.min(...(outline.x.length ? outline.x : [0]));
	const maxX = Math.max(...(outline.x.length ? outline.x : [1000]));
	const minY = Math.min(...(outline.y.length ? outline.y : [0]));
	const maxY = Math.max(...(outline.y.length ? outline.y : [1000]));

	const rangeX = maxX - minX || 1;
	const rangeY = maxY - minY || 1;

	return (
		<div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 backdrop-blur-md p-6 my-6 shadow-2xl">
			<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
				<div>
					<h3 className="text-2xl font-black text-white flex items-center gap-2">
						🎬 Interactive Race Replay
					</h3>
					<p className="text-xs text-zinc-400">
						{grandPrix} ({year}) • Frame {currentFrame + 1} / {maxFrames}
					</p>
				</div>

				<div className="flex items-center gap-2">
					{/* Speed Controls */}
					{[1, 2, 5, 10].map((s) => (
						<button
							key={s}
							onClick={() => setSpeed(s)}
							className={`px-2.5 py-1 text-xs font-mono font-bold rounded-lg border transition ${
								speed === s
									? "bg-red-600 border-red-500 text-white"
									: "bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white"
							}`}
						>
							{s}x
						</button>
					))}
				</div>
			</div>

			{/* Replay Visualizer Box */}
			<div className="relative w-full h-[450px] bg-black/60 rounded-xl border border-zinc-800/80 p-4 flex items-center justify-center overflow-hidden mb-6">
				<svg className="w-full h-full" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid meet">
					{/* Circuit Track Path */}
					{outline.x.length > 0 && (
						<polyline
							fill="none"
							stroke="#27272a"
							strokeWidth="12"
							strokeLinecap="round"
							strokeLinejoin="round"
							points={outline.x
								.map(
									(xVal: number, idx: number) =>
										`${((xVal - minX) / rangeX) * 900 + 50},${
											550 - ((outline.y[idx] - minY) / rangeY) * 500
										}`
								)
								.join(" ")}
						/>
					)}

					{/* Driver Position Dots */}
					{replayData.drivers.map((drv: string) => {
						if (!visibleDrivers.includes(drv)) return null;

						const dData = replayData.replays[drv];
						if (!dData || !dData.x || dData.x.length === 0) return null;

						const idx = Math.min(currentFrame, dData.x.length - 1);
						const cx = ((dData.x[idx] - minX) / rangeX) * 900 + 50;
						const cy = 550 - ((dData.y[idx] - minY) / rangeY) * 500;
						const isSpotlight = spotlightDriver === drv;
						const color = DRIVER_COLORS[drv] || "#ffffff";

						return (
							<g key={drv} className="transition-all duration-75">
								<circle
									cx={cx}
									cy={cy}
									r={isSpotlight ? 10 : 6}
									fill={color}
									stroke="#000000"
									strokeWidth="2"
									className={isSpotlight ? "animate-pulse" : ""}
								/>
								<text
									x={cx + 9}
									y={cy + 4}
									fill={isSpotlight ? "#ffffff" : "#a1a1aa"}
									fontSize={isSpotlight ? "13" : "10"}
									fontWeight="bold"
									fontFamily="monospace"
								>
									{drv}
								</text>
							</g>
						);
					})}
				</svg>

				{spotlightDriver && (
					<div className="absolute top-4 left-4 bg-red-950/80 border border-red-800 text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-2">
						<span>Spotlight: <strong>{spotlightDriver}</strong></span>
						<button onClick={() => setSpotlightDriver(null)} className="text-zinc-400 hover:text-white">✕</button>
					</div>
				)}
			</div>

			{/* Playback Controls & Scrubber */}
			<div className="space-y-4">
				<div className="flex items-center gap-4">
					<button
						onClick={() => setIsPlaying(!isPlaying)}
						className="bg-red-600 hover:bg-red-500 text-white font-extrabold px-6 py-2.5 rounded-xl shadow-lg transition flex items-center gap-2 text-sm"
					>
						{isPlaying ? "⏸ Pause" : "▶ Play"}
					</button>

					<button
						onClick={() => setCurrentFrame(0)}
						className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-4 py-2.5 rounded-xl border border-zinc-700 text-sm font-semibold"
					>
						⏮ Reset
					</button>

					<input
						type="range"
						min="0"
						max={maxFrames - 1}
						value={currentFrame}
						onChange={(e) => setCurrentFrame(Number(e.target.value))}
						className="w-full accent-red-600 cursor-pointer h-2 bg-zinc-800 rounded-lg"
					/>
				</div>

				{/* Driver Filter Chips */}
				<div className="flex flex-wrap items-center gap-2 pt-2 border-t border-zinc-800">
					<span className="text-xs text-zinc-400 font-semibold mr-2">
						Filter Drivers:
					</span>
					{replayData.drivers.map((drv: string) => {
						const isVisible = visibleDrivers.includes(drv);
						return (
							<button
								key={drv}
								onClick={() => toggleDriverVisibility(drv)}
								onDoubleClick={() => setSpotlightDriver(drv)}
								className={`px-2.5 py-1 text-xs font-mono font-bold rounded-lg border transition ${
									isVisible
										? "bg-zinc-800 border-zinc-700 text-white"
										: "bg-zinc-950 border-zinc-900 text-zinc-600"
								}`}
							>
								{drv}
							</button>
						);
					})}
				</div>
			</div>
		</div>
	);
}
