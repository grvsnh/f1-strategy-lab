# F1 Strategy Lab (v0.3.0)

F1 Strategy Lab is an open-source Formula 1 analytics platform designed to transform race telemetry into meaningful performance insights, real-time race replay, and strategic recommendations.

The platform combines telemetry visualization, driver comparison, track analysis, 2D race replay animation, track intelligence, and strategy evaluation into a unified analytical dashboard built on real Formula 1 data.

---

# Features

## Race Explorer & Dynamic Selection
- Dynamic Season Selection (2021–2024+)
- Session Explorer (FP1, FP2, FP3, Qualifying, Sprint, Race)
- Track-Centric Dashboard Layout with surrounding driver grid
- Minimal initial payload loading

## Interactive 2D Race Replay
- Real-time 60fps 2D animated track map
- Draggable timeline scrubber across laps/time frames
- Play/Pause & Speed Controls (1x, 2x, 5x, 10x)
- Multi-driver visibility toggles & single-driver spotlight mode

## Track Intelligence & Battle Analytics
- Automated close driver battle detection (<1.0s gap)
- Pit stop strategy markers and compound change annotations
- Sector 1, Sector 2, Sector 3 split breakdowns

## Driver Intelligence
- On-demand driver profile modal
- Fastest lap time & top speed stats
- Sector split times & tyre compound history

## Multi-Driver Comparison & Analytics
- Multi-driver comparative telemetry overlays
- Position progression timelines across laps
- Median race pace consistency matrix

## Telemetry & Strategy Engine
- Metric selection (Speed, Throttle, Brake, RPM, Gear, DRS)
- Speed heatmaps on circuit layouts
- Lap delta comparison between drivers
- Stint breakdown & real-time pit window recommendations

---

# Technology Stack

## Frontend
- Next.js (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Plotly.js / Canvas Visualization

## Backend
- Python 3.11
- FastAPI
- FastF1
- Pandas / NumPy

---

# Quick Start

## Backend
```bash
cd backend
python -m pip install -r requirements.txt
uvicorn app.main:app --reload
```
Backend API: `http://localhost:8000`

## Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend App: `http://localhost:3000`

---

# Documentation

Detailed documentation in `docs/`:
- `SRS.md` - Software Requirements Specification
- `ARCHITECTURE.md` - System Architecture & Services Map
- `API_REFERENCE.md` - Complete REST API Reference (14 endpoints)
- `DOMAIN_MODEL.md` - Domain Model & Entities
- `USE_CASES.md` - Key Use Cases

---

# License

GNU Affero General Public License v3.0 (AGPL-3.0). See LICENSE file for details.
