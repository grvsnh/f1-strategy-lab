"use client";

import { useEffect, useState } from "react";
import {
	getRace,
	getTelemetry,
	getDelta,
	getStrategy,
	getRecommendation,
	getTrackOutline,
} from "../lib/api";

import DriverSelector from "../components/DriverSelector";
import MetricSelector, { MetricKey } from "../components/MetricSelector";
import TelemetryChart from "../components/TelemetryChart";
import TrackMap from "../components/TrackMap";
import LapDeltaChart from "../components/LapDeltaChart";
import StrategyCard from "../components/StrategyCard";
import RecommendationCard from "../components/RecommendationCard";
import TrackCentricMap from "../components/TrackCentricMap";
import DriverGrid from "../components/DriverGrid";
import DriverIntelligenceModal from "../components/DriverIntelligenceModal";
import MultiDriverComparison from "../components/MultiDriverComparison";
import RaceReplay from "../components/RaceReplay";
import TrackIntelligencePanel from "../components/TrackIntelligencePanel";
import AdvancedRaceAnalytics from "../components/AdvancedRaceAnalytics";
import HeroRaceSearchLanding from "../components/HeroRaceSearchLanding";
import MotionPathLoader from "../components/MotionPathLoader";
import SessionSelector from "../components/SessionSelector";
import { ChartSkeleton } from "../components/Skeletons";
import ErrorBoundary from "../components/ErrorBoundary";

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
	const [hasActiveSelection, setHasActiveSelection] = useState(false);
	const [isAnimatingLoader, setIsAnimatingLoader] = useState(false);
	const [isDataReady, setIsDataReady] = useState(false);

	const [selectedYear, setSelectedYear] = useState(2026);
	const [selectedGrandPrix, setSelectedGrandPrix] = useState("Bahrain Grand Prix");
	const [selectedLocation, setSelectedLocation] = useState("Sakhir");
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
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const handleSelectRaceFromLanding = ({
		year,
		grandPrix,
		location,
	}: {
		year: number;
		grandPrix: string;
		location: string;
	}) => {
		setSelectedYear(year);
		setSelectedGrandPrix(grandPrix);
		setSelectedLocation(location || grandPrix);
		setSelectedSession("R");
		setIsDataReady(false);
		setIsAnimatingLoader(true);
	};

	const handleLoaderComplete = () => {
		setIsAnimatingLoader(false);
		setHasActiveSelection(true);
	};

	useEffect(() => {
		if (!hasActiveSelection && !isAnimatingLoader) return;

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
				setIsDataReady(true);
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "Failed to load race",
				);
				setIsDataReady(true);
			}
		}

		loadRace();
	}, [hasActiveSelection, isAnimatingLoader, selectedYear, selectedGrandPrix, selectedSession]);

	useEffect(() => {
		if (!hasActiveSelection || !selectedGrandPrix) return;

		async function loadAnalytics() {
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
	}, [hasActiveSelection, selectedYear, selectedGrandPrix, selectedSession, driverA, driverB]);

	return (
		<div className="min-h-screen bg-[var(--bg-app)] text-[var(--text-primary)] font-sans transition-colors duration-200">
			{/* Motion Path F1 Circuit Animation Screen */}
			{isAnimatingLoader && (
				<MotionPathLoader
					raceName={selectedGrandPrix}
					location={selectedLocation}
					year={selectedYear}
					isDataReady={isDataReady}
					onComplete={handleLoaderComplete}
				/>
			)}

			{/* MAIN LANDING SCREEN: System UI Theme adapted */}
			{!hasActiveSelection ? (
				<HeroRaceSearchLanding onSelectRace={handleSelectRaceFromLanding} />
			) : (
				<div className="pb-16 pt-6">
					{/* OVERHAULED RACE WORKBENCH HEADER: Apple System UI Glass Style */}
					<header className="max-w-7xl mx-auto px-4 sm:px-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-5">
						<div className="flex items-center gap-4">
							<button
								onClick={() => setHasActiveSelection(false)}
								className="apple-card text-[var(--text-primary)] px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition uppercase flex items-center gap-2 shadow-lg active:scale-95 touch-manipulation"
							>
								← BACK TO RACES
							</button>
							<div>
								<h2 className="text-xl sm:text-3xl font-black uppercase text-[var(--text-primary)] tracking-wide">
									{selectedYear} {selectedGrandPrix}
								</h2>
								<p className="text-xs sm:text-sm text-[var(--text-secondary)] font-semibold uppercase mt-0.5">
									📍 {selectedLocation} • LIVE TELEMETRY LAB
								</p>
							</div>
						</div>

						{/* Modular Premium Session Selector */}
						<SessionSelector
							selectedSession={selectedSession}
							onSessionChange={setSelectedSession}
						/>
					</header>

					<main className="max-w-7xl mx-auto px-4 sm:px-6">
						{error && (
							<div className="border border-red-500/40 bg-red-500/10 p-4 rounded-2xl mb-6 text-red-500 font-sans text-xs sm:text-sm font-semibold uppercase">
								⚠️ {error}
							</div>
						)}

						{/* WORKBENCH LAYOUT: Left Racers List, Middle Circuit Map, Right Analytics */}
						{raceData && (
							<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8 items-start">
								{/* LEFT SIDE: Racers List */}
								<div className="lg:col-span-3">
									<DriverGrid
										drivers={raceData.drivers}
										activeDriverA={driverA}
										activeDriverB={driverB}
										onSelectDriver={setDriverA}
										onSelectCompareDriver={setDriverB}
										onOpenIntelligence={setIntelDriver}
									/>
								</div>

								{/* MIDDLE: Circuit Racetrack Map from bacinger/f1-circuits */}
								<div className="lg:col-span-5">
									<TrackCentricMap
										trackData={trackOutline}
										selectedDriver={driverA}
										location={selectedLocation}
									/>
								</div>

								{/* RIGHT SIDE: Driver Telemetry Controls & Pit Recommendation */}
								<div className="lg:col-span-4 space-y-4">
									<div className="apple-card rounded-2xl p-5 shadow-xl">
										<h4 className="text-xs sm:text-sm font-bold uppercase text-[var(--text-primary)] mb-4 flex items-center justify-between border-b border-[var(--border-color)] pb-3">
											<span>ACTIVE DRIVER ANALYTICS</span>
											<span className="bg-[var(--accent-emerald)] text-black text-xs px-2.5 py-0.5 rounded-lg font-black">
												{driverA}
											</span>
										</h4>

										<DriverSelector
											label="PRIMARY DRIVER (A)"
											value={driverA}
											drivers={raceData.drivers}
											onChange={setDriverA}
										/>

										<div className="mt-4">
											<DriverSelector
												label="COMPARISON DRIVER (B)"
												value={driverB}
												drivers={raceData.drivers}
												onChange={setDriverB}
											/>
										</div>

										<div className="mt-4">
											<MetricSelector
												value={metric}
												onChange={setMetric}
											/>
										</div>
									</div>

									{recommendationData && (
										<RecommendationCard data={recommendationData} />
									)}
								</div>
							</div>
						)}

						{/* Interactive Race Replay, Track Intelligence & Sector Matrix */}
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
								<AdvancedRaceAnalytics
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

						{loading && (
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
								<ChartSkeleton height={320} />
								<ChartSkeleton height={320} />
							</div>
						)}

						{/* Telemetry Charts & Lap Delta */}
						{telemetryA && telemetryB && deltaData && !loading && (
							<ErrorBoundary>
								<div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
									<TrackMap driver={driverA} year={selectedYear} grandPrix={selectedGrandPrix} session={selectedSession} />
									{strategyData && <StrategyCard data={strategyData} />}
								</div>

								<div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
									<LapDeltaChart data={deltaData} />
									<TelemetryChart
										driverA={driverA}
										driverB={driverB}
										telemetryA={telemetryA}
										telemetryB={telemetryB}
										metric={metric}
									/>
								</div>
							</ErrorBoundary>
						)}
					</main>
				</div>
			)}
		</div>
	);
}
