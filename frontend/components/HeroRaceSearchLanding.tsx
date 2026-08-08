"use client";

import { useEffect, useState, useMemo } from "react";
import { getAllRaces } from "../lib/api";

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
	onSelectRace: (race: { year: number; grandPrix: string }) => void;
}

// Fallback races list covering 2026, 2025, 2024
const FEATURED_RACES: RaceEvent[] = [
	// 2026
	{ round: 1, event_name: "Bahrain Grand Prix", official_name: "Bahrain GP", location: "Sakhir", country: "Bahrain", year: 2026 },
	{ round: 2, event_name: "Saudi Arabian Grand Prix", official_name: "Saudi GP", location: "Jeddah", country: "Saudi Arabia", year: 2026 },
	{ round: 3, event_name: "Australian Grand Prix", official_name: "Aussie GP", location: "Melbourne", country: "Australia", year: 2026 },
	{ round: 4, event_name: "Japanese Grand Prix", official_name: "Suzuka GP", location: "Suzuka", country: "Japan", year: 2026 },
	{ round: 5, event_name: "Chinese Grand Prix", official_name: "China GP", location: "Shanghai", country: "China", year: 2026 },
	{ round: 8, event_name: "Monaco Grand Prix", official_name: "Monaco GP", location: "Monte Carlo", country: "Monaco", year: 2026 },
	{ round: 12, event_name: "British Grand Prix", official_name: "British GP", location: "Silverstone", country: "United Kingdom", year: 2026 },
	
	// 2025
	{ round: 1, event_name: "Australian Grand Prix", official_name: "Aussie GP", location: "Melbourne", country: "Australia", year: 2025 },
	{ round: 2, event_name: "Chinese Grand Prix", official_name: "China GP", location: "Shanghai", country: "China", year: 2025 },
	{ round: 8, event_name: "Monaco Grand Prix", official_name: "Monaco GP", location: "Monte Carlo", country: "Monaco", year: 2025 },
	{ round: 12, event_name: "British Grand Prix", official_name: "British GP", location: "Silverstone", country: "United Kingdom", year: 2025 },
	{ round: 22, event_name: "Las Vegas Grand Prix", official_name: "Vegas GP", location: "Las Vegas", country: "United States", year: 2025 },

	// 2024
	{ round: 1, event_name: "Bahrain Grand Prix", official_name: "Bahrain GP", location: "Sakhir", country: "Bahrain", year: 2024 },
	{ round: 8, event_name: "Monaco Grand Prix", official_name: "Monaco GP", location: "Monte Carlo", country: "Monaco", year: 2024 },
	{ round: 12, event_name: "British Grand Prix", official_name: "British GP", location: "Silverstone", country: "United Kingdom", year: 2024 },
	{ round: 14, event_name: "Belgian Grand Prix", official_name: "Spa GP", location: "Spa-Francorchamps", country: "Belgium", year: 2024 },
	{ round: 22, event_name: "Las Vegas Grand Prix", official_name: "Vegas GP", location: "Las Vegas", country: "United States", year: 2024 },
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
					setAllRaces(races);
				}
			} catch (err) {
				console.log("Using static races list");
			}
		}

		fetchRaces();
	}, []);

	// Filtered races for search
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

	// Group races by Season
	const races2026 = useMemo(() => allRaces.filter((r) => r.year === 2026), [allRaces]);
	const races2025 = useMemo(() => allRaces.filter((r) => r.year === 2025), [allRaces]);
	const races2024 = useMemo(() => allRaces.filter((r) => r.year === 2024), [allRaces]);
	const racesArchive = useMemo(() => allRaces.filter((r) => r.year <= 2023), [allRaces]);

	return (
		<div className="min-h-screen bg-black text-white px-4 py-8 max-w-7xl mx-auto font-sans">
			{/* Neobrutalist Header */}
			<div className="text-center mb-10">
				<div className="inline-block bg-red-600 text-white font-mono text-xs font-bold uppercase tracking-widest px-3 py-1 border-2 border-white mb-3 shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]">
					F1 STRATEGY LAB // RACE EXPLORER
				</div>
				<h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white">
					FORMULA 1 GRAND PRIX DATABASE
				</h1>
			</div>

			{/* Searchbar Section in the Middle */}
			<div className="max-w-2xl mx-auto mb-14 relative">
				<div className="relative flex items-center">
					<span className="absolute left-4 text-zinc-400 font-mono font-bold">SEARCH:</span>
					<input
						type="text"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						placeholder="TYPE RACE NAME, COUNTRY OR YEAR (E.G. 2026 BAHRAIN, MONACO, SPA)..."
						className="w-full bg-zinc-950 border-2 border-zinc-600 focus:border-red-600 text-white font-mono text-sm pl-24 pr-10 py-4 focus:outline-none uppercase placeholder:text-zinc-600 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-all"
					/>
					{searchQuery && (
						<button
							onClick={() => setSearchQuery("")}
							className="absolute right-4 text-zinc-400 hover:text-white font-mono font-bold"
						>
							[X]
						</button>
					)}
				</div>

				{/* Instant Search Results Dropdown */}
				{searchQuery.trim().length > 0 && (
					<div className="absolute top-full left-0 right-0 mt-2 bg-zinc-950 border-2 border-zinc-600 z-50 max-h-80 overflow-y-auto shadow-[6px_6px_0px_0px_rgba(239,68,68,1)]">
						{filteredRaces.length > 0 ? (
							filteredRaces.map((r, idx) => (
								<div
									key={idx}
									onClick={() => onSelectRace({ year: r.year, grandPrix: r.event_name })}
									className="p-3 border-b border-zinc-800 hover:bg-red-950 hover:text-white cursor-pointer flex justify-between items-center font-mono text-xs uppercase"
								>
									<div>
										<span className="font-bold text-red-500 mr-2">[{r.year}]</span>
										<span className="font-bold text-white">{r.event_name}</span>
										<span className="text-zinc-500 ml-2">({r.location})</span>
									</div>
									<span className="bg-zinc-800 px-2 py-1 text-[10px] text-zinc-300 font-bold border border-zinc-700">
										SELECT →
									</span>
								</div>
							))
						) : (
							<div className="p-4 text-center text-zinc-500 font-mono text-xs">
								NO MATCHES FOUND FOR "{searchQuery}"
							</div>
						)}
					</div>
				)}
			</div>

			{/* Multiple Rows Categorized by Season */}
			<div className="space-y-10">
				{/* 2026 Season Row */}
				{races2026.length > 0 && (
					<SeasonRaceRow
						title="2026 SEASON (LIVE & CURRENT)"
						badgeColor="bg-red-600 text-white"
						races={races2026}
						onSelectRace={onSelectRace}
					/>
				)}

				{/* 2025 Season Row */}
				{races2025.length > 0 && (
					<SeasonRaceRow
						title="2025 SEASON"
						badgeColor="bg-amber-500 text-black"
						races={races2025}
						onSelectRace={onSelectRace}
					/>
				)}

				{/* 2024 Season Row */}
				{races2024.length > 0 && (
					<SeasonRaceRow
						title="2024 SEASON"
						badgeColor="bg-blue-600 text-white"
						races={races2024}
						onSelectRace={onSelectRace}
					/>
				)}

				{/* Archive Row (2023 - 2021) */}
				{racesArchive.length > 0 && (
					<SeasonRaceRow
						title="ARCHIVE (2023 - 2021)"
						badgeColor="bg-zinc-800 text-zinc-300"
						races={racesArchive}
						onSelectRace={onSelectRace}
					/>
				)}
			</div>
		</div>
	);
}

interface SeasonRaceRowProps {
	title: string;
	badgeColor: string;
	races: RaceEvent[];
	onSelectRace: (race: { year: number; grandPrix: string }) => void;
}

function SeasonRaceRow({ title, badgeColor, races, onSelectRace }: SeasonRaceRowProps) {
	return (
		<div className="border-2 border-zinc-800 bg-zinc-950 p-5">
			<div className="flex items-center justify-between mb-4 border-b-2 border-zinc-800 pb-3">
				<h2 className="text-base font-extrabold uppercase font-mono tracking-wider flex items-center gap-2 text-white">
					<span className={`px-2 py-0.5 text-xs font-bold font-mono ${badgeColor}`}>
						{title}
					</span>
				</h2>
				<span className="text-xs font-mono text-zinc-500 font-bold">
					{races.length} RACES
				</span>
			</div>

			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
				{races.map((r, idx) => (
					<div
						key={idx}
						onClick={() => onSelectRace({ year: r.year, grandPrix: r.event_name })}
						className="bg-zinc-900 border-2 border-zinc-800 hover:border-red-600 p-3 cursor-pointer transition-all duration-150 group hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_rgba(239,68,68,1)] flex flex-col justify-between"
					>
						<div>
							<div className="flex items-center justify-between text-[10px] font-mono font-bold text-zinc-400 mb-1">
								<span className="text-red-500">RD {r.round}</span>
								<span>{r.year}</span>
							</div>
							<h3 className="text-xs font-black uppercase text-white group-hover:text-red-400 truncate">
								{r.event_name.replace(" Grand Prix", "")}
							</h3>
						</div>
						<div className="mt-3 pt-2 border-t border-zinc-800 text-[10px] font-mono text-zinc-500 flex justify-between items-center">
							<span className="truncate max-w-[80px]">{r.location}</span>
							<span className="font-bold text-zinc-400 group-hover:text-white">→</span>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
