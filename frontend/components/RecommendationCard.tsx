import { memo } from "react";

interface RecommendationData {
	driver: string;
	current_compound: string;
	current_tyre_life: number;
	recommended_pit_lap: number;
	remaining_laps: number;
	message: string;
}

interface Props {
	data: RecommendationData;
}

function RecommendationCard({ data }: Props) {
	return (
		<div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 mb-8">
			<div className="flex items-center justify-between mb-6">
				<h3 className="text-2xl font-bold">Strategy Recommendation</h3>

				<span className="text-zinc-400">{data.driver}</span>
			</div>

			<div className="grid md:grid-cols-2 gap-4">
				<div className="rounded-xl bg-black/30 border border-zinc-800 p-4">
					<p className="text-zinc-500 text-sm">Current Compound</p>

					<p className="text-xl font-bold mt-1">
						{data.current_compound}
					</p>
				</div>

				<div className="rounded-xl bg-black/30 border border-zinc-800 p-4">
					<p className="text-zinc-500 text-sm">Tyre Life</p>

					<p className="text-xl font-bold mt-1">
						{data.current_tyre_life} laps
					</p>
				</div>

				<div className="rounded-xl bg-black/30 border border-zinc-800 p-4">
					<p className="text-zinc-500 text-sm">Recommended Pit</p>

					<p className="text-xl font-bold mt-1">
						Lap {data.recommended_pit_lap}
					</p>
				</div>

				<div className="rounded-xl bg-black/30 border border-zinc-800 p-4">
					<p className="text-zinc-500 text-sm">Remaining Laps</p>

					<p className="text-xl font-bold mt-1">
						{data.remaining_laps}
					</p>
				</div>
			</div>

			<div className="mt-6 rounded-xl border border-green-500/30 bg-green-950/30 p-6">
				<p className="text-2xl font-bold text-green-400">
					{data.message}
				</p>
			</div>
		</div>
	);
}

export default memo(RecommendationCard);
