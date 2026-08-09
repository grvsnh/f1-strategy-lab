"use client";

import { useEffect, useRef } from "react";
import { animate, svg } from "animejs";
import { getCircuitByLocation, getCircuitSvgPath } from "../lib/circuits";

interface MotionPathLoaderProps {
	raceName: string;
	location: string;
	year: number;
	isDataReady?: boolean;
	onComplete?: () => void;
}

export default function MotionPathLoader({
	raceName,
	location,
	year,
	isDataReady = true,
	onComplete,
}: MotionPathLoaderProps) {
	const svgRef = useRef<SVGSVGElement | null>(null);
	const carRef = useRef<SVGCircleElement | null>(null);
	const pathRef = useRef<SVGPathElement | null>(null);
	const isDataReadyRef = useRef(isDataReady);

	isDataReadyRef.current = isDataReady;

	const circuitInfo = getCircuitByLocation(location || raceName);
	const trackSvgPath = getCircuitSvgPath(location || raceName);

	useEffect(() => {
		if (!pathRef.current || !carRef.current) return;

		let animCar: any;
		let animPath: any;

		try {
			// Continuous motion path car animation along the track coordinates
			animCar = animate(".f1-car-dot", {
				ease: "linear",
				duration: 2000,
				loop: true,
				...svg.createMotionPath("#circuit-motion-path"),
			});

			// SVG track line stroke drawing
			animPath = animate(svg.createDrawable("#circuit-motion-path"), {
				draw: "0 1",
				ease: "linear",
				duration: 1800,
				loop: true,
			});
		} catch (err) {
			console.log("Animation loop fallback");
		}

		const interval = setInterval(() => {
			if (isDataReadyRef.current && onComplete) {
				clearInterval(interval);
				setTimeout(() => onComplete(), 300);
			}
		}, 200);

		return () => {
			clearInterval(interval);
			if (animCar) animCar.pause();
			if (animPath) animPath.pause();
		};
	}, [onComplete]);

	return (
		<div className="fixed inset-0 bg-[var(--bg-app)]/95 backdrop-blur-3xl z-50 flex flex-col items-center justify-center p-6 font-sans text-[var(--text-primary)] select-none transition-colors duration-200">
			<div className="text-center mb-8">
				<span className="text-xs sm:text-sm font-extrabold text-[var(--accent-emerald)] uppercase tracking-widest block mb-2 animate-pulse">
					⚡ TELEMETRY LAB // LOADING RACE CIRCUITS DATA
				</span>
				<h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-[var(--text-primary)]">
					{year} {raceName}
				</h2>
				<p className="text-xs sm:text-sm text-[var(--text-secondary)] font-bold uppercase mt-2">
					📍 {circuitInfo ? circuitInfo.name : location || "F1 Circuit"}
				</p>
			</div>

			{/* Enlarged SVG Circuit Canvas */}
			<div className="relative w-full max-w-2xl h-80 sm:h-96 apple-glass rounded-3xl flex items-center justify-center p-6 shadow-2xl overflow-hidden">
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
						stroke="gray"
						strokeOpacity="0.25"
						strokeWidth="14"
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
						r="9"
						fill="#ffffff"
						stroke="#10b981"
						strokeWidth="4"
					/>
				</svg>

				<div className="absolute bottom-4 right-6 text-xs text-[var(--text-secondary)] font-bold uppercase flex items-center gap-2">
					<span className="w-2.5 h-2.5 rounded-full bg-[var(--accent-emerald)] animate-ping"></span>
					Syncing Sensors...
				</div>
			</div>
		</div>
	);
}
