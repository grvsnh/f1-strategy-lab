import circuitsData from "./f1_circuits_data.json";

export interface CircuitInfo {
	id: string;
	name: string;
	location: string;
	svg_path: string;
	norm_x: number[];
	norm_y: number[];
}

const CIRCUITS_MAP: Record<string, CircuitInfo> = circuitsData as any;

// Default fallback Monaco circuit loop if location not found
const DEFAULT_SVG_PATH =
	"M 100,250 C 120,100 280,80 400,120 C 520,160 650,90 750,150 C 850,210 880,350 780,420 C 680,490 500,480 380,440 C 260,400 150,450 80,380 C 40,320 80,280 100,250 Z";

export function getCircuitByLocation(location: string): CircuitInfo | null {
	if (!location) return null;

	const locKey = location.toLowerCase().trim();

	// Direct key match
	if (CIRCUITS_MAP[locKey]) {
		return CIRCUITS_MAP[locKey];
	}

	// Partial match in keys or names
	for (const k in CIRCUITS_MAP) {
		if (
			locKey.includes(k) ||
			k.includes(locKey) ||
			CIRCUITS_MAP[k].name.toLowerCase().includes(locKey)
		) {
			return CIRCUITS_MAP[k];
		}
	}

	// Known location aliases
	if (locKey.includes("bahrain") || locKey.includes("sakhir")) return CIRCUITS_MAP["sakhir"] || null;
	if (locKey.includes("monaco") || locKey.includes("monte carlo")) return CIRCUITS_MAP["monaco"] || null;
	if (locKey.includes("silverstone") || locKey.includes("british")) return CIRCUITS_MAP["silverstone"] || null;
	if (locKey.includes("spa") || locKey.includes("belgian")) return CIRCUITS_MAP["spa francorchamps"] || null;
	if (locKey.includes("monza") || locKey.includes("italian")) return CIRCUITS_MAP["monza"] || null;
	if (locKey.includes("austin") || locKey.includes("cota") || locKey.includes("united states")) return CIRCUITS_MAP["austin"] || null;
	if (locKey.includes("melbourne") || locKey.includes("australian")) return CIRCUITS_MAP["melbourne"] || null;
	if (locKey.includes("shanghai") || locKey.includes("chinese")) return CIRCUITS_MAP["shanghai"] || null;
	if (locKey.includes("singapore") || locKey.includes("marina bay")) return CIRCUITS_MAP["singapore"] || null;

	return null;
}

export function getCircuitSvgPath(location: string): string {
	const c = getCircuitByLocation(location);
	return c ? c.svg_path : DEFAULT_SVG_PATH;
}
