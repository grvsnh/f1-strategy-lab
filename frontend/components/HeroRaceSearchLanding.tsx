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

const FEATURED_RACES: RaceEvent[] = [
	// 2026 Live
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
		<div className="min-h-screen bg-black text-white px-6 py-10 max-w-7xl mx-auto font-mono">
			{/* Clean Header */}
			<div className="text-center mb-10">
				<span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">
					F1 STRATEGY LAB // TELEMETRY & INTELLIGENCE
				</span>
				<h1 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-tight">
					RACE EXPLORER
				</h1>
			</div>

			{/* Searchbar Section in the Middle */}
			<div className="max-w-xl mx-auto mb-14 relative">
				<div className="relative flex items-center">
					<input
						type="text"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						placeholder="Search race, track, country, or year..."
						className="w-full bg-zinc-900/90 border border-zinc-800 focus:border-zinc-500 text-white font-mono text-sm px-5 py-4 focus:outline-none rounded-xl placeholder:text-zinc-600 transition-all shadow-xl"
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
					<div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-zinc-800 rounded-xl z-50 max-h-80 overflow-y-auto shadow-2xl">
						{filteredRaces.length > 0 ? (
							filteredRaces.map((r, idx) => (
								<div
									key={idx}
									onClick={() => onSelectRace({ year: r.year, grandPrix: r.event_name })}
									className="p-3.5 border-b border-zinc-800/60 hover:bg-zinc-800/80 cursor-pointer flex justify-between items-center text-xs uppercase"
								>
									<div>
										<span className="font-bold text-white mr-2">[{r.year}] {r.event_name}</span>
										<span className="text-zinc-500">({r.location})</span>
									</div>
									<span className="text-zinc-400 font-bold">SELECT →</span>
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

			{/* Stacked Horizontal Scrolling Rows */}
			<div className="space-y-8">
				{/* 2026 Season Row */}
				{races2026.length > 0 && (
					<SeasonHorizontalRow
						title="2026 SEASON (LIVE)"
						tag="CURRENT"
						races={races2026}
						onSelectRace={onSelectRace}
					/>
				)}

				{/* 2025 Season Row */}
				{races2025.length > 0 && (
					<SeasonHorizontalRow
						title="2025 SEASON"
						tag="SEASON"
						races={races2025}
						onSelectRace={onSelectRace}
					/>
				)}

				{/* 2024 Season Row */}
				{races2024.length > 0 && (
					<SeasonHorizontalRow
						title="2024 SEASON"
						tag="HISTORIC"
						races={races2024}
						onSelectRace={onSelectRace}
					/>
				)}

				{/* Archive Row */}
				{racesArchive.length > 0 && (
					<SeasonHorizontalRow
						title="ARCHIVE (2023 - 2021)"
						tag="ARCHIVE"
						races={racesArchive}
						onSelectRace={onSelectRace}
					/>
				)}
			</div>
		</div>
	);
}

interface SeasonHorizontalRowProps {
	title: string;
	tag: string;
	races: RaceEvent[];
	onSelectRace: (race: { year: number; grandPrix: string }) => void;
}

function SeasonHorizontalRow({ title, tag, races, onSelectRace }: SeasonHorizontalRowProps) {
	return (
		<div>
			<div className="flex items-center justify-between mb-3 border-b border-zinc-800/80 pb-2">
				<h2 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
					<span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
					{title}
				</h2>
				<span className="text-[11px] text-zinc-500 font-medium">
					{races.length} RACES
				</span>
			</div>

			{/* Horizontal Scrolling Race Cards Carousel */}
			<div className="flex gap-3 overflow-x-auto pb-3 pt-1 scrollbar-none snap-x">
				{races.map((r, idx) => (
					<div
						key={idx}
						onClick={() => onSelectRace({ year: r.year, grandPrix: r.event_name })}
						className="snap-start min-w-[200px] max-w-[220px] bg-zinc-900/90 border border-zinc-800/80 hover:border-zinc-600 p-3.5 rounded-xl cursor-pointer transition-all duration-150 group hover:bg-zinc-800/60 flex flex-col justify-between"
					>
						<div>
							<div className="flex items-center justify-between text-[10px] text-zinc-500 font-bold mb-1.5">
								<span>RD {r.round}</span>
								<span>{r.year}</span>
							</div>
							<h3 className="text-xs font-bold uppercase text-white group-hover:text-emerald-400 truncate">
								{r.event_name.replace(" Grand Prix", "")}
							</h3>
						</div>

						<div className="mt-4 pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[10px] text-zinc-400">
							<span className="truncate max-w-[130px]">{r.location}</span>
							<span className="text-zinc-500 font-bold group-hover:text-white">→</span>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
