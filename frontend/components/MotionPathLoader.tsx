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
			// Motion path car animation
			animate(".f1-car-dot", {
				ease: "linear",
				duration: 1800,
				loop: false,
				...svg.createMotionPath("#circuit-motion-path"),
			});

			// SVG track line stroke drawing
			animate(svg.createDrawable("#circuit-motion-path"), {
				draw: "0 1",
				ease: "linear",
				duration: 1600,
				loop: false,
			});

			timeout = setTimeout(() => {
				if (onComplete) onComplete();
			}, 1800);
		} catch (err) {
			timeout = setTimeout(() => {
				if (onComplete) onComplete();
			}, 1200);
		}

		return () => {
			clearTimeout(timeout);
		};
	}, [onComplete]);

	// Circuit path shape (Smooth racing loop)
	const trackPath =
		"M 100,250 C 120,100 280,80 400,120 C 520,160 650,90 750,150 C 850,210 880,350 780,420 C 680,490 500,480 380,440 C 260,400 150,450 80,380 C 40,320 80,280 100,250 Z";

	return (
		<div className="fixed inset-0 bg-black/95 backdrop-blur-2xl z-50 flex flex-col items-center justify-center p-6 font-mono text-white">
			<div className="text-center mb-8">
				<span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">
					CALIBRATING TELEMETRY & CIRCUIT DATA
				</span>
				<h2 className="text-2xl sm:text-4xl font-bold uppercase tracking-tight">
					{year} {raceName}
				</h2>
			</div>

			{/* SVG Circuit Canvas */}
			<div className="relative w-full max-w-xl h-72 bg-zinc-950/80 border border-zinc-800/80 rounded-2xl flex items-center justify-center p-4 shadow-2xl overflow-hidden">
				<svg
					ref={svgRef}
					viewBox="0 0 900 550"
					className="w-full h-full"
					preserveAspectRatio="xMidYMid meet"
				>
					{/* Track Background */}
					<path
						d={trackPath}
						fill="none"
						stroke="#27272a"
						strokeWidth="10"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>

					{/* Motion Path Track Line */}
					<path
						id="circuit-motion-path"
						ref={pathRef}
						d={trackPath}
						fill="none"
						stroke="#10b981"
						strokeWidth="4"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>

					{/* F1 Car Dot */}
					<circle
						ref={carRef}
						className="f1-car-dot"
						r="8"
						fill="#ffffff"
						stroke="#10b981"
						strokeWidth="3"
					/>
				</svg>

				<div className="absolute bottom-4 right-5 text-[11px] text-zinc-500 font-medium flex items-center gap-2">
					<span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
					SYNCING DATA ENGINE
				</div>
			</div>
		</div>
	);
}
