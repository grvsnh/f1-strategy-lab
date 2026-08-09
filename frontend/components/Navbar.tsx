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
		<header className="border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-40 mb-8 font-mono">
			<div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
				<div
					onClick={onResetSearch}
					className="flex items-center gap-3 cursor-pointer group"
				>
					<div className="w-9 h-9 rounded-xl bg-emerald-500 text-black font-black flex items-center justify-center text-sm shadow-md">
						F1
					</div>
					<div>
						<h1 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
							F1 STRATEGY LAB
							<span className="text-[10px] bg-zinc-800 text-zinc-400 border border-zinc-700/80 px-2 py-0.5 rounded-md font-mono">
								v0.3.0
							</span>
						</h1>
						<p className="text-[11px] text-zinc-500 font-medium uppercase tracking-wide">
							TELEMETRY & RACE INTELLIGENCE HUB
						</p>
					</div>
				</div>

				<div className="flex items-center gap-2.5 text-xs">
					{onResetSearch && (
						<button
							onClick={onResetSearch}
							className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white px-3.5 py-1.5 border border-zinc-800 rounded-xl font-bold uppercase transition flex items-center gap-1.5"
						>
							🔍 ALL RACES
						</button>
					)}

					{activeGrandPrix && activeYear && (
						<div className="bg-zinc-900/90 border border-zinc-800 px-3 py-1.5 rounded-xl font-medium text-zinc-300 flex items-center gap-2">
							<span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
							<span>{activeYear} {activeGrandPrix}</span>
						</div>
					)}

					{activeSession && (
						<div className="bg-emerald-950 border border-emerald-800 text-emerald-300 font-bold px-3 py-1.5 rounded-xl">
							{activeSession}
						</div>
					)}
				</div>
			</div>
		</header>
	);
}
