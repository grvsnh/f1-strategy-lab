"use client";

import { useEffect, useState } from "react";
import { getDriverIntelligence } from "../lib/api";

interface DriverIntelligenceData {
	driver: string;
	fastest_lap_time: number | null;
	lap_number: number | null;
	top_speed: number;
	total_laps: number;
	stint_compounds: string[];
	pit_stops: number;
	sector_1: number | null;
	sector_2: number | null;
	sector_3: number | null;
}

interface DriverIntelligenceModalProps {
	driver: string | null;
	year: number;
	grandPrix: string;
	session: string;
	onClose: () => void;
}

export default function DriverIntelligenceModal({
	driver,
	year,
	grandPrix,
	session,
	onClose,
}: DriverIntelligenceModalProps) {
	const [data, setData] = useState<DriverIntelligenceData | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		if (!driver) return;

		async function loadIntel() {
			try {
				setLoading(true);
				setError("");
				const intel = await getDriverIntelligence(year, grandPrix, driver!, session);
				setData(intel);
			} catch (err) {
				setError(err instanceof Error ? err.message : "Failed to load driver intelligence");
			} finally {
				setLoading(false);
			}
		}

		loadIntel();
	}, [driver, year, grandPrix, session]);

	if (!driver) return null;

	return (
		<div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
			<div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl relative">
				<button
					onClick={onClose}
					className="absolute top-4 right-4 text-zinc-400 hover:text-white text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-800"
				>
					✕
				</button>

				<div className="flex items-center gap-3 mb-6">
					<div className="w-12 h-12 rounded-xl bg-red-600 flex items-center justify-center text-xl font-black text-white font-mono shadow-md shadow-red-900/40">
						{driver}
					</div>
					<div>
						<h3 className="text-2xl font-bold text-white">
							Driver Intelligence
						</h3>
						<p className="text-xs text-zinc-400">
							{grandPrix} ({year}) • Session {session}
						</p>
					</div>
				</div>

				{loading && (
					<div className="py-12 text-center text-zinc-400 animate-pulse">
						Fetching driver intelligence data...
					</div>
				)}

				{error && (
					<div className="p-4 bg-red-950/80 border border-red-800 rounded-xl text-red-300 text-sm mb-4">
						{error}
					</div>
				)}

				{data && !loading && (
					<div className="space-y-4">
						<div className="grid grid-cols-2 gap-3">
							<div className="bg-zinc-800/80 p-3 rounded-xl border border-zinc-700/50">
								<span className="text-[11px] text-zinc-400 uppercase font-semibold block mb-1">
									Fastest Lap
								</span>
								<span className="text-lg font-bold text-emerald-400 font-mono">
									{data.fastest_lap_time ? `${data.fastest_lap_time}s` : "N/A"}
								</span>
								{data.lap_number && (
									<span className="text-[10px] text-zinc-500 block">
										Lap {data.lap_number}
									</span>
								)}
							</div>

							<div className="bg-zinc-800/80 p-3 rounded-xl border border-zinc-700/50">
								<span className="text-[11px] text-zinc-400 uppercase font-semibold block mb-1">
									Top Speed
								</span>
								<span className="text-lg font-bold text-blue-400 font-mono">
									{data.top_speed} km/h
								</span>
							</div>

							<div className="bg-zinc-800/80 p-3 rounded-xl border border-zinc-700/50">
								<span className="text-[11px] text-zinc-400 uppercase font-semibold block mb-1">
									Laps Completed
								</span>
								<span className="text-lg font-bold text-white font-mono">
									{data.total_laps}
								</span>
							</div>

							<div className="bg-zinc-800/80 p-3 rounded-xl border border-zinc-700/50">
								<span className="text-[11px] text-zinc-400 uppercase font-semibold block mb-1">
									Pit Stops
								</span>
								<span className="text-lg font-bold text-amber-400 font-mono">
									{data.pit_stops}
								</span>
							</div>
						</div>

						<div className="bg-zinc-800/80 p-4 rounded-xl border border-zinc-700/50">
							<span className="text-[11px] text-zinc-400 uppercase font-semibold block mb-2">
								Sector Split Times
							</span>
							<div className="grid grid-cols-3 gap-2 text-center">
								<div className="bg-zinc-900/60 p-2 rounded-lg">
									<span className="text-[10px] text-zinc-400 block">S1</span>
									<span className="text-sm font-mono font-bold text-white">
										{data.sector_1 ? `${data.sector_1}s` : "-"}
									</span>
								</div>
								<div className="bg-zinc-900/60 p-2 rounded-lg">
									<span className="text-[10px] text-zinc-400 block">S2</span>
									<span className="text-sm font-mono font-bold text-white">
										{data.sector_2 ? `${data.sector_2}s` : "-"}
									</span>
								</div>
								<div className="bg-zinc-900/60 p-2 rounded-lg">
									<span className="text-[10px] text-zinc-400 block">S3</span>
									<span className="text-sm font-mono font-bold text-white">
										{data.sector_3 ? `${data.sector_3}s` : "-"}
									</span>
								</div>
							</div>
						</div>

						{data.stint_compounds.length > 0 && (
							<div className="bg-zinc-800/80 p-3 rounded-xl border border-zinc-700/50">
								<span className="text-[11px] text-zinc-400 uppercase font-semibold block mb-2">
									Tyre Compounds Used
								</span>
								<div className="flex gap-2">
									{data.stint_compounds.map((cmp, idx) => (
										<span
											key={idx}
											className="px-2.5 py-1 text-xs font-bold font-mono rounded-md bg-zinc-900 border border-zinc-700 text-yellow-400 uppercase"
										>
											{cmp}
										</span>
									))}
								</div>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
