"use client";

import { useEffect, useRef } from "react";
import { animate, svg } from "animejs";

interface MotionPathLoaderProps {
	raceName: string;
	year: number;
	onComplete?: () => void;
}

export default function MotionPathLoader({
	raceName,
	year,
	onComplete,
}: MotionPathLoaderProps) {
	const svgRef = useRef<SVGSVGElement | null>(null);
	const carRef = useRef<SVGCircleElement | null>(null);
	const pathRef = useRef<SVGPathElement | null>(null);

	useEffect(() => {
		if (!pathRef.current || !carRef.current) return;

		let timeout: NodeJS.Timeout;

		try {
			// Animate F1 car along circuit motion path using SVG motion path
			const carAnimation = animate(".f1-car-dot", {
				ease: "linear",
				duration: 2400,
				loop: false,
				...svg.createMotionPath("#circuit-motion-path"),
			});

			// Draw SVG track line
			animate(svg.createDrawable("#circuit-motion-path"), {
				draw: "0 1",
				ease: "linear",
				duration: 2000,
				loop: false,
			});

			timeout = setTimeout(() => {
				if (onComplete) onComplete();
			}, 2400);
		} catch (err) {
			console.log("Motion path animation error fallback:", err);
			timeout = setTimeout(() => {
				if (onComplete) onComplete();
			}, 1500);
		}

		return () => {
			clearTimeout(timeout);
		};
	}, [onComplete]);

	// Circuit path shape (Monaco/Bahrain style loop)
	const trackPath =
		"M 100,250 C 120,100 280,80 400,120 C 520,160 650,90 750,150 C 850,210 880,350 780,420 C 680,490 500,480 380,440 C 260,400 150,450 80,380 C 40,320 80,280 100,250 Z";

	return (
		<div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center p-6 font-mono border-4 border-red-600">
			<div className="text-center mb-8">
				<span className="bg-red-600 text-white font-black text-xs px-3 py-1 uppercase tracking-widest border border-white mb-2 inline-block shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
					TELEMETRY LAB // LOADING RACE DATA
				</span>
				<h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight mt-2">
					{year} {raceName}
				</h2>
				<p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mt-1">
					CALIBRATING CIRCUIT TELEMETRY & CAR SENSORS...
				</p>
			</div>

			{/* SVG Circuit Motion Path Animation Canvas */}
			<div className="relative w-full max-w-2xl h-80 bg-zinc-950 border-2 border-zinc-700 flex items-center justify-center p-4 shadow-[6px_6px_0px_0px_rgba(239,68,68,1)]">
				<svg
					ref={svgRef}
					viewBox="0 0 900 550"
					className="w-full h-full"
					preserveAspectRatio="xMidYMid meet"
				>
					{/* Track Background Path */}
					<path
						d={trackPath}
						fill="none"
						stroke="#27272a"
						strokeWidth="16"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>

					{/* Motion Path Track Line */}
					<path
						id="circuit-motion-path"
						ref={pathRef}
						d={trackPath}
						fill="none"
						stroke="#ef4444"
						strokeWidth="5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>

					{/* F1 Car Dot Following Motion Path */}
					<circle
						ref={carRef}
						className="f1-car-dot"
						r="9"
						fill="#ffffff"
						stroke="#ef4444"
						strokeWidth="4"
					/>
				</svg>

				<div className="absolute bottom-3 right-4 text-[11px] text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-2">
					<span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
					SYNCING TELEMETRY ENGINE
				</div>
			</div>
		</div>
	);
}
