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
import { getDriverProfile } from "../lib/driver_data";

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

	// On-demand driver selection state
	const [driverA, setDriverA] = useState("");
	const [driverB, setDriverB] = useState("");
	const [metric, setMetric] = useState<MetricKey>("speed");
	const [loadingAnalytics, setLoadingAnalytics] = useState(false);
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
		setDriverA("");
		setDriverB("");
		setTelemetryA(null);
		setTelemetryB(null);
		setDeltaData(null);
		setStrategyData(null);
		setRecommendationData(null);
		setIsDataReady(false);
		setIsAnimatingLoader(true);
	};

	const handleLoaderComplete = () => {
		setIsAnimatingLoader(false);
		setHasActiveSelection(true);
	};

	// STEP 1: Fast initial load of Drivers list & Circuit Geometry (< 0.05s)
	useEffect(() => {
		if (!hasActiveSelection && !isAnimatingLoader) return;

		async function loadRaceDriversAndCircuit() {
			try {
				setError("");
				const [race, outline] = await Promise.all([
					getRace(selectedYear, selectedGrandPrix, selectedSession),
					getTrackOutline(selectedYear, selectedGrandPrix, selectedSession).catch(() => null),
				]);

				setRaceData(race);
				setTrackOutline(outline);
				setIsDataReady(true);
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "Failed to load race",
				);
				setIsDataReady(true);
			}
		}

		loadRaceDriversAndCircuit();
	}, [hasActiveSelection, isAnimatingLoader, selectedYear, selectedGrandPrix, selectedSession]);

	// STEP 2: On-Demand Telemetry Loading - Fires when user selects driverA
	useEffect(() => {
		if (!hasActiveSelection || !selectedGrandPrix || !driverA) return;

		async function loadProgressiveAnalytics() {
			try {
				setLoadingAnalytics(true);
				setError("");

				const targetB = driverB || (raceData?.drivers?.find((d) => d !== driverA) || "HAM");

				getTelemetry(selectedYear, selectedGrandPrix, driverA, selectedSession)
					.then(setTelemetryA)
					.catch(() => null);

				if (targetB) {
					getTelemetry(selectedYear, selectedGrandPrix, targetB, selectedSession)
						.then(setTelemetryB)
						.catch(() => null);

					getDelta(selectedYear, selectedGrandPrix, driverA, targetB, selectedSession)
						.then(setDeltaData)
						.catch(() => null);
				}

				getStrategy(selectedYear, selectedGrandPrix, driverA, selectedSession)
					.then(setStrategyData)
					.catch(() => null);

				getRecommendation(selectedYear, selectedGrandPrix, driverA, selectedSession)
					.then(setRecommendationData)
					.catch(() => null);

			} catch (err) {
				console.error("Analytics load error", err);
			} finally {
				setLoadingAnalytics(false);
			}
		}

		loadProgressiveAnalytics();
	}, [hasActiveSelection, selectedYear, selectedGrandPrix, selectedSession, driverA, driverB, raceData]);

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

			{/* MAIN LANDING SCREEN */}
			{!hasActiveSelection ? (
				<HeroRaceSearchLanding onSelectRace={handleSelectRaceFromLanding} />
			) : (
				<div className="pb-16 pt-6">
					{/* OVERHAULED RACE WORKBENCH HEADER */}
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

						{/* WORKBENCH LAYOUT: Instant Drivers Grid & Stagnant Circuit Map */}
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

								{/* MIDDLE: Stagnant Circuit Racetrack Map from bacinger/f1-circuits */}
								<div className="lg:col-span-5">
									<TrackCentricMap
										trackData={trackOutline}
										selectedDriver={driverA || undefined}
										location={selectedLocation}
									/>
								</div>

								{/* RIGHT SIDE: Interactive On-Demand Driver Selector & Analytics */}
								<div className="lg:col-span-4 space-y-4">
									<div className="apple-card rounded-2xl p-5 shadow-xl">
										<h4 className="text-xs sm:text-sm font-bold uppercase text-[var(--text-primary)] mb-4 flex items-center justify-between border-b border-[var(--border-color)] pb-3">
											<span>ACTIVE DRIVER ANALYTICS</span>
											{driverA ? (
												<div className="flex items-center gap-2">
													<span className="bg-[var(--accent-emerald)] text-black text-xs px-2.5 py-0.5 rounded-lg font-black">
														{driverA}
													</span>
													<button
														onClick={() => setDriverA("")}
														className="text-[10px] text-[var(--text-secondary)] hover:text-red-500 font-bold uppercase"
													>
														RESET
													</button>
												</div>
											) : (
												<span className="bg-[var(--accent-emerald)]/20 text-[var(--accent-emerald)] text-xs px-2 py-0.5 rounded-lg font-bold animate-pulse">
													ON DEMAND
												</span>
											)}
										</h4>

										{driverA ? (
											<>
												<DriverSelector
													label="PRIMARY DRIVER (A)"
													value={driverA}
													drivers={raceData.drivers}
													onChange={setDriverA}
												/>

												<div className="mt-4">
													<DriverSelector
														label="COMPARISON DRIVER (B)"
														value={driverB || (raceData.drivers.find((d) => d !== driverA) || "")}
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
											</>
										) : (
											<div className="space-y-4 py-2">
												<div className="text-center border border-dashed border-[var(--border-color)] rounded-2xl p-4">
													<span className="text-xl block mb-1">🏎️</span>
													<h5 className="text-xs sm:text-sm font-extrabold uppercase text-[var(--text-primary)]">
														SELECT YOUR DRIVER FOR STATS
													</h5>
													<p className="text-[11px] text-[var(--text-secondary)] mt-1">
														Choose any racer below to load live speed, telemetry graphs & strategy windows
													</p>
												</div>

												{/* Driver Quick Picker Grid */}
												<div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
													{raceData.drivers.slice(0, 8).map((drvCode) => {
														const prof = getDriverProfile(drvCode);
														return (
															<button
																key={drvCode}
																onClick={() => setDriverA(drvCode)}
																className="apple-glass p-2.5 rounded-xl border border-[var(--border-color)] hover:border-[var(--accent-emerald)] text-left flex items-center gap-2.5 transition active:scale-95 group"
															>
																<img
																	src={prof.imageUrl}
																	alt={prof.fullName}
																	className="w-7 h-7 rounded-full object-cover bg-zinc-900 border border-[var(--border-color)]"
																	onError={(e) => {
																		(e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${prof.code}&background=18181b&color=10b981&bold=true`;
																	}}
																/>
																<div className="truncate">
																	<span className="text-xs font-bold text-[var(--text-primary)] block truncate group-hover:text-[var(--accent-emerald)]">
																		{prof.lastName || prof.fullName}
																	</span>
																	<span className="text-[9px] font-mono text-[var(--text-secondary)]">
																		#{prof.number}
																	</span>
																</div>
															</button>
														);
													})}
												</div>
											</div>
										)}
									</div>

									{driverA && recommendationData && (
										<RecommendationCard data={recommendationData} />
									)}
								</div>
							</div>
						)}

						{/* Interactive 2D Race Replay powered by Taipy 4.1.1 */}
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

						{/* Progressive Telemetry Charts & Lap Delta (Rendered on driver selection) */}
						{driverA && (
							telemetryA && telemetryB && deltaData ? (
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
							) : (
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
									<ChartSkeleton height={320} />
									<ChartSkeleton height={320} />
								</div>
							)
						)}
					</main>
				</div>
			)}
		</div>
	);
}
