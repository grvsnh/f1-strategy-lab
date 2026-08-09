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
			<div className="inline-flex items-center gap-1.5 apple-glass p-1.5 rounded-2xl shadow-xl">
				{sessions.map((s) => {
					const isActive = selectedSession === s.code;
					return (
						<button
							key={s.code}
							onClick={() => onSessionChange(s.code)}
							className={`px-4 py-2 text-xs sm:text-sm font-bold font-sans rounded-xl transition-all duration-200 uppercase tracking-wider whitespace-nowrap active:scale-95 touch-manipulation ${
								isActive
									? "bg-[var(--accent-emerald)] text-black shadow-md scale-[1.02]"
									: "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]"
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
