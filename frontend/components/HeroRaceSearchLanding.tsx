"use client";

import { useEffect, useState, useMemo } from "react";
import { getAllRaces } from "../lib/api";
import { getCircuitByLocation } from "../lib/circuits";

interface RaceEvent {
	round: number;
	event_name: string;
	official_name: string;
	location: string;
	country: string;
	year: number;
	event_date?: string;
}

interface HeroRaceSearchLandingProps {
	onSelectRace: (race: { year: number; grandPrix: string; location: string }) => void;
}

// Verified races with circuit maps available in bacinger/f1-circuits
const FEATURED_RACES: RaceEvent[] = [
	// Live / Current (2026 / 2025)
	{ round: 1, event_name: "Bahrain Grand Prix", official_name: "Bahrain GP", location: "Sakhir", country: "Bahrain", year: 2026 },
	{ round: 3, event_name: "Australian Grand Prix", official_name: "Aussie GP", location: "Melbourne", country: "Australia", year: 2026 },
	{ round: 5, event_name: "Chinese Grand Prix", official_name: "China GP", location: "Shanghai", country: "China", year: 2026 },
	{ round: 8, event_name: "Monaco Grand Prix", official_name: "Monaco GP", location: "Monte Carlo", country: "Monaco", year: 2026 },
	{ round: 12, event_name: "British Grand Prix", official_name: "British GP", location: "Silverstone", country: "United Kingdom", year: 2026 },
	{ round: 14, event_name: "Belgian Grand Prix", official_name: "Spa GP", location: "Spa-Francorchamps", country: "Belgium", year: 2026 },

	// 2025
	{ round: 1, event_name: "Australian Grand Prix", official_name: "Aussie GP", location: "Melbourne", country: "Australia", year: 2025 },
	{ round: 2, event_name: "Chinese Grand Prix", official_name: "China GP", location: "Shanghai", country: "China", year: 2025 },
	{ round: 8, event_name: "Monaco Grand Prix", official_name: "Monaco GP", location: "Monte Carlo", country: "Monaco", year: 2025 },
	{ round: 12, event_name: "British Grand Prix", official_name: "British GP", location: "Silverstone", country: "United Kingdom", year: 2025 },
	{ round: 16, event_name: "Italian Grand Prix", official_name: "Monza GP", location: "Monza", country: "Italy", year: 2025 },
	{ round: 22, event_name: "Las Vegas Grand Prix", official_name: "Vegas GP", location: "Las Vegas", country: "United States", year: 2025 },

	// 2024 Classic
	{ round: 1, event_name: "Bahrain Grand Prix", official_name: "Bahrain GP", location: "Sakhir", country: "Bahrain", year: 2024 },
	{ round: 8, event_name: "Monaco Grand Prix", official_name: "Monaco GP", location: "Monte Carlo", country: "Monaco", year: 2024 },
	{ round: 12, event_name: "British Grand Prix", official_name: "British GP", location: "Silverstone", country: "United Kingdom", year: 2024 },
	{ round: 14, event_name: "Belgian Grand Prix", official_name: "Spa GP", location: "Spa-Francorchamps", country: "Belgium", year: 2024 },
	{ round: 16, event_name: "Italian Grand Prix", official_name: "Monza GP", location: "Monza", country: "Italy", year: 2024 },
	{ round: 19, event_name: "United States Grand Prix", official_name: "COTA GP", location: "Austin", country: "United States", year: 2024 },
	{ round: 21, event_name: "São Paulo Grand Prix", official_name: "Interlagos GP", location: "São Paulo", country: "Brazil", year: 2024 },

	// Archive
	{ round: 1, event_name: "Bahrain Grand Prix", official_name: "Bahrain GP", location: "Sakhir", country: "Bahrain", year: 2023 },
	{ round: 6, event_name: "Monaco Grand Prix", official_name: "Monaco GP", location: "Monte Carlo", country: "Monaco", year: 2023 },
	{ round: 10, event_name: "British Grand Prix", official_name: "British GP", location: "Silverstone", country: "United Kingdom", year: 2023 },
	{ round: 12, event_name: "Hungarian Grand Prix", official_name: "Hungaroring GP", location: "Budapest", country: "Hungary", year: 2023 },
	{ round: 14, event_name: "Dutch Grand Prix", official_name: "Zandvoort GP", location: "Zandvoort", country: "Netherlands", year: 2023 },
];

export default function HeroRaceSearchLanding({
	onSelectRace,
}: HeroRaceSearchLandingProps) {
	const [allRaces, setAllRaces] = useState<RaceEvent[]>(FEATURED_RACES);
	const [searchQuery, setSearchQuery] = useState("");

	useEffect(() => {
		async function fetchRaces() {
			try {
				const races = await getAllRaces();
				if (races && races.length > 0) {
					const validRaces = races.filter(
						(r: RaceEvent) => getCircuitByLocation(r.location || r.event_name) !== null
					);
					if (validRaces.length > 0) {
						setAllRaces(validRaces);
					}
				}
			} catch (err) {
				console.log("Using verified circuits list");
			}
		}

		fetchRaces();
	}, []);

	// Filtered races for search dropdown
	const filteredRaces = useMemo(() => {
		if (!searchQuery.trim()) return [];
		const q = searchQuery.toLowerCase();
		return allRaces.filter(
			(r) =>
				r.event_name.toLowerCase().includes(q) ||
				r.location.toLowerCase().includes(q) ||
				r.country.toLowerCase().includes(q) ||
				r.year.toString().includes(q)
		);
	}, [searchQuery, allRaces]);

	// Rows split for random-speed horizontal auto scrolling
	const liveRaces = useMemo(() => {
		const list = allRaces.filter((r) => r.year >= 2025);
		return [...list, ...list];
	}, [allRaces]);

	const classicRaces = useMemo(() => {
		const list = allRaces.filter((r) => r.year === 2024);
		return [...list, ...list];
	}, [allRaces]);

	const archiveRaces = useMemo(() => {
		const list = allRaces.filter((r) => r.year <= 2023);
		return [...list, ...list];
	}, [allRaces]);

	return (
		<div className="min-h-screen sm:h-screen w-screen overflow-y-auto sm:overflow-hidden bg-[var(--bg-app)] text-[var(--text-primary)] font-sans flex flex-col justify-between px-4 sm:px-8 py-6 select-none relative transition-colors duration-200">
			{/* Header Title */}
			<div className="text-center pt-2 sm:pt-4">
				<h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-none text-[var(--text-primary)]">
					F1 STRATEGY LAB
				</h1>
				<p className="text-xs sm:text-sm text-[var(--text-secondary)] font-medium uppercase tracking-widest mt-2">
					bacinger/f1-circuits • System UI Telemetry Engine
				</p>
			</div>

			{/* Center Search Bar - Apple System UI Styled */}
			<div className="max-w-2xl w-full mx-auto relative z-30 my-6 sm:my-auto">
				<div className="relative flex items-center">
					<input
						type="text"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						placeholder="Search circuit, country, or year..."
						className="w-full apple-glass text-[var(--text-primary)] text-base sm:text-lg px-6 py-4 focus:outline-none rounded-2xl placeholder:text-[var(--text-secondary)] transition-all shadow-xl font-medium"
					/>
					{searchQuery && (
						<button
							onClick={() => setSearchQuery("")}
							className="absolute right-5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-bold text-lg"
						>
							✕
						</button>
					)}
				</div>

				{/* Instant Search Results Dropdown */}
				{searchQuery.trim().length > 0 && (
					<div className="absolute top-full left-0 right-0 mt-3 apple-glass rounded-2xl z-50 max-h-72 overflow-y-auto shadow-2xl">
						{filteredRaces.length > 0 ? (
							filteredRaces.map((r, idx) => (
								<div
									key={idx}
									onClick={() => onSelectRace({ year: r.year, grandPrix: r.event_name, location: r.location })}
									className="p-4 border-b border-[var(--border-color)] hover:bg-[var(--accent-emerald)]/10 cursor-pointer flex justify-between items-center text-xs sm:text-sm font-semibold transition"
								>
									<div>
										<span className="text-[var(--text-primary)] mr-2">[{r.year}] {r.event_name}</span>
										<span className="text-[var(--text-secondary)]">({r.location})</span>
									</div>
									<span className="text-[var(--accent-emerald)] font-bold">Select →</span>
								</div>
							))
						) : (
							<div className="p-5 text-center text-[var(--text-secondary)] text-xs sm:text-sm">
								No matches found for "{searchQuery}"
							</div>
						)}
					</div>
				)}
			</div>

			{/* 3 Stacked Horizontal Auto-Scrolling Carousels */}
			<div className="space-y-4 sm:space-y-5 pb-4">
				{/* Row 1: Live 2026/2025 Races (Speed 24s) */}
				<AutoScrollRow
					title="LIVE & UPCOMING (2026 - 2025)"
					races={liveRaces}
					durationSeconds={24}
					onSelectRace={onSelectRace}
				/>

				{/* Row 2: Classic 2024 Races (Speed 36s) */}
				<AutoScrollRow
					title="CLASSIC RACES (2024)"
					races={classicRaces}
					durationSeconds={36}
					onSelectRace={onSelectRace}
				/>

				{/* Row 3: Historic Archives (Speed 46s) */}
				<AutoScrollRow
					title="HISTORIC CIRCUITS (2023 - 2021)"
					races={archiveRaces}
					durationSeconds={46}
					onSelectRace={onSelectRace}
				/>
			</div>
		</div>
	);
}

interface AutoScrollRowProps {
	title: string;
	races: RaceEvent[];
	durationSeconds: number;
	onSelectRace: (race: { year: number; grandPrix: string; location: string }) => void;
}

function AutoScrollRow({ title, races, durationSeconds, onSelectRace }: AutoScrollRowProps) {
	return (
		<div>
			<div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2 flex items-center gap-2">
				<span className="w-2 h-2 rounded-full bg-[var(--accent-emerald)] animate-pulse"></span>
				{title}
			</div>

			<div className="flex w-full overflow-x-auto sm:overflow-hidden select-none group touch-pan-x scrollbar-none">
				<div
					className="flex gap-4 whitespace-nowrap group-hover:[animation-play-state:paused] min-w-full"
					style={{
						animation: `marquee ${durationSeconds}s linear infinite`,
					}}
				>
					{races.map((r, idx) => (
						<div
							key={idx}
							onClick={() => onSelectRace({ year: r.year, grandPrix: r.event_name, location: r.location })}
							className="inline-flex items-center justify-between gap-5 apple-card px-5 py-3.5 rounded-2xl cursor-pointer transition-all duration-150 min-w-[240px] sm:min-w-[280px] text-left shadow-lg active:scale-95"
						>
							<div>
								<div className="text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-2 mb-0.5">
									<span className="text-[var(--accent-emerald)] font-bold">{r.year}</span>
									<span>•</span>
									<span>RD {r.round}</span>
								</div>
								<h4 className="text-sm sm:text-base font-bold uppercase text-[var(--text-primary)] truncate max-w-[170px]">
									{r.event_name.replace(" Grand Prix", "")}
								</h4>
								<p className="text-xs text-[var(--text-secondary)] truncate max-w-[170px]">
									📍 {r.location}
								</p>
							</div>
							<span className="text-[var(--text-secondary)] font-bold text-sm group-hover:text-[var(--accent-emerald)]">→</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
