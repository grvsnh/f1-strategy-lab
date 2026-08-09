"use client";

import Image from "next/image";
import { getDriverProfile } from "../lib/driver_data";

interface DriverGridProps {
	drivers: string[];
	activeDriverA: string;
	activeDriverB?: string;
	onSelectDriver: (driver: string) => void;
	onSelectCompareDriver?: (driver: string) => void;
	onOpenIntelligence?: (driver: string) => void;
}

export default function DriverGrid({
	drivers,
	activeDriverA,
	activeDriverB,
	onSelectDriver,
	onSelectCompareDriver,
	onOpenIntelligence,
}: DriverGridProps) {
	return (
		<div className="apple-card rounded-2xl p-4 font-sans shadow-xl">
			<div className="flex justify-between items-center mb-3 border-b border-[var(--border-color)] pb-2">
				<h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
					RACERS ({drivers.length})
				</h3>
				<span className="text-[10px] text-[var(--text-secondary)] font-semibold uppercase">
					CLICK DRIVER FOR INTELLIGENCE
				</span>
			</div>

			<div className="grid grid-cols-1 gap-2.5 overflow-y-auto max-h-[580px] pr-1">
				{drivers.map((drvCode) => {
					const profile = getDriverProfile(drvCode);
					const isA = drvCode === activeDriverA;
					const isB = drvCode === activeDriverB;

					return (
						<div
							key={drvCode}
							onClick={() => {
								if (onOpenIntelligence) onOpenIntelligence(drvCode);
								else onSelectDriver(drvCode);
							}}
							className={`p-3 rounded-2xl border cursor-pointer transition-all duration-200 relative group flex items-center justify-between gap-3 ${
								isA
									? "bg-[var(--accent-emerald)]/15 border-[var(--accent-emerald)] shadow-md"
									: isB
									? "bg-[var(--accent-blue)]/15 border-[var(--accent-blue)] shadow-md"
									: "apple-card text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-color)]"
							}`}
						>
							<div className="flex items-center gap-3">
								{/* Driver Avatar / Headshot */}
								<div className="relative w-10 h-10 rounded-full overflow-hidden border border-[var(--border-color)] bg-zinc-900 flex-shrink-0 flex items-center justify-center">
									<img
										src={profile.imageUrl}
										alt={profile.fullName}
										className="w-full h-full object-cover object-top"
										onError={(e) => {
											// Fallback to stylized SVG avatar on image error
											(e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${profile.code}&background=18181b&color=10b981&bold=true`;
										}}
									/>
								</div>

								<div>
									<div className="flex items-center gap-2">
										<span className="text-xs font-extrabold text-[var(--text-primary)]">
											{profile.fullName}
										</span>
										<span
											className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded"
											style={{ backgroundColor: `${profile.teamColor}25`, color: profile.teamColor }}
										>
											#{profile.number}
										</span>
									</div>
									<p className="text-[10px] text-[var(--text-secondary)] font-semibold truncate max-w-[130px]">
										{profile.team}
									</p>
								</div>
							</div>

							<div className="flex flex-col items-end gap-1">
								<div className="flex gap-1">
									{isA && (
										<span className="bg-[var(--accent-emerald)] text-black text-[9px] px-2 py-0.5 rounded-full font-black uppercase">
											PRIMARY
										</span>
									)}
									{isB && (
										<span className="bg-[var(--accent-blue)] text-white text-[9px] px-2 py-0.5 rounded-full font-black uppercase">
											VS
										</span>
									)}
								</div>

								<div className="flex items-center gap-1 text-[10px] text-[var(--text-secondary)] font-bold">
									<button
										onClick={(e) => {
											e.stopPropagation();
											onSelectDriver(drvCode);
										}}
										className="hover:text-[var(--accent-emerald)] px-1 py-0.5"
									>
										A
									</button>
									<span>•</span>
									{onSelectCompareDriver && (
										<button
											onClick={(e) => {
												e.stopPropagation();
												onSelectCompareDriver(drvCode);
											}}
											className="hover:text-[var(--accent-blue)] px-1 py-0.5"
										>
											B
										</button>
									)}
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
