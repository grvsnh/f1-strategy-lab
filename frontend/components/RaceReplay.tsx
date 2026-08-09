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
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	const [currentFrame, setCurrentFrame] = useState(0);
	const [isPlaying, setIsPlaying] = useState(false);
	const [speed, setSpeed] = useState(1);
	const [visibleDrivers, setVisibleDrivers] = useState<string[]>([]);
	const [spotlightDriver, setSpotlightDriver] = useState<string | null>(null);

	useEffect(() => {
		let isSubscribed = true;

		async function loadReplayAsync() {
			try {
				setLoading(true);
				setError("");
				setIsPlaying(false);
				const data = await getRaceReplay(year, grandPrix, session);
				if (isSubscribed) {
					setReplayData(data);
					setVisibleDrivers(data.drivers || []);
					setCurrentFrame(0);
				}
			} catch (err) {
				if (isSubscribed) {
					setError(err instanceof Error ? err.message : "Failed to load replay");
				}
			} finally {
				if (isSubscribed) setLoading(false);
			}
		}

		loadReplayAsync();

		return () => {
			isSubscribed = false;
		};
	}, [year, grandPrix, session]);

	// Animation loop
	useEffect(() => {
		if (!isPlaying || !replayData) return;

		const interval = setInterval(() => {
			setCurrentFrame((prevFrame) => {
				const maxFrames = replayData.total_frames || 100;
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
			<div className="border border-zinc-800 bg-zinc-900/40 rounded-2xl p-6 my-6 font-mono text-center flex items-center justify-between">
				<div className="flex items-center gap-3">
					<span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
					<span className="text-xs sm:text-sm font-bold uppercase text-zinc-400">
						SYNCING 2D RACE REPLAY TIMELINE IN BACKGROUND...
					</span>
				</div>
				<span className="text-xs text-emerald-400 font-bold uppercase">
					EXPLORE TELEMETRY BELOW ↓
				</span>
			</div>
		);
	}

	if (error || !replayData) return null;

	const maxFrames = replayData.total_frames || 100;
	const outline = replayData.track_outline || { x: [], y: [] };

	return (
		<div className="border border-zinc-800/80 bg-zinc-900/60 rounded-2xl p-6 my-6 shadow-2xl font-mono">
			<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
				<div>
					<h3 className="text-xl font-bold uppercase text-white flex items-center gap-2">
						🎬 2D Animated Race Replay Engine
					</h3>
					<p className="text-xs text-zinc-500 font-medium uppercase mt-0.5">
						{grandPrix} ({year}) • FRAME {currentFrame + 1} / {maxFrames}
					</p>
				</div>

				<div className="flex items-center gap-2">
					{[1, 2, 5, 10].map((s) => (
						<button
							key={s}
							onClick={() => setSpeed(s)}
							className={`px-3 py-1.5 text-xs font-mono font-bold rounded-xl border transition ${
								speed === s
									? "bg-emerald-500 border-emerald-400 text-black shadow-md"
									: "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
							}`}
						>
							{s}x
						</button>
					))}
				</div>
			</div>

			{/* Replay Visualizer Canvas */}
			<div className="relative w-full h-[400px] sm:h-[480px] bg-black/80 rounded-2xl border border-zinc-800/80 p-4 flex items-center justify-center overflow-hidden mb-6 shadow-inner">
				<svg className="w-full h-full" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid meet">
					{/* Circuit Track Path */}
					{outline.x.length > 0 && (
						<polyline
							fill="none"
							stroke="#27272a"
							strokeWidth="10"
							strokeLinecap="round"
							strokeLinejoin="round"
							points={outline.x
								.map(
									(xVal: number, idx: number) =>
										`${((xVal - Math.min(...outline.x)) / (Math.max(...outline.x) - Math.min(...outline.x) || 1)) * 900 + 50},${
											550 - ((outline.y[idx] - Math.min(...outline.y)) / (Math.max(...outline.y) - Math.min(...outline.y) || 1)) * 500
										}`
								)
								.join(" ")}
						/>
					)}

					{/* Driver Position Dots */}
					{replayData.drivers.map((drv: string) => {
						if (!visibleDrivers.includes(drv)) return null;

						const dData = replayData.replays?.[drv] || replayData.frames?.[currentFrame]?.drivers?.[drv];
						if (!dData) return null;

						const cx = dData.x ? ((dData.x - 50) / 700) * 900 + 50 : 500;
						const cy = dData.y ? dData.y : 250;
						const isSpotlight = spotlightDriver === drv;
						const color = DRIVER_COLORS[drv] || "#10b981";

						return (
							<g key={drv} className="transition-all duration-75">
								<circle
									cx={cx}
									cy={cy}
									r={isSpotlight ? 10 : 7}
									fill={color}
									stroke="#ffffff"
									strokeWidth="2"
									className={isSpotlight ? "animate-pulse" : ""}
								/>
								<text
									x={cx + 10}
									y={cy + 4}
									fill={isSpotlight ? "#ffffff" : "#a1a1aa"}
									fontSize={isSpotlight ? "14" : "11"}
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
					<div className="absolute top-4 left-4 bg-zinc-900 border border-zinc-800 text-white text-xs px-3.5 py-1.5 rounded-xl flex items-center gap-2 font-bold shadow-lg">
						<span>SPOTLIGHT: <strong className="text-emerald-400">{spotlightDriver}</strong></span>
						<button onClick={() => setSpotlightDriver(null)} className="text-zinc-500 hover:text-white">✕</button>
					</div>
				)}
			</div>

			{/* Playback Controls & Scrubber */}
			<div className="space-y-4">
				<div className="flex items-center gap-4">
					<button
						onClick={() => setIsPlaying(!isPlaying)}
						className="bg-emerald-500 hover:bg-emerald-400 text-black font-black px-6 py-2.5 rounded-xl shadow-lg transition flex items-center gap-2 text-xs sm:text-sm uppercase active:scale-95"
					>
						{isPlaying ? "⏸ PAUSE" : "▶ PLAY REPLAY"}
					</button>

					<button
						onClick={() => setCurrentFrame(0)}
						className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 px-4 py-2.5 rounded-xl border border-zinc-800 text-xs sm:text-sm font-bold uppercase"
					>
						RESET
					</button>

					<input
						type="range"
						min="0"
						max={maxFrames - 1}
						value={currentFrame}
						onChange={(e) => setCurrentFrame(Number(e.target.value))}
						className="w-full accent-emerald-500 cursor-pointer h-2 bg-zinc-800 rounded-lg"
					/>
				</div>

				{/* Driver Filter Chips */}
				<div className="flex flex-wrap items-center gap-2 pt-2 border-t border-zinc-800">
					<span className="text-xs text-zinc-500 font-bold uppercase mr-2">
						DRIVER FILTERS:
					</span>
					{replayData.drivers.map((drv: string) => {
						const isVisible = visibleDrivers.includes(drv);
						return (
							<button
								key={drv}
								onClick={() => toggleDriverVisibility(drv)}
								onDoubleClick={() => setSpotlightDriver(drv)}
								className={`px-3 py-1 text-xs font-mono font-bold rounded-lg border transition uppercase ${
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
