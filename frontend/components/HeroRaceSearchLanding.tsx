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
					// Filter races to only those with circuit diagrams in bacinger/f1-circuits
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
		<div className="h-screen w-screen overflow-hidden bg-black text-white font-mono flex flex-col justify-between px-6 py-6 select-none relative">
			{/* Header Title */}
			<div className="text-center pt-2">
				<h1 className="text-2xl sm:text-4xl font-black uppercase text-white tracking-widest">
					F1 STRATEGY LAB
				</h1>
				<p className="text-[11px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
					bacinger/f1-circuits JSON • Real Telemetry Hub
				</p>
			</div>

			{/* Center Search Bar */}
			<div className="max-w-xl w-full mx-auto relative z-30 my-auto">
				<div className="relative flex items-center">
					<input
						type="text"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						placeholder="SEARCH CIRCUIT, COUNTRY OR YEAR (E.G. MONACO, 2026, SPA)..."
						className="w-full bg-zinc-900/90 border border-zinc-800 focus:border-emerald-500 text-white font-mono text-sm px-5 py-4 focus:outline-none rounded-xl placeholder:text-zinc-600 transition-all shadow-2xl"
					/>
					{searchQuery && (
						<button
							onClick={() => setSearchQuery("")}
							className="absolute right-4 text-zinc-400 hover:text-white font-bold"
						>
							✕
						</button>
					)}
				</div>

				{/* Instant Search Results Dropdown */}
				{searchQuery.trim().length > 0 && (
					<div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-zinc-800 rounded-xl z-50 max-h-64 overflow-y-auto shadow-2xl">
						{filteredRaces.length > 0 ? (
							filteredRaces.map((r, idx) => (
								<div
									key={idx}
									onClick={() => onSelectRace({ year: r.year, grandPrix: r.event_name, location: r.location })}
									className="p-3 border-b border-zinc-800/60 hover:bg-emerald-950/40 hover:text-emerald-300 cursor-pointer flex justify-between items-center text-xs uppercase"
								>
									<div>
										<span className="font-bold text-white mr-2">[{r.year}] {r.event_name}</span>
										<span className="text-zinc-500">({r.location})</span>
									</div>
									<span className="text-emerald-400 font-bold">SELECT →</span>
								</div>
							))
						) : (
							<div className="p-4 text-center text-zinc-500 text-xs">
								NO MATCHES FOUND FOR "{searchQuery}"
							</div>
						)}
					</div>
				)}
			</div>

			{/* 3 Stacked Horizontal Auto-Scrolling Carousels at Random Speeds */}
			<div className="space-y-4 pb-2">
				{/* Row 1: Live 2026/2025 Races (Speed 22s) */}
				<AutoScrollRow
					title="LIVE & UPCOMING (2026 - 2025)"
					races={liveRaces}
					durationSeconds={22}
					onSelectRace={onSelectRace}
				/>

				{/* Row 2: Classic 2024 Races (Speed 34s) */}
				<AutoScrollRow
					title="CLASSIC RACES (2024)"
					races={classicRaces}
					durationSeconds={34}
					onSelectRace={onSelectRace}
				/>

				{/* Row 3: Historic Archives (Speed 44s) */}
				<AutoScrollRow
					title="HISTORIC CIRCUITS (2023 - 2021)"
					races={archiveRaces}
					durationSeconds={44}
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
			<div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1 flex items-center gap-1.5">
				<span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
				{title}
			</div>

			<div className="flex w-full overflow-hidden select-none group">
				<div
					className="flex gap-3 whitespace-nowrap group-hover:[animation-play-state:paused]"
					style={{
						animation: `marquee ${durationSeconds}s linear infinite`,
					}}
				>
					{races.map((r, idx) => (
						<div
							key={idx}
							onClick={() => onSelectRace({ year: r.year, grandPrix: r.event_name, location: r.location })}
							className="inline-flex items-center justify-between gap-4 bg-zinc-900/90 border border-zinc-800/80 hover:border-emerald-500 px-4 py-2.5 rounded-xl cursor-pointer transition-all duration-150 group-hover:bg-zinc-800/80 min-w-[210px] text-left shadow-lg"
						>
							<div>
								<div className="text-[10px] font-bold text-zinc-500 flex items-center gap-1.5">
									<span className="text-emerald-400 font-bold">{r.year}</span>
									<span>•</span>
									<span>RD {r.round}</span>
								</div>
								<h4 className="text-xs font-bold uppercase text-white truncate max-w-[130px]">
									{r.event_name.replace(" Grand Prix", "")}
								</h4>
								<p className="text-[10px] text-zinc-500 truncate max-w-[130px]">
									📍 {r.location}
								</p>
							</div>
							<span className="text-zinc-600 font-bold text-xs group-hover:text-emerald-400">→</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
