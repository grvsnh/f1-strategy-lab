"use client";

interface NavbarProps {
	activeYear: number;
	activeGrandPrix: string;
	activeSession: string;
}

export default function Navbar({
	activeYear,
	activeGrandPrix,
	activeSession,
}: NavbarProps) {
	return (
		<header className="border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-40 mb-8">
			<div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-700 to-red-500 flex items-center justify-center text-xl shadow-lg shadow-red-950/60 font-black">
						🏎️
					</div>
					<div>
						<h1 className="text-xl font-black text-white tracking-wide flex items-center gap-2">
							F1 Strategy Lab
							<span className="text-[10px] bg-red-950 text-red-400 border border-red-800 px-2 py-0.5 rounded-full uppercase font-mono font-bold tracking-normal">
								v0.3.0
							</span>
						</h1>
						<p className="text-xs text-zinc-400 font-medium">
							Telemetry & Race Intelligence Platform
						</p>
					</div>
				</div>

				<div className="flex items-center gap-2 text-xs font-mono">
					<div className="bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl flex items-center gap-2 text-zinc-300">
						<span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
						<span>{activeYear} {activeGrandPrix}</span>
					</div>
					<div className="bg-red-950/70 border border-red-800 text-red-300 font-bold px-2.5 py-1.5 rounded-xl">
						{activeSession}
					</div>
				</div>
			</div>
		</header>
	);
}
