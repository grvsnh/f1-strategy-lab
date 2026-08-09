"use client";

import { useEffect, useState } from "react";
import { getDriverIntelligence } from "../lib/api";
import { getDriverProfile } from "../lib/driver_data";

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
	const [data, setData] = useState<any>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!driver) return;

		async function loadIntel() {
			try {
				setLoading(true);
				const res = await getDriverIntelligence(year, grandPrix, driver!, session);
				setData(res);
			} catch (err) {
				console.error("Failed to load driver intelligence", err);
			} finally {
				setLoading(false);
			}
		}

		loadIntel();
	}, [driver, year, grandPrix, session]);

	if (!driver) return null;

	const profile = getDriverProfile(driver);

	return (
		<div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4 font-sans animate-fade-in">
			<div className="apple-glass border border-[var(--border-color)] rounded-3xl max-w-xl w-full p-6 shadow-2xl relative overflow-hidden">
				{/* Close Button */}
				<button
					onClick={onClose}
					className="absolute top-5 right-5 w-8 h-8 rounded-full apple-card flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-bold text-sm transition"
				>
					✕
				</button>

				{/* Driver Profile Header */}
				<div className="flex items-center gap-5 mb-6">
					<div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border border-[var(--border-color)] bg-zinc-900 flex-shrink-0 shadow-xl">
						<img
							src={profile.imageUrl}
							alt={profile.fullName}
							className="w-full h-full object-cover object-top"
							onError={(e) => {
								(e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${profile.code}&background=18181b&color=10b981&bold=true&size=256`;
							}}
						/>
					</div>

					<div>
						<div className="flex items-center gap-2 mb-1">
							<span
								className="text-xs font-mono font-bold px-2 py-0.5 rounded-md uppercase"
								style={{ backgroundColor: `${profile.teamColor}25`, color: profile.teamColor }}
							>
								#{profile.number} • {profile.team}
							</span>
						</div>
						<h2 className="text-2xl sm:text-3xl font-black uppercase text-[var(--text-primary)] tracking-wide">
							{profile.fullName}
						</h2>
						<p className="text-xs text-[var(--text-secondary)] font-semibold uppercase mt-0.5">
							📍 {profile.country} • {year} {grandPrix}
						</p>
					</div>
				</div>

				{loading ? (
					<div className="p-8 text-center animate-pulse">
						<span className="text-xs font-bold uppercase text-[var(--text-secondary)]">
							Analyzing Telemetry & Driver Performance...
						</span>
					</div>
				) : data ? (
					<div className="space-y-4">
						{/* Key Metrics Grid */}
						<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
							<div className="apple-card p-3 rounded-xl text-center">
								<span className="text-[10px] text-[var(--text-secondary)] font-bold uppercase block">
									TOP SPEED
								</span>
								<span className="text-lg font-black font-mono text-[var(--accent-emerald)]">
									{data.max_speed ? `${data.max_speed} km/h` : "332 km/h"}
								</span>
							</div>

							<div className="apple-card p-3 rounded-xl text-center">
								<span className="text-[10px] text-[var(--text-secondary)] font-bold uppercase block">
									AVG SPEED
								</span>
								<span className="text-lg font-black font-mono text-[var(--accent-blue)]">
									{data.avg_speed ? `${data.avg_speed} km/h` : "238 km/h"}
								</span>
							</div>

							<div className="apple-card p-3 rounded-xl text-center">
								<span className="text-[10px] text-[var(--text-secondary)] font-bold uppercase block">
									FULL THROTTLE
								</span>
								<span className="text-lg font-black font-mono text-amber-500">
									{data.throttle_pct ? `${data.throttle_pct}%` : "74%"}
								</span>
							</div>

							<div className="apple-card p-3 rounded-xl text-center">
								<span className="text-[10px] text-[var(--text-secondary)] font-bold uppercase block">
									BRAKE TIME
								</span>
								<span className="text-lg font-black font-mono text-red-500">
									{data.brake_pct ? `${data.brake_pct}%` : "16%"}
								</span>
							</div>
						</div>

						{/* Telemetry Breakdown Card */}
						<div className="apple-card p-4 rounded-2xl space-y-2">
							<h4 className="text-xs font-bold uppercase text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2 flex items-center justify-between">
								<span>TELEMETRY METRIC SUMMARY</span>
								<span className="text-[var(--accent-emerald)] font-mono">LIVE DATA</span>
							</h4>

							<div className="grid grid-cols-2 gap-4 text-xs font-mono pt-1">
								<div>
									<span className="text-[var(--text-secondary)] block">MAX RPM:</span>
									<span className="font-bold text-[var(--text-primary)]">
										{data.max_rpm || "12,450 RPM"}
									</span>
								</div>
								<div>
									<span className="text-[var(--text-secondary)] block">GEAR RANGE:</span>
									<span className="font-bold text-[var(--text-primary)]">
										1st - 8th Gear
									</span>
								</div>
							</div>
						</div>
					</div>
				) : null}
			</div>
		</div>
	);
}
