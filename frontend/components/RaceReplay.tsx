"use client";

import { useEffect, useState } from "react";
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
			<div className="apple-card rounded-2xl p-6 my-6 font-sans text-center flex items-center justify-between">
				<div className="flex items-center gap-3">
					<span className="w-2.5 h-2.5 rounded-full bg-[var(--accent-emerald)] animate-ping"></span>
					<span className="text-xs sm:text-sm font-bold uppercase text-[var(--text-secondary)]">
						SYNCING 2D RACE REPLAY TIMELINE IN BACKGROUND...
					</span>
				</div>
				<span className="text-xs text-[var(--accent-emerald)] font-bold uppercase">
					EXPLORE TELEMETRY BELOW ↓
				</span>
			</div>
		);
	}

	if (error || !replayData) return null;

	const maxFrames = replayData.total_frames || 100;
	const outline = replayData.track_outline || { x: [], y: [] };

	const minX = outline.x?.length ? Math.min(...outline.x) : -5000;
	const maxX = outline.x?.length ? Math.max(...outline.x) : 5000;
	const minY = outline.y?.length ? Math.min(...outline.y) : -5000;
	const maxY = outline.y?.length ? Math.max(...outline.y) : 5000;

	const rangeX = maxX - minX || 1;
	const rangeY = maxY - minY || 1;

	return (
		<div className="apple-card rounded-2xl p-6 my-6 shadow-xl font-sans">
			<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
				<div>
					<h3 className="text-xl font-bold uppercase text-[var(--text-primary)] flex items-center gap-2">
						🎬 2D Animated Race Replay Engine
					</h3>
					<p className="text-xs text-[var(--text-secondary)] font-semibold uppercase mt-0.5">
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
									? "bg-[var(--accent-emerald)] border-[var(--accent-emerald)] text-black shadow-md"
									: "apple-card text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
							}`}
						>
							{s}x
						</button>
					))}
				</div>
			</div>

			{/* Replay Visualizer Canvas */}
			<div className="relative w-full h-[400px] sm:h-[480px] apple-glass rounded-2xl p-4 flex items-center justify-center overflow-hidden mb-6 shadow-inner">
				<svg className="w-full h-full" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid meet">
					{/* System Theme Adaptive Circuit Track Path (White in Dark mode, Black in Light mode) */}
					{outline.x?.length > 0 && (
						<polyline
							fill="none"
							stroke="currentColor"
							strokeOpacity="0.8"
							strokeWidth="12"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="text-[var(--text-primary)]"
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

						let rawX = 0;
						let rawY = 0;
						const frameIdx = Math.min(currentFrame, maxFrames - 1);

						if (replayData.replays?.[drv]?.x?.length) {
							const xArr = replayData.replays[drv].x;
							const yArr = replayData.replays[drv].y;
							const validIdx = Math.min(frameIdx, xArr.length - 1);
							rawX = typeof xArr[validIdx] === "number" && !isNaN(xArr[validIdx]) ? xArr[validIdx] : 0;
							rawY = typeof yArr[validIdx] === "number" && !isNaN(yArr[validIdx]) ? yArr[validIdx] : 0;
						} else if (replayData.frames?.[frameIdx]?.drivers?.[drv]) {
							const dObj = replayData.frames[frameIdx].drivers[drv];
							rawX = typeof dObj.x === "number" && !isNaN(dObj.x) ? dObj.x : 0;
							rawY = typeof dObj.y === "number" && !isNaN(dObj.y) ? dObj.y : 0;
						}

						const calcCx = Math.round(((rawX - minX) / rangeX) * 900 + 50);
						const calcCy = Math.round(550 - ((rawY - minY) / rangeY) * 500);

						const cx = isNaN(calcCx) ? 500 : calcCx;
						const cy = isNaN(calcCy) ? 300 : calcCy;

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
									fill={isSpotlight ? "#ffffff" : "currentColor"}
									className="text-[var(--text-primary)]"
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
					<div className="absolute top-4 left-4 apple-card border border-[var(--border-color)] text-[var(--text-primary)] text-xs px-3.5 py-1.5 rounded-xl flex items-center gap-2 font-bold shadow-lg">
						<span>SPOTLIGHT: <strong className="text-[var(--accent-emerald)]">{spotlightDriver}</strong></span>
						<button onClick={() => setSpotlightDriver(null)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">✕</button>
					</div>
				)}
			</div>

			{/* Playback Controls & Scrubber */}
			<div className="space-y-4">
				<div className="flex items-center gap-4">
					<button
						onClick={() => setIsPlaying(!isPlaying)}
						className="bg-[var(--accent-emerald)] hover:bg-emerald-400 text-black font-black px-6 py-2.5 rounded-xl shadow-lg transition flex items-center gap-2 text-xs sm:text-sm uppercase active:scale-95"
					>
						{isPlaying ? "⏸ PAUSE" : "▶ PLAY REPLAY"}
					</button>

					<button
						onClick={() => setCurrentFrame(0)}
						className="apple-card text-[var(--text-primary)] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold uppercase"
					>
						RESET
					</button>

					<input
						type="range"
						min="0"
						max={maxFrames - 1}
						value={currentFrame}
						onChange={(e) => setCurrentFrame(Number(e.target.value))}
						className="w-full accent-[var(--accent-emerald)] cursor-pointer h-2 bg-zinc-300 dark:bg-zinc-800 rounded-lg"
					/>
				</div>

				{/* Driver Filter Chips */}
				<div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[var(--border-color)]">
					<span className="text-xs text-[var(--text-secondary)] font-bold uppercase mr-2">
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
										? "bg-[var(--accent-emerald)]/20 border-[var(--accent-emerald)] text-[var(--text-primary)]"
										: "apple-card text-[var(--text-secondary)]"
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
