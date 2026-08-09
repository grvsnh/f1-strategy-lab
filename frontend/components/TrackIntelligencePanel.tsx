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
			<div className="apple-card rounded-2xl p-6 my-6 text-center animate-pulse font-sans">
				<span className="text-[var(--text-secondary)] font-semibold text-xs uppercase">
					Analyzing track intelligence & driver battles...
				</span>
			</div>
		);
	}

	if (!events) return null;

	const sectorLabels = events.sector_labels || [
		{ name: "Sector 1", turn_range: "Turns 1-6" },
		{ name: "Sector 2", turn_range: "Turns 7-12" },
		{ name: "Sector 3", turn_range: "Turns 13-15" },
	];

	return (
		<div className="apple-card rounded-2xl p-6 my-6 shadow-xl font-sans">
			<h3 className="text-xl font-bold uppercase text-[var(--text-primary)] mb-4 flex items-center gap-2 tracking-wide">
				🧠 Track Intelligence & On-Track Events
			</h3>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{/* Driver Battles */}
				<div className="apple-glass p-4 rounded-xl">
					<h4 className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-3 flex items-center gap-2">
						⚔️ Driver Battles (&lt;1.0s Gap)
					</h4>
					<div className="space-y-2 max-h-48 overflow-y-auto pr-1">
						{events.battles && events.battles.length > 0 ? (
							events.battles.map((b: any, idx: number) => (
								<div
									key={idx}
									className="flex items-center justify-between apple-card p-2.5 rounded-lg text-xs font-mono"
								>
									<span className="font-bold text-[var(--text-primary)]">
										{b.driver_a} vs {b.driver_b}
									</span>
									<span className="text-amber-500 font-extrabold">
										+{b.gap_sec}s
									</span>
								</div>
							))
						) : (
							<span className="text-xs text-[var(--text-secondary)]">No close battles detected</span>
						)}
					</div>
				</div>

				{/* Pit Stop Events */}
				<div className="apple-glass p-4 rounded-xl">
					<h4 className="text-xs font-bold text-red-500 uppercase tracking-wider mb-3 flex items-center gap-2">
						🛠️ Strategy Pit Stops
					</h4>
					<div className="space-y-2 max-h-48 overflow-y-auto pr-1">
						{events.pit_stops && events.pit_stops.length > 0 ? (
							events.pit_stops.slice(0, 8).map((p: any, idx: number) => (
								<div
									key={idx}
									className="flex items-center justify-between apple-card p-2.5 rounded-lg text-xs"
								>
									<span className="font-mono font-bold text-[var(--text-primary)]">{p.driver}</span>
									<span className="text-[var(--text-secondary)] font-mono">Lap {p.lap}</span>
									<span className="px-2 py-0.5 rounded bg-[var(--accent-emerald)]/20 text-[var(--accent-emerald)] font-mono font-bold text-[10px] uppercase">
										{p.compound}
									</span>
								</div>
							))
						) : (
							<span className="text-xs text-[var(--text-secondary)]">No pit stop events recorded</span>
						)}
					</div>
				</div>

				{/* Sector Labels */}
				<div className="apple-glass p-4 rounded-xl">
					<h4 className="text-xs font-bold text-[var(--accent-blue)] uppercase tracking-wider mb-3 flex items-center gap-2">
						🚩 Sector Breakdown
					</h4>
					<div className="space-y-2">
						{sectorLabels.map((s: any, idx: number) => (
							<div
								key={idx}
								className="apple-card p-2.5 rounded-lg flex items-center justify-between text-xs"
							>
								<span className="font-bold text-[var(--text-primary)]">{s.name}</span>
								<span className="text-[var(--text-secondary)] font-mono">{s.turn_range}</span>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
