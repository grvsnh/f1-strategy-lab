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
		<div className="border-2 border-zinc-800 bg-zinc-950 p-4 font-mono">
			<div className="flex justify-between items-center mb-3 border-b-2 border-zinc-800 pb-2">
				<h3 className="text-xs font-black text-white uppercase tracking-wider">
					RACERS GRID ({drivers.length})
				</h3>
				<span className="text-[10px] text-zinc-500 font-bold">
					CLICK = INTEL
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
							className={`p-2.5 border-2 cursor-pointer transition-all duration-150 relative group ${
								isA
									? "bg-red-950 border-red-600 text-white shadow-[2px_2px_0px_0px_rgba(239,68,68,1)]"
									: isB
									? "bg-blue-950 border-blue-600 text-white shadow-[2px_2px_0px_0px_rgba(59,130,246,1)]"
									: "bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-500 hover:bg-zinc-800"
							}`}
						>
							<div className="flex items-center justify-between">
								<span className="text-xs font-black tracking-wider">
									{drv}
								</span>
								<div className="flex gap-1">
									{isA && (
										<span className="bg-red-600 text-white text-[9px] px-1 py-0.2 font-black">
											A
										</span>
									)}
									{isB && (
										<span className="bg-blue-600 text-white text-[9px] px-1 py-0.2 font-black">
											B
										</span>
									)}
								</div>
							</div>

							<div className="mt-2 flex items-center justify-between text-[9px] text-zinc-400 font-bold border-t border-zinc-800 pt-1">
								<button
									onClick={(e) => {
										e.stopPropagation();
										onSelectDriver(drv);
									}}
									className="hover:text-red-400"
								>
									[SET A]
								</button>
								{onSelectCompareDriver && (
									<button
										onClick={(e) => {
											e.stopPropagation();
											onSelectCompareDriver(drv);
										}}
										className="hover:text-blue-400"
									>
										[SET B]
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
