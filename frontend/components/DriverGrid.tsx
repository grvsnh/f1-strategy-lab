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
		<div className="border border-zinc-800/80 bg-zinc-900/60 rounded-2xl p-4 font-mono">
			<div className="flex justify-between items-center mb-3 border-b border-zinc-800 pb-2">
				<h3 className="text-xs font-bold text-white uppercase tracking-wider">
					DRIVERS ({drivers.length})
				</h3>
				<span className="text-[10px] text-zinc-500 font-medium">
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
							className={`p-2.5 rounded-xl border cursor-pointer transition-all duration-150 relative group ${
								isA
									? "bg-emerald-950/40 border-emerald-500 text-white"
									: isB
									? "bg-blue-950/40 border-blue-500 text-white"
									: "bg-zinc-900/80 border-zinc-800/80 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800/60"
							}`}
						>
							<div className="flex items-center justify-between">
								<span className="text-xs font-bold tracking-wider">
									{drv}
								</span>
								<div className="flex gap-1">
									{isA && (
										<span className="bg-emerald-500 text-black text-[9px] px-1 py-0.2 rounded font-bold">
											A
										</span>
									)}
									{isB && (
										<span className="bg-blue-500 text-white text-[9px] px-1 py-0.2 rounded font-bold">
											B
										</span>
									)}
								</div>
							</div>

							<div className="mt-2 flex items-center justify-between text-[9px] text-zinc-500 font-medium border-t border-zinc-800/60 pt-1">
								<button
									onClick={(e) => {
										e.stopPropagation();
										onSelectDriver(drv);
									}}
									className="hover:text-emerald-400"
								>
									SET A
								</button>
								{onSelectCompareDriver && (
									<button
										onClick={(e) => {
											e.stopPropagation();
											onSelectCompareDriver(drv);
										}}
										className="hover:text-blue-400"
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
