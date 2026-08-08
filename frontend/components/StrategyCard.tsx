"use client";

import { memo } from "react";

interface Stint {
	compound: string;
	start_lap: number;
	end_lap: number;
}

interface StrategyData {
	driver: string;
	stints: Stint[];
}

interface StrategyCardProps {
	data: StrategyData;
}

function StrategyCard({ data }: StrategyCardProps) {
	function getCompoundColor(compound: string) {
		switch (compound) {
			case "SOFT":
				return "bg-red-500";

			case "MEDIUM":
				return "bg-yellow-500";

			case "HARD":
				return "bg-white";

			default:
				return "bg-zinc-500";
		}
	}

	return (
		<div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 mt-8">
			<div className="flex items-center justify-between mb-6">
				<h3 className="text-2xl font-bold">Strategy Analysis</h3>

				<span className="text-zinc-400">{data.driver}</span>
			</div>

			<div className="space-y-4">
				{data.stints.map((stint, index) => (
					<div
						key={index}
						className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950 p-4"
					>
						<div className="flex items-center gap-4">
							<div
								className={`h-4 w-4 rounded-full ${getCompoundColor(
									stint.compound,
								)}`}
							/>

							<p className="font-semibold">{stint.compound}</p>
						</div>

						<p className="text-zinc-400">
							Lap {stint.start_lap} → {stint.end_lap}
						</p>
					</div>
				))}
			</div>
		</div>
	);
}

export default memo(StrategyCard);
