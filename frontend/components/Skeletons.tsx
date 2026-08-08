"use client";

export function MapSkeleton() {
	return (
		<div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-8 min-h-[480px] flex flex-col justify-between animate-pulse">
			<div className="flex justify-between items-center mb-6">
				<div className="h-6 w-48 bg-zinc-800 rounded-md"></div>
				<div className="h-6 w-16 bg-zinc-800 rounded-full"></div>
			</div>
			<div className="h-80 w-full bg-zinc-800/60 rounded-xl flex items-center justify-center">
				<span className="text-xs text-zinc-600 font-mono">Loading Circuit Map...</span>
			</div>
		</div>
	);
}

export function ChartSkeleton({ height = 400 }: { height?: number }) {
	return (
		<div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-8 flex flex-col justify-between animate-pulse">
			<div className="flex justify-between items-center mb-6">
				<div className="h-6 w-40 bg-zinc-800 rounded-md"></div>
				<div className="h-4 w-24 bg-zinc-800 rounded-md"></div>
			</div>
			<div className={`w-full bg-zinc-800/60 rounded-xl flex items-center justify-center`} style={{ height }}>
				<span className="text-xs text-zinc-600 font-mono">Loading Chart Analytics...</span>
			</div>
		</div>
	);
}
