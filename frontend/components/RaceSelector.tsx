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
	onYearChange: (year: number) => void;
	onGrandPrixChange: (gp: string) => void;
}

const AVAILABLE_YEARS = [2024, 2023, 2022, 2021];

export default function RaceSelector({
	selectedYear,
	selectedGrandPrix,
	onYearChange,
	onGrandPrixChange,
}: RaceSelectorProps) {
	const [schedule, setSchedule] = useState<ScheduleEvent[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		async function loadSchedule() {
			try {
				setLoading(true);
				const events = await getSchedule(selectedYear);
				setSchedule(events);

				// If current selected GP is not in new schedule, select first event
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
		</div>
	);
}
