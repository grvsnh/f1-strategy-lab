const API_BASE = "http://localhost:8000";

export async function getSchedule(year: number) {
	const response = await fetch(`${API_BASE}/schedule/${year}`);
	if (!response.ok) throw new Error("Failed to fetch schedule");
	return response.json();
}

export async function getSessions(year: number, grandPrix: string) {
	const response = await fetch(`${API_BASE}/sessions/${year}/${grandPrix}`);
	if (!response.ok) throw new Error("Failed to fetch sessions");
	return response.json();
}

export async function getRace(year: number, grandPrix: string, session = "R") {
	const response = await fetch(`${API_BASE}/race/${year}/${grandPrix}?session=${session}`);
	if (!response.ok) throw new Error("Failed to fetch race");
	return response.json();
}

export async function getTrackOutline(year: number, grandPrix: string, session = "R") {
	const response = await fetch(`${API_BASE}/track-outline/${year}/${grandPrix}?session=${session}`);
	if (!response.ok) throw new Error("Failed to fetch track outline");
	return response.json();
}

export async function getDriverIntelligence(year: number, grandPrix: string, driver: string, session = "R") {
	const response = await fetch(`${API_BASE}/driver-intelligence/${year}/${grandPrix}/${driver}?session=${session}`);
	if (!response.ok) throw new Error("Failed to fetch driver intelligence");
	return response.json();
}

export async function getCompareDrivers(
	year: number,
	grandPrix: string,
	drivers: string[],
	metrics: string[],
	session = "R"
) {
	const driverParams = drivers.map((d) => `drivers=${encodeURIComponent(d)}`).join("&");
	const metricParams = metrics.map((m) => `metrics=${encodeURIComponent(m)}`).join("&");
	const response = await fetch(
		`${API_BASE}/compare/${year}/${grandPrix}?${driverParams}&${metricParams}&session=${session}`
	);
	if (!response.ok) throw new Error("Failed to fetch multi-driver comparison");
	return response.json();
}

export async function getRaceReplay(year: number, grandPrix: string, session = "R") {
	const response = await fetch(`${API_BASE}/replay/${year}/${grandPrix}?session=${session}`);
	if (!response.ok) throw new Error("Failed to fetch race replay");
	return response.json();
}

export async function getTelemetry(year: number, grandPrix: string, driver: string, session = "R") {
	const response = await fetch(`${API_BASE}/telemetry/${year}/${grandPrix}/${driver}?session=${session}`);
	if (!response.ok) throw new Error("Failed to fetch telemetry");
	return response.json();
}

export async function getTrack(year: number, grandPrix: string, driver: string, session = "R") {
	const response = await fetch(`${API_BASE}/track/${year}/${grandPrix}/${driver}?session=${session}`);
	if (!response.ok) throw new Error("Failed to fetch track");
	return response.json();
}

export async function getDelta(year: number, grandPrix: string, driverA: string, driverB: string, session = "R") {
	const response = await fetch(`${API_BASE}/delta/${year}/${grandPrix}/${driverA}/${driverB}?session=${session}`);
	if (!response.ok) throw new Error("Failed to fetch delta");
	return response.json();
}

export async function getStrategy(year: number, grandPrix: string, driver: string, session = "R") {
	const response = await fetch(`${API_BASE}/strategy/${year}/${grandPrix}/${driver}?session=${session}`);
	if (!response.ok) throw new Error("Failed to fetch strategy");
	return response.json();
}

export async function getRecommendation(year: number, grandPrix: string, driver: string, session = "R") {
	const response = await fetch(`${API_BASE}/recommendation/${year}/${grandPrix}/${driver}?session=${session}`);
	if (!response.ok) throw new Error(`Recommendation API Error: ${response.status}`);
	return response.json();
}
