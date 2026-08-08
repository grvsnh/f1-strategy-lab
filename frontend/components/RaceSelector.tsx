"use client";

import { useEffect, useState } from "react";
import { getSchedule } from "../lib/api";

interface ScheduleEvent {
	round: number;
	event_name: string;
	official_name: string;
	location: string;
	country: string;
	event_date: string;
}

interface RaceSelectorProps {
	selectedYear: number;
	selectedGrandPrix: string;
	selectedSession: string;
	onYearChange: (year: number) => void;
	onGrandPrixChange: (gp: string) => void;
	onSessionChange: (session: string) => void;
}

const AVAILABLE_YEARS = [2024, 2023, 2022, 2021];
const SESSIONS = [
	{ code: "FP1", label: "FP1" },
	{ code: "FP2", label: "FP2" },
	{ code: "FP3", label: "FP3" },
	{ code: "Q", label: "Quali" },
	{ code: "S", label: "Sprint" },
	{ code: "R", label: "Race" },
];

export default function RaceSelector({
	selectedYear,
	selectedGrandPrix,
	selectedSession,
	onYearChange,
	onGrandPrixChange,
	onSessionChange,
}: RaceSelectorProps) {
	const [schedule, setSchedule] = useState<ScheduleEvent[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		async function loadSchedule() {
			try {
				setLoading(true);
				const events = await getSchedule(selectedYear);
				setSchedule(events);

				if (events.length > 0) {
					const exists = events.some(
						(e: ScheduleEvent) =>
							e.event_name.toLowerCase().includes(selectedGrandPrix.toLowerCase()) ||
							e.location.toLowerCase().includes(selectedGrandPrix.toLowerCase())
					);
					if (!exists) {
						onGrandPrixChange(events[0].event_name);
					}
				}
			} catch (err) {
				console.error("Failed to load schedule", err);
			} finally {
				setLoading(false);
			}
		}

		loadSchedule();
	}, [selectedYear]);

	return (
		<div className="flex flex-wrap gap-4 items-center bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mb-6">
			<div>
				<label className="block text-xs text-zinc-400 uppercase mb-1">
					Season
				</label>
				<select
					value={selectedYear}
					onChange={(e) => onYearChange(Number(e.target.value))}
					className="bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500"
				>
					{AVAILABLE_YEARS.map((y) => (
						<option key={y} value={y}>
							{y}
						</option>
					))}
				</select>
			</div>

			<div className="flex-1 min-w-[200px]">
				<label className="block text-xs text-zinc-400 uppercase mb-1">
					Grand Prix / Event
				</label>
				<select
					value={selectedGrandPrix}
					disabled={loading || schedule.length === 0}
					onChange={(e) => onGrandPrixChange(e.target.value)}
					className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500 disabled:opacity-50"
				>
					{schedule.map((evt) => (
						<option key={evt.round} value={evt.event_name}>
							Round {evt.round}: {evt.event_name} ({evt.location})
						</option>
					))}
				</select>
			</div>

			<div>
				<label className="block text-xs text-zinc-400 uppercase mb-1">
					Session
				</label>
				<div className="flex gap-1 bg-zinc-800 p-1 rounded-lg border border-zinc-700">
					{SESSIONS.map((s) => (
						<button
							key={s.code}
							onClick={() => onSessionChange(s.code)}
							className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
								selectedSession === s.code
									? "bg-red-600 text-white"
									: "text-zinc-400 hover:text-white hover:bg-zinc-700"
							}`}
						>
							{s.label}
						</button>
					))}
				</div>
			</div>
		</div>
	);
}
