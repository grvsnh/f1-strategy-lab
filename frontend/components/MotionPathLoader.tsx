"use client";

import { useEffect, useRef } from "react";
import { animate, svg } from "animejs";
import { getCircuitByLocation, getCircuitSvgPath } from "../lib/circuits";

interface MotionPathLoaderProps {
	raceName: string;
	location: string;
	year: number;
	onComplete?: () => void;
}

export default function MotionPathLoader({
	raceName,
	location,
	year,
	onComplete,
}: MotionPathLoaderProps) {
	const svgRef = useRef<SVGSVGElement | null>(null);
	const carRef = useRef<SVGCircleElement | null>(null);
	const pathRef = useRef<SVGPathElement | null>(null);

	const circuitInfo = getCircuitByLocation(location || raceName);
	const trackSvgPath = getCircuitSvgPath(location || raceName);

	useEffect(() => {
		if (!pathRef.current || !carRef.current) return;

		let timeout: NodeJS.Timeout;

		try {
			// Motion path car animation along the real bacinger/f1-circuits track coordinates
			animate(".f1-car-dot", {
				ease: "linear",
				duration: 2200,
				loop: false,
				...svg.createMotionPath("#circuit-motion-path"),
			});

			// SVG track line stroke drawing
			animate(svg.createDrawable("#circuit-motion-path"), {
				draw: "0 1",
				ease: "linear",
				duration: 2000,
				loop: false,
			});

			timeout = setTimeout(() => {
				if (onComplete) onComplete();
			}, 2200);
		} catch (err) {
			timeout = setTimeout(() => {
				if (onComplete) onComplete();
			}, 1500);
		}

		return () => {
			clearTimeout(timeout);
		};
	}, [onComplete]);

	return (
		<div className="fixed inset-0 bg-black/95 backdrop-blur-3xl z-50 flex flex-col items-center justify-center p-6 font-mono text-white">
			<div className="text-center mb-6">
				<span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest block mb-1">
					⚡ TELEMETRY LAB // LOADING RACE CIRCUITS DATA
				</span>
				<h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight">
					{year} {raceName}
				</h2>
				<p className="text-xs text-zinc-500 font-bold uppercase mt-1">
					{circuitInfo ? circuitInfo.name : location || "F1 Circuit"}
				</p>
			</div>

			{/* SVG Circuit Canvas Rendering Exact Track Shape */}
			<div className="relative w-full max-w-xl h-80 bg-zinc-950/90 border border-zinc-800 rounded-2xl flex items-center justify-center p-6 shadow-2xl overflow-hidden">
				<svg
					ref={svgRef}
					viewBox="0 0 800 500"
					className="w-full h-full"
					preserveAspectRatio="xMidYMid meet"
				>
					{/* Track Background Base */}
					<path
						d={trackSvgPath}
						fill="none"
						stroke="#27272a"
						strokeWidth="12"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>

					{/* Animated Racing Path */}
					<path
						id="circuit-motion-path"
						ref={pathRef}
						d={trackSvgPath}
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

				<div className="absolute bottom-4 right-5 text-[11px] text-zinc-500 font-bold uppercase flex items-center gap-2">
					<span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
					bacinger/f1-circuits JSON
				</div>
			</div>
		</div>
	);
}
