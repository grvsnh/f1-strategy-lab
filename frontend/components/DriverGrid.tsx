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
		<div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 backdrop-blur-md p-5 flex flex-col h-full">
			<div className="flex justify-between items-center mb-4">
				<h3 className="text-lg font-bold text-white flex items-center gap-2">
					🏎️ Drivers Grid
				</h3>
				<span className="text-xs text-zinc-400 bg-zinc-800 px-2 py-1 rounded-md">
					{drivers.length} Drivers
				</span>
			</div>

			<div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-2 gap-2.5 overflow-y-auto max-h-[500px] pr-1">
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
									? "bg-blue-950/70 border-blue-600 text-white shadow-lg shadow-blue-900/20"
									: isB
									? "bg-red-950/70 border-red-600 text-white shadow-lg shadow-red-900/20"
									: "bg-zinc-800/60 border-zinc-700/60 text-zinc-300 hover:bg-zinc-800 hover:border-zinc-500"
							}`}
						>
							<div className="flex items-center justify-between">
								<span className="text-sm font-extrabold tracking-wider font-mono">
									{drv}
								</span>
								<div className="flex gap-1">
									{isA && (
										<span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">
											A
										</span>
									)}
									{isB && (
										<span className="bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">
											B
										</span>
									)}
								</div>
							</div>

							<div className="mt-2 flex items-center justify-between text-[11px] text-zinc-400">
								<button
									onClick={(e) => {
										e.stopPropagation();
										onSelectDriver(drv);
									}}
									className="hover:text-blue-400 font-semibold"
								>
									Set A
								</button>
								{onSelectCompareDriver && (
									<button
										onClick={(e) => {
											e.stopPropagation();
											onSelectCompareDriver(drv);
										}}
										className="hover:text-red-400 font-semibold"
									>
										Set B
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
