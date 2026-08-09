"use client";

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
		<div className="apple-card rounded-2xl p-4 font-sans shadow-lg">
			<div className="flex justify-between items-center mb-3 border-b border-[var(--border-color)] pb-2">
				<h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
					DRIVERS ({drivers.length})
				</h3>
				<span className="text-[10px] text-[var(--text-secondary)] font-semibold">
					CLICK = DETAILS
				</span>
			</div>

			<div className="grid grid-cols-2 gap-2 overflow-y-auto max-h-[560px] pr-1">
				{drivers.map((drv) => {
					const isA = drv === activeDriverA;
					const isB = drv === activeDriverB;

					return (
						<div
							key={drv}
							onClick={() => {
								if (onOpenIntelligence) onOpenIntelligence(drv);
								else onSelectDriver(drv);
							}}
							className={`p-3 rounded-xl border cursor-pointer transition-all duration-150 relative group ${
								isA
									? "bg-[var(--accent-emerald)]/15 border-[var(--accent-emerald)] text-[var(--text-primary)] font-bold shadow-md"
									: isB
									? "bg-[var(--accent-blue)]/15 border-[var(--accent-blue)] text-[var(--text-primary)] font-bold shadow-md"
									: "apple-card text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
							}`}
						>
							<div className="flex items-center justify-between">
								<span className="text-xs font-bold tracking-wider font-mono">
									{drv}
								</span>
								<div className="flex gap-1">
									{isA && (
										<span className="bg-[var(--accent-emerald)] text-black text-[9px] px-1.5 py-0.5 rounded font-bold">
											A
										</span>
									)}
									{isB && (
										<span className="bg-[var(--accent-blue)] text-white text-[9px] px-1.5 py-0.5 rounded font-bold">
											B
										</span>
									)}
								</div>
							</div>

							<div className="mt-2 flex items-center justify-between text-[9px] text-[var(--text-secondary)] font-semibold border-t border-[var(--border-color)] pt-1.5">
								<button
									onClick={(e) => {
										e.stopPropagation();
										onSelectDriver(drv);
									}}
									className="hover:text-[var(--accent-emerald)]"
								>
									SET A
								</button>
								{onSelectCompareDriver && (
									<button
										onClick={(e) => {
											e.stopPropagation();
											onSelectCompareDriver(drv);
										}}
										className="hover:text-[var(--accent-blue)]"
									>
										SET B
									</button>
								)}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
