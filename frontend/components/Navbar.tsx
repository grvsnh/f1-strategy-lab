"use client";

interface NavbarProps {
	activeYear?: number;
	activeGrandPrix?: string;
	activeSession?: string;
	onResetSearch?: () => void;
}

export default function Navbar({
	activeYear,
	activeGrandPrix,
	activeSession,
	onResetSearch,
}: NavbarProps) {
	return (
		<header className="border-b-2 border-zinc-800 bg-black sticky top-0 z-40 mb-8 font-mono">
			<div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
				<div
					onClick={onResetSearch}
					className="flex items-center gap-3 cursor-pointer group"
				>
					<div className="bg-red-600 text-white font-black text-lg px-2.5 py-1 border-2 border-white shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
						F1
					</div>
					<div>
						<h1 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
							F1 STRATEGY LAB
							<span className="text-[10px] bg-zinc-800 text-red-400 border border-zinc-700 px-2 py-0.5 font-bold">
								v0.3.0
							</span>
						</h1>
						<p className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider">
							TELEMETRY & RACE INTELLIGENCE HUB
						</p>
					</div>
				</div>

				<div className="flex items-center gap-2 text-xs">
					{onResetSearch && (
						<button
							onClick={onResetSearch}
							className="bg-zinc-900 hover:bg-red-600 text-white px-3 py-1.5 border-2 border-zinc-700 hover:border-white font-bold uppercase transition shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
						>
							🔍 SEARCH ALL RACES
						</button>
					)}

					{activeGrandPrix && activeYear && (
						<div className="bg-zinc-900 border-2 border-zinc-800 px-3 py-1.5 font-bold text-zinc-300 uppercase">
							<span className="text-red-500 mr-1.5">●</span>
							<span>{activeYear} {activeGrandPrix}</span>
						</div>
					)}

					{activeSession && (
						<div className="bg-red-600 text-white font-black px-3 py-1.5 border-2 border-white shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
							{activeSession}
						</div>
					)}
				</div>
			</div>
		</header>
	);
}
