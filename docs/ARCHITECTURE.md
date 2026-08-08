# System Architecture (v0.3.0)

## 1. High-Level Architecture

F1 Strategy Lab follows a decoupled client-server architecture:

```text
┌─────────────────────────────────────────────────────────┐
│                    Next.js Frontend                     │
│  - Race Explorer & Dynamic Season/Session Selector      │
│  - Track-Centric Dashboard & Driver Grid               │
│  - Interactive Race Replay Engine (Canvas/SVG 60fps)    │
│  - On-Demand Driver Intelligence Modal                  │
│  - Multi-Driver Comparison & Advanced Analytics          │
└────────────────────────────┬────────────────────────────┘
                             │ REST API (JSON)
                             ▼
┌─────────────────────────────────────────────────────────┐
│                    FastAPI Backend                      │
│  - FastF1 Session Manager & In-Memory Cache             │
│  - Telemetry Downsampling Engine                        │
│  - Specialized Analytical Services                      │
└────────────────────────────┬────────────────────────────┘
                             │ PyData / FastF1
                             ▼
┌─────────────────────────────────────────────────────────┐
│                    FastF1 Data Layer                    │
│  - Ergast API / F1 Live Timing API Integration          │
│  - Disk Cache (/data/raw)                               │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Backend Services Architecture

Analytical logic is divided into isolated services under `backend/app/services/`:

- `session_cache.py`: In-memory LRU session cache manager.
- `schedule_service.py`: Dynamic season schedule retriever.
- `track_outline_service.py`: Fast track geometry outline generator.
- `driver_intelligence_service.py`: On-demand driver performance profiler.
- `comparison_service.py`: Multi-driver telemetry overlay aggregator.
- `replay_service.py`: 2D multi-car animated position frame generator.
- `track_intelligence_service.py`: Driver battles & strategy pit event detector.
- `advanced_analytics_service.py`: Position progression & race pace medians analyzer.
- `telemetry_service.py`: Driver fastest lap telemetry service.
- `track_service.py`: Driver speed heatmap service.
- `delta_service.py`: Lap delta comparison service.
- `strategy_service.py`: Stint & compound timeline service.
- `recommendation_service.py`: Real-time pit window recommendation engine.

---

## 3. Data Downsampling & Performance

Telemetry data arrays are processed through `app/utils/downsample.py` to downsample 1000+ raw data points into uniform 350-point arrays, reducing payload sizes by up to 70% while maintaining visual accuracy.
