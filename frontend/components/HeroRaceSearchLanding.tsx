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
	{ round: 1, event_name: "Bahrain Grand Prix", official_name: "Bahrain GP", location: "Sakhir", country: "Bahrain", year: 2024 },
	{ round: 8, event_name: "Monaco Grand Prix", official_name: "Monaco GP", location: "Monte Carlo", country: "Monaco", year: 2024 },
	{ round: 12, event_name: "British Grand Prix", official_name: "British GP", location: "Silverstone", country: "United Kingdom", year: 2024 },
	{ round: 14, event_name: "Belgian Grand Prix", official_name: "Belgian GP", location: "Spa-Francorchamps", country: "Belgium", year: 2024 },
	{ round: 22, event_name: "Las Vegas Grand Prix", official_name: "Las Vegas GP", location: "Las Vegas", country: "United States", year: 2024 },
	{ round: 16, event_name: "Italian Grand Prix", official_name: "Monza GP", location: "Monza", country: "Italy", year: 2024 },
	{ round: 5, event_name: "Miami Grand Prix", official_name: "Miami GP", location: "Miami", country: "United States", year: 2024 },
	{ round: 18, event_name: "Singapore Grand Prix", official_name: "Singapore GP", location: "Marina Bay", country: "Singapore", year: 2024 },
	{ round: 20, event_name: "Mexico City Grand Prix", official_name: "Mexico GP", location: "Mexico City", country: "Mexico", year: 2024 },
	{ round: 21, event_name: "São Paulo Grand Prix", official_name: "Interlagos GP", location: "São Paulo", country: "Brazil", year: 2024 },
];

export default function HeroRaceSearchLanding({
	onSelectRace,
}: HeroRaceSearchLandingProps) {
	const [allRaces, setAllRaces] = useState<RaceEvent[]>(FEATURED_RACES);
	const [searchQuery, setSearchQuery] = useState("");
	const [isFocused, setIsFocused] = useState(false);

	useEffect(() => {
		async function fetchRaces() {
			try {
				const races = await getAllRaces();
				if (races && races.length > 0) {
					setAllRaces(races);
				}
			} catch (err) {
				console.log("Using featured races fallback");
			}
		}

		fetchRaces();
	}, []);

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

	// Create duplicated array for seamless infinite marquee loop
	const tickerRaces = useMemo(() => {
		return [...allRaces, ...allRaces];
	}, [allRaces]);

	return (
		<section className="relative min-h-[80vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden py-12">
			{/* Ambient Glowing Background Elements */}
			<div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-red-600/15 rounded-full blur-[140px] pointer-events-none"></div>
			<div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

			{/* Main Title Header */}
			<div className="relative z-10 max-w-3xl mx-auto mb-10">
				<span className="inline-flex items-center gap-2 bg-red-950/80 border border-red-800/80 text-red-400 font-mono text-xs px-4 py-1.5 rounded-full font-bold uppercase tracking-wider mb-4 shadow-lg shadow-red-950/40">
					🏎️ Formula 1 Race Intelligence Hub
				</span>
				<h1 className="text-5xl sm:text-7xl font-black text-white tracking-tight leading-tight">
					Explore Any <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-400 to-amber-300">Grand Prix</span>
				</h1>
				<p className="text-zinc-400 text-base sm:text-lg mt-4 max-w-xl mx-auto font-medium">
					Search or pick past races below to load interactive telemetry, 2D race replay, driver battles, and pit window analytics.
				</p>
			</div>

			{/* Searchbar Section in the Middle */}
			<div className="relative z-20 max-w-2xl w-full mx-auto mb-16">
				<div className="relative">
					<div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-zinc-400 text-xl">
						🔍
					</div>

					<input
						type="text"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						onFocus={() => setIsFocused(true)}
						onBlur={() => setTimeout(() => setIsFocused(false), 200)}
						placeholder="Search race name, track, country, or year (e.g. Monaco, Silverstone, 2023 Spa...)"
						className="w-full bg-zinc-900/90 border-2 border-zinc-700/80 focus:border-red-500 text-white rounded-2xl pl-14 pr-12 py-5 text-base sm:text-lg shadow-2xl focus:outline-none backdrop-blur-xl transition-all duration-200"
					/>

					{searchQuery && (
						<button
							onClick={() => setSearchQuery("")}
							className="absolute inset-y-0 right-0 pr-5 flex items-center text-zinc-400 hover:text-white text-lg font-bold"
						>
							✕
						</button>
					)}
				</div>

				{/* Search Results Dropdown */}
				{searchQuery.trim().length > 0 && (
					<div className="absolute top-full left-0 right-0 mt-3 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-30 max-h-80 overflow-y-auto text-left backdrop-blur-2xl">
						{filteredRaces.length > 0 ? (
							filteredRaces.map((r, idx) => (
								<div
									key={idx}
									onClick={() => onSelectRace({ year: r.year, grandPrix: r.event_name })}
									className="p-4 border-b border-zinc-800/60 hover:bg-red-950/40 cursor-pointer flex items-center justify-between transition"
								>
									<div>
										<h4 className="font-bold text-white text-base flex items-center gap-2">
											<span>🏁 {r.event_name}</span>
											<span className="text-xs font-mono font-normal text-zinc-400">
												({r.year})
											</span>
										</h4>
										<p className="text-xs text-zinc-400 mt-0.5">
											📍 {r.location}, {r.country}
										</p>
									</div>
									<span className="text-xs text-red-400 font-mono font-bold bg-red-950/80 border border-red-800/80 px-2.5 py-1 rounded-lg">
										Open Explorer →
									</span>
								</div>
							))
						) : (
							<div className="p-6 text-center text-zinc-500 text-sm">
								No races found matching "{searchQuery}"
							</div>
						)}
					</div>
				)}
			</div>

			{/* Auto-scrolling Past Races Ticker Section */}
			<div className="relative z-10 w-full overflow-hidden py-4 border-y border-zinc-800/60 bg-zinc-950/40 backdrop-blur-md">
				<div className="text-xs text-zinc-500 uppercase tracking-widest font-mono font-bold mb-3">
					⚡ Select From Past Races
				</div>

				<div className="flex w-full overflow-hidden select-none group">
					<div className="flex gap-4 animate-marquee whitespace-nowrap group-hover:[animation-play-state:paused]">
						{tickerRaces.map((r, index) => (
							<div
								key={index}
								onClick={() => onSelectRace({ year: r.year, grandPrix: r.event_name })}
								className="inline-flex items-center gap-3 bg-zinc-900/90 border border-zinc-800 hover:border-red-600 hover:bg-zinc-800 p-3.5 rounded-xl cursor-pointer transition-all duration-200 shadow-md min-w-[240px] text-left"
							>
								<div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-lg border border-zinc-700">
									🏎️
								</div>
								<div>
									<div className="text-xs font-mono text-zinc-400 font-semibold flex items-center gap-1.5">
										<span className="text-red-400 font-bold">{r.year}</span>
										<span>•</span>
										<span>Rd {r.round}</span>
									</div>
									<h4 className="text-sm font-bold text-white truncate max-w-[160px]">
										{r.event_name}
									</h4>
									<p className="text-[11px] text-zinc-400 truncate max-w-[160px]">
										📍 {r.location}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
