"use client";

import { memo } from "react";
import { getDriverProfile } from "../lib/driver_data";

interface DriverSelectorProps {
	label: string;
	value: string;
	drivers: string[];
	onChange: (value: string) => void;
}

function DriverSelector({
	label,
	value,
	drivers,
	onChange,
}: DriverSelectorProps) {
	return (
		<div>
			<label className="block mb-1.5 text-xs font-bold uppercase text-[var(--text-secondary)]">
				{label}
			</label>

			<select
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className="w-full apple-glass text-[var(--text-primary)] font-sans text-xs sm:text-sm font-semibold p-3 rounded-xl focus:outline-none border border-[var(--border-color)] cursor-pointer"
			>
				{drivers.map((drvCode) => {
					const profile = getDriverProfile(drvCode);
					return (
						<option key={drvCode} value={drvCode} className="bg-zinc-900 text-white">
							{profile.fullName} (#{profile.number} • {profile.team})
						</option>
					);
				})}
			</select>
		</div>
	);
}

export default memo(DriverSelector);
