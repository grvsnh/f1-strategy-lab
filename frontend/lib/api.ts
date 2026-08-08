const API_BASE = "http://localhost:8000";

export async function getSchedule(year: number) {
	const response = await fetch(`${API_BASE}/schedule/${year}`);

	if (!response.ok) {
		throw new Error("Failed to fetch schedule");
	}

	return response.json();
}

export async function getRace(year: number, grandPrix: string) {
	const response = await fetch(`${API_BASE}/race/${year}/${grandPrix}`);

	if (!response.ok) {
		throw new Error("Failed to fetch race");
	}

	return response.json();
}

export async function getTelemetry(
	year: number,
	grandPrix: string,
	driver: string,
) {
	const response = await fetch(
		`${API_BASE}/telemetry/${year}/${grandPrix}/${driver}`,
	);

	if (!response.ok) {
		throw new Error("Failed to fetch telemetry");
	}

	return response.json();
}

export async function getTrack(
	year: number,
	grandPrix: string,
	driver: string,
) {
	const response = await fetch(
		`${API_BASE}/track/${year}/${grandPrix}/${driver}`,
	);

	if (!response.ok) {
		throw new Error("Failed to fetch track");
	}

	return response.json();
}

export async function getDelta(
	year: number,
	grandPrix: string,
	driverA: string,
	driverB: string,
) {
	const response = await fetch(
		`${API_BASE}/delta/${year}/${grandPrix}/${driverA}/${driverB}`,
	);

	if (!response.ok) {
		throw new Error("Failed to fetch delta");
	}

	return response.json();
}

export async function getStrategy(
	year: number,
	grandPrix: string,
	driver: string,
) {
	const response = await fetch(
		`${API_BASE}/strategy/${year}/${grandPrix}/${driver}`,
	);

	if (!response.ok) {
		throw new Error("Failed to fetch strategy");
	}

	return response.json();
}

export async function getRecommendation(
	year: number,
	grandPrix: string,
	driver: string,
) {
	const response = await fetch(
		`${API_BASE}/recommendation/${year}/${grandPrix}/${driver}`,
	);

	if (!response.ok) {
		throw new Error(`Recommendation API Error: ${response.status}`);
	}

	return response.json();
}
