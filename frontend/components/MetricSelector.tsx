"use client";

import { memo } from "react";

export type MetricKey = "speed" | "throttle" | "brake" | "rpm" | "gear" | "drs";

interface MetricSelectorProps {
	value: MetricKey;
	onChange: (value: MetricKey) => void;
}

function MetricSelector({
	value,
	onChange,
}: MetricSelectorProps) {
	return (
		<div>
			<label className="block mb-2 text-zinc-400">Metric</label>

			<select
				value={value}
				onChange={(e) => onChange(e.target.value as MetricKey)}
				className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white"
			>
				<option value="speed">Speed</option>

				<option value="throttle">Throttle</option>

				<option value="brake">Brake</option>

				<option value="rpm">RPM</option>

				<option value="gear">Gear</option>

				<option value="drs">DRS</option>
			</select>
		</div>
	);
}

export default memo(MetricSelector);
