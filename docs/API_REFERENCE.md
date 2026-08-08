# API Reference

## 1. Introduction

This document describes the REST API exposed by the F1 Strategy Lab backend (v0.3.0).

The API is implemented using FastAPI and provides endpoints for:

- Season & Schedule Selection
- Session Explorer
- Track-Centric Dashboard & Outline
- Driver Intelligence & Performance Data
- Multi-Driver Comparison
- Interactive Race Replay
- Track Events & Battle Analytics
- Advanced Race Analytics
- Telemetry & Lap Delta Analysis
- Strategy & Recommendation Engine

---

# 2. Base URL

Local Development:

```text
http://localhost:8000
```

---

# 3. Endpoints

## Health Check

```http
GET /
```

---

## Season Schedule

```http
GET /schedule/{year}
```

Returns list of official Grand Prix events for the season.

---

## Sessions List

```http
GET /sessions/{year}/{grand_prix}
```

Returns available F1 sessions (FP1, FP2, FP3, Q, S, R).

---

## Race Information

```http
GET /race/{year}/{grand_prix}?session={session}
```

Returns metadata and driver lineup for a selected race & session.

---

## Track Outline

```http
GET /track-outline/{year}/{grand_prix}?session={session}
```

Returns track geometry coordinates for minimal initial loading.

---

## Driver Intelligence

```http
GET /driver-intelligence/{year}/{grand_prix}/{driver}?session={session}
```

Returns driver profile, fastest lap, top speed, sector splits, stint compounds, and pit stop count.

---

## Multi-Driver Comparison

```http
GET /compare/{year}/{grand_prix}?drivers=VER&drivers=HAM&metrics=speed&session={session}
```

Returns on-demand telemetry for multiple drivers and specified metrics.

---

## Interactive Race Replay

```http
GET /replay/{year}/{grand_prix}?session={session}
```

Returns 2D animation position coordinates across laps for all drivers.

---

## Track Events & Intelligence

```http
GET /track-events/{year}/{grand_prix}?session={session}
```

Returns close driver battles (<1.0s gap), strategy pit stop events, and sector split ranges.

---

## Advanced Race Analytics

```http
GET /analytics/advanced/{year}/{grand_prix}?session={session}
```

Returns position progression timelines, median race pace comparison, and sector speed trap matrix.

---

## Driver Telemetry

```http
GET /telemetry/{year}/{grand_prix}/{driver}?session={session}
```

---

## Track Map

```http
GET /track/{year}/{grand_prix}/{driver}?session={session}
```

---

## Lap Delta Analysis

```http
GET /delta/{year}/{grand_prix}/{driver_a}/{driver_b}?session={session}
```

---

## Strategy Analysis

```http
GET /strategy/{year}/{grand_prix}/{driver}?session={session}
```

---

## Strategy Recommendation

```http
GET /recommendation/{year}/{grand_prix}/{driver}?session={session}
```

---

# 4. Frontend Integration

Frontend API requests are centralized in:

```text
frontend/lib/api.ts
```

Helper functions include:

```ts
getSchedule();
getSessions();
getRace();
getTrackOutline();
getTrackEvents();
getAdvancedRaceAnalytics();
getDriverIntelligence();
getCompareDrivers();
getRaceReplay();
getTelemetry();
getTrack();
getDelta();
getStrategy();
getRecommendation();
```
