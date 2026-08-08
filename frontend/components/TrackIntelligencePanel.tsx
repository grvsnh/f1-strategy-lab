"use client";

import { useEffect, useState } from "react";
import { getTrackEvents } from "../lib/api";

interface TrackIntelligencePanelProps {
	year: number;
	grandPrix: string;
	session: string;
}

export default function TrackIntelligencePanel({
	year,
	grandPrix,
	session,
}: TrackIntelligencePanelProps) {
	const [events, setEvents] = useState<any>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		async function loadEvents() {
			try {
				setLoading(true);
				const data = await getTrackEvents(year, grandPrix, session);
				setEvents(data);
			} catch (err) {
				console.error("Failed to load track events", err);
			} finally {
				setLoading(false);
			}
		}

		loadEvents();
	}, [year, grandPrix, session]);

	if (loading) {
		return (
			<div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 my-6 text-center animate-pulse">
				<span className="text-zinc-500 font-mono">Analyzing track intelligence & driver battles...</span>
			</div>
		);
	}

	if (!events) return null;

	return (
		<div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 backdrop-blur-md p-6 my-6 shadow-2xl">
			<h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
				🧠 Track Intelligence & On-Track Events
			</h3>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{/* Driver Battles */}
				<div className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-700/60">
					<h4 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
						⚔️ Driver Battles (&lt;1.0s Gap)
					</h4>
					<div className="space-y-2 max-h-48 overflow-y-auto pr-1">
						{events.battles && events.battles.length > 0 ? (
							events.battles.map((b: any, idx: number) => (
								<div
									key={idx}
									className="flex items-center justify-between bg-zinc-900/80 p-2.5 rounded-lg border border-zinc-700/40 text-xs font-mono"
								>
									<span className="font-bold text-white">
										{b.driver_a} vs {b.driver_b}
									</span>
									<span className="text-amber-400 font-extrabold">
										+{b.gap_sec}s
									</span>
								</div>
							))
						) : (
							<span className="text-xs text-zinc-500">No close battles detected</span>
						)}
					</div>
				</div>

				{/* Pit Stop Events */}
				<div className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-700/60">
					<h4 className="text-sm font-bold text-red-400 uppercase tracking-wider mb-3 flex items-center gap-2">
						🛠️ Strategy Pit Stops
					</h4>
					<div className="space-y-2 max-h-48 overflow-y-auto pr-1">
						{events.pit_stops && events.pit_stops.length > 0 ? (
							events.pit_stops.slice(0, 8).map((p: any, idx: number) => (
								<div
									key={idx}
									className="flex items-center justify-between bg-zinc-900/80 p-2.5 rounded-lg border border-zinc-700/40 text-xs"
								>
									<span className="font-mono font-bold text-white">{p.driver}</span>
									<span className="text-zinc-400 font-mono">Lap {p.lap}</span>
									<span className="px-2 py-0.5 rounded bg-zinc-800 text-yellow-400 font-mono font-bold text-[10px]">
										{p.compound}
									</span>
								</div>
							))
						) : (
							<span className="text-xs text-zinc-500">No pit stop events recorded</span>
						)}
					</div>
				</div>

				{/* Sector Labels */}
				<div className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-700/60">
					<h4 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-3 flex items-center gap-2">
						🚩 Sector Breakdown
					</h4>
					<div className="space-y-2">
						{events.sector_labels.map((s: any, idx: number) => (
							<div
								key={idx}
								className="bg-zinc-900/80 p-2.5 rounded-lg border border-zinc-700/40 flex items-center justify-between text-xs"
							>
								<span className="font-bold text-white">{s.name}</span>
								<span className="text-zinc-400 font-mono">{s.turn_range}</span>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
