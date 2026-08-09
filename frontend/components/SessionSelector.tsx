"use client";

interface Session {
	code: string;
	label: string;
}

interface SessionSelectorProps {
	selectedSession: string;
	onSessionChange: (code: string) => void;
	sessions?: Session[];
}

const DEFAULT_SESSIONS: Session[] = [
	{ code: "FP1", label: "FP1" },
	{ code: "FP2", label: "FP2" },
	{ code: "FP3", label: "FP3" },
	{ code: "Q", label: "QUALIFYING" },
	{ code: "S", label: "SPRINT" },
	{ code: "R", label: "RACE" },
];

export default function SessionSelector({
	selectedSession,
	onSessionChange,
	sessions = DEFAULT_SESSIONS,
}: SessionSelectorProps) {
	return (
		<div className="w-full sm:w-auto overflow-x-auto scrollbar-none">
			<div className="inline-flex items-center gap-1.5 bg-zinc-900/90 p-1.5 rounded-2xl border border-zinc-800/90 shadow-2xl backdrop-blur-xl">
				{sessions.map((s) => {
					const isActive = selectedSession === s.code;
					return (
						<button
							key={s.code}
							onClick={() => onSessionChange(s.code)}
							className={`px-4 py-2 text-xs sm:text-sm font-extrabold font-mono rounded-xl transition-all duration-200 uppercase tracking-wider whitespace-nowrap active:scale-95 touch-manipulation ${
								isActive
									? "bg-gradient-to-r from-emerald-500 to-teal-400 text-black shadow-lg shadow-emerald-500/25 scale-[1.02]"
									: "text-zinc-400 hover:text-white hover:bg-zinc-800/70"
							}`}
						>
							{s.label}
						</button>
					);
				})}
			</div>
		</div>
	);
}
