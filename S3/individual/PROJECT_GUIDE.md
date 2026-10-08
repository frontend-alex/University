# Appointment no-show project guide

A barbershop appointment no-show prototype that combines synthetic-data generation, tabular ML training, a FastAPI inference layer, and a Next.js review interface.

## Implemented flow

1. The Python entry point generates synthetic appointment data, preprocesses it, trains the configured XGBoost model, and saves artifacts.
2. FastAPI exposes health, prediction, and user-card endpoints.
3. The Next.js client fetches booking/user information and displays prediction-oriented cards.

The synthetic-data pipeline is useful for demonstrating integration. It does not establish performance on real customer appointments.

## Repository map

| Path | Purpose |
| --- | --- |
| [app/python/pyproject.toml](app/python/pyproject.toml) | Python 3.12+ dependencies |
| [app/python/main.py](app/python/main.py) | Generation/preprocessing/training entry point |
| [app/python/src/config/config.py](app/python/src/config/config.py) | Data paths, features, and training parameters |
| [app/python/src/api/app.py](app/python/src/api/app.py) | FastAPI application |
| [app/python/README.md](app/python/README.md) | Existing Python project notes |
| [app/client/app/page.tsx](app/client/app/page.tsx) | Next.js application page |
| [app/client/lib/api.ts](app/client/lib/api.ts) | Client-to-backend boundary |

## Backend setup

Install Python 3.12 or newer and uv. From the University repository root:

```bash
cd S3/individual/app/python
uv sync
uv run python main.py
uv run uvicorn src.api.app:app --reload --port 8000
```

Training generates/replaces local data and model artifacts; run it deliberately rather than as a harmless health check. The inference layer needs the expected saved model. A missing model produces an API failure rather than automatically training one.

## Frontend setup

Use a Node.js runtime compatible with the checked-in Next.js dependencies. In another terminal, from the University repository root:

```bash
cd S3/individual/app/client
npm install
npm run dev
```

The API helper reads NEXT_PUBLIC_API_BASE_URL and defaults to http://127.0.0.1:8000. Set it in app/client/.env.local when using a different backend host. The frontend normally serves on http://localhost:3000.

## API boundary

| Method | Path | Purpose |
| --- | --- | --- |
| GET | /health | Liveness |
| POST | /predict | No-show inference and contribution information |
| GET | /users | Synthetic booking/user cards |
| GET | /users/{id} | One card |

Use http://127.0.0.1:8000/docs to inspect the current input/output schema instead of assuming a payload from a screenshot.

## Verification

Backend smoke checks after deliberate setup:

```bash
curl http://127.0.0.1:8000/health
curl http://127.0.0.1:8000/users
```

From app/client:

```bash
npm run typecheck
npm run lint
npm run build
```

These commands were checked against the source and manifest, but model training, API calls, and frontend checks were not executed for this documentation update.

## Limitations and review priorities

- The current main pipeline calls XGBoost; alternate model configuration or notebooks do not change that entry point automatically.
- Generated data and synthetic user cards are demonstration inputs, not a live scheduling integration.
- Preserve feature order and preprocessing compatibility between training and inference.
- Inspect contributions as model explanations tied to this implementation, not as proven causal effects.
- A useful next validation step is a reproducible holdout evaluation and schema/API tests before connecting real booking data.
