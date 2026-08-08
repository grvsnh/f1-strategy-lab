"use client";

import { useEffect, useState } from "react";
import {
	getRace,
	getTelemetry,
	getDelta,
	getStrategy,
	getRecommendation,
} from "../lib/api";

import DriverSelector from "../components/DriverSelector";
import MetricSelector, { MetricKey } from "../components/MetricSelector";
import TelemetryChart from "../components/TelemetryChart";
import TrackMap from "../components/TrackMap";
import LapDeltaChart from "../components/LapDeltaChart";
import StrategyCard from "../components/StrategyCard";
import RecommendationCard from "../components/RecommendationCard";
import RaceSelector from "../components/RaceSelector";
import TrackCentricMap from "../components/TrackCentricMap";
import DriverGrid from "../components/DriverGrid";
import DriverIntelligenceModal from "../components/DriverIntelligenceModal";
import MultiDriverComparison from "../components/MultiDriverComparison";
import RaceReplay from "../components/RaceReplay";
import TrackIntelligencePanel from "../components/TrackIntelligencePanel";
import { ChartSkeleton } from "../components/Skeletons";
import Navbar from "../components/Navbar";
import ErrorBoundary from "../components/ErrorBoundary";
import { getTrackOutline } from "../lib/api";

interface RaceData {
	event: string;
	location: string;
	country: string;
	year: number;
	drivers: string[];
}

interface TelemetryData {
	driver: string;
	speed: number[];
	throttle: number[];
	brake: number[];
	rpm: number[];
	gear: number[];
	drs: number[];
	samples: number[];
}

interface DeltaData {
	driver_a: string;
	driver_b: string;
	delta: number[];
	samples: number[];
}

interface Stint {
	compound: string;
	start_lap: number;
	end_lap: number;
}

interface StrategyData {
	driver: string;
	stints: Stint[];
}

interface RecommendationData {
	driver: string;
	current_compound: string;
	current_tyre_life: number;
	recommended_pit_lap: number;
	remaining_laps: number;
	message: string;
}

export default function Home() {
	const [selectedYear, setSelectedYear] = useState(2024);
	const [selectedGrandPrix, setSelectedGrandPrix] = useState("Bahrain");
	const [selectedSession, setSelectedSession] = useState("R");

	const [raceData, setRaceData] = useState<RaceData | null>(null);
	const [trackOutline, setTrackOutline] = useState<any>(null);
	const [intelDriver, setIntelDriver] = useState<string | null>(null);

	const [telemetryA, setTelemetryA] = useState<TelemetryData | null>(null);

	const [telemetryB, setTelemetryB] = useState<TelemetryData | null>(null);

	const [deltaData, setDeltaData] = useState<DeltaData | null>(null);

	const [strategyData, setStrategyData] = useState<StrategyData | null>(null);

	const [recommendationData, setRecommendationData] =
		useState<RecommendationData | null>(null);

	const [driverA, setDriverA] = useState("VER");

	const [driverB, setDriverB] = useState("HAM");

	const [metric, setMetric] = useState<MetricKey>("speed");

	const [loading, setLoading] = useState(true);

	const [error, setError] = useState("");

	useEffect(() => {
		async function loadRace() {
			try {
				setError("");
				const [race, outline] = await Promise.all([
					getRace(selectedYear, selectedGrandPrix, selectedSession),
					getTrackOutline(selectedYear, selectedGrandPrix, selectedSession).catch(() => null),
				]);

				setRaceData(race);
				setTrackOutline(outline);

				if (race.drivers && race.drivers.length >= 2) {
					if (!race.drivers.includes(driverA)) setDriverA(race.drivers[0]);
					if (!race.drivers.includes(driverB)) setDriverB(race.drivers[1]);
				}
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "Failed to load race",
				);
			}
		}

		loadRace();
	}, [selectedYear, selectedGrandPrix, selectedSession]);

	useEffect(() => {
		async function loadAnalytics() {
			if (!selectedGrandPrix) return;
			try {
				setLoading(true);
				setError("");

				const [dataA, dataB, delta, strategy, recommendation] =
					await Promise.all([
						getTelemetry(selectedYear, selectedGrandPrix, driverA, selectedSession),
						getTelemetry(selectedYear, selectedGrandPrix, driverB, selectedSession),
						getDelta(selectedYear, selectedGrandPrix, driverA, driverB, selectedSession),
						getStrategy(selectedYear, selectedGrandPrix, driverA, selectedSession),
						getRecommendation(selectedYear, selectedGrandPrix, driverA, selectedSession),
					]);

				setTelemetryA(dataA);
				setTelemetryB(dataB);
				setDeltaData(delta);
				setStrategyData(strategy);
				setRecommendationData(recommendation);
			} catch (err) {
				setError(
					err instanceof Error
						? err.message
						: "Failed to load analytics",
				);
			} finally {
				setLoading(false);
			}
		}

		loadAnalytics();
	}, [selectedYear, selectedGrandPrix, selectedSession, driverA, driverB]);

	return (
		<div className="min-h-screen bg-black text-white pb-12">
			<Navbar
				activeYear={selectedYear}
				activeGrandPrix={selectedGrandPrix}
				activeSession={selectedSession}
			/>
			<main className="max-w-7xl mx-auto px-6">
				<RaceSelector
					selectedYear={selectedYear}
					selectedGrandPrix={selectedGrandPrix}
					selectedSession={selectedSession}
					onYearChange={setSelectedYear}
					onGrandPrixChange={setSelectedGrandPrix}
					onSessionChange={setSelectedSession}
				/>

				{error && (
					<div className="rounded-2xl border border-red-500 bg-red-950 p-6 mb-6">
						{error}
					</div>
				)}

				{raceData && (
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
						<div className="lg:col-span-2">
							<TrackCentricMap trackData={trackOutline} selectedDriver={driverA} />
						</div>

						<div>
							<DriverGrid
								drivers={raceData.drivers}
								activeDriverA={driverA}
								activeDriverB={driverB}
								onSelectDriver={setDriverA}
								onSelectCompareDriver={setDriverB}
								onOpenIntelligence={setIntelDriver}
							/>
						</div>
					</div>
				)}

				{raceData && (
					<ErrorBoundary>
						<RaceReplay
							year={selectedYear}
							grandPrix={selectedGrandPrix}
							session={selectedSession}
						/>
						<TrackIntelligencePanel
							year={selectedYear}
							grandPrix={selectedGrandPrix}
							session={selectedSession}
						/>
					</ErrorBoundary>
				)}

				<DriverIntelligenceModal
					driver={intelDriver}
					year={selectedYear}
					grandPrix={selectedGrandPrix}
					session={selectedSession}
					onClose={() => setIntelDriver(null)}
				/>

				{raceData && raceData.drivers && (
					<MultiDriverComparison
						availableDrivers={raceData.drivers}
						year={selectedYear}
						grandPrix={selectedGrandPrix}
						session={selectedSession}
					/>
				)}

				{raceData && (
					<div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 mb-6">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<DriverSelector
								label="Driver A"
								value={driverA}
								drivers={raceData.drivers}
								onChange={setDriverA}
							/>

							<DriverSelector
								label="Driver B"
								value={driverB}
								drivers={raceData.drivers}
								onChange={setDriverB}
							/>

							<MetricSelector
								value={metric}
								onChange={setMetric}
							/>
						</div>
					</div>
				)}

				{loading && (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
						<ChartSkeleton height={300} />
						<ChartSkeleton height={300} />
					</div>
				)}

				{telemetryA && telemetryB && deltaData && !loading && (
					<ErrorBoundary>
						<div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
							<TrackMap driver={driverA} year={selectedYear} grandPrix={selectedGrandPrix} session={selectedSession} />

							{recommendationData && (
								<RecommendationCard data={recommendationData} />
							)}
						</div>

						<div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
							{strategyData && (
								<StrategyCard data={strategyData} />
							)}

							<LapDeltaChart data={deltaData} />
						</div>

						<TelemetryChart
							driverA={driverA}
							driverB={driverB}
							telemetryA={telemetryA}
							telemetryB={telemetryB}
							metric={metric}
						/>
					</ErrorBoundary>
				)}
			</main>
		</div>
	);
}
