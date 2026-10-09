# Migraine classification project guide

A full-stack academic prototype that classifies migraine type from structured symptom input using a saved Random Forest model. It connects training/evaluation work to a FastAPI service and a Next.js application.

## Current implementation

The backend imports modules through app.server, so commands must preserve the project-root import context. The current layout is app/server and app/web; older paths in the retained README omit the app directory.

| Path | Purpose |
| --- | --- |
| [app/server/pyproject.toml](app/server/pyproject.toml) | Python 3.12+ dependencies |
| [app/server/main.py](app/server/main.py) | Training entry point |
| [app/server/src/model/random_forest.py](app/server/src/model/random_forest.py) | Random Forest training |
| [app/server/api/main.py](app/server/api/main.py) | FastAPI endpoints |
| [app/server/api/model.py](app/server/api/model.py) | Saved-model inference and feature ordering |
| [app/server/README.md](app/server/README.md) | Recorded evaluation results |
| [app/server/src/notebook](app/server/src/notebook) | Exploration and model experiments |
| [app/web/app/api/migraine/route.ts](app/web/app/api/migraine/route.ts) | Validated Next.js proxy to FastAPI |

## Backend setup and startup

Install Python 3.12+ and uv. From the University repository root:

```bash
cd S3/individual_two
uv sync --project app/server
uv run --project app/server uvicorn app.server.api.main:app --reload --port 8000
```

Run those commands from S3/individual_two, not app/server, because the Python source uses absolute app.server imports.

The model wrapper loads app/server/data/models/random_forest.pkl and constructs input columns in the configured FEATURES order. Only use trusted model artifacts. To deliberately rebuild the model, from S3/individual_two:

```bash
uv run --project app/server python -m app.server.main
```

Training updates saved artifacts. The older installer/Makefile instructions should be checked against the current app-prefixed layout before use; the explicit commands above follow the current pyproject and imports.

## Frontend setup

In another terminal, from the University repository root:

```bash
cd S3/individual_two/app/web
npm install
npm run dev
```

Use a Node.js runtime compatible with the checked-in Next.js dependencies. FASTAPI_BASE_URL configures the server-side proxy and defaults to http://127.0.0.1:8000. If needed, set it in app/web/.env.local before starting. Open the frontend at http://localhost:3000.

The browser submits to the Next.js route, which validates the input/output and calls FastAPI /predict.

## API and verification

| Method | Path | Purpose |
| --- | --- | --- |
| GET | /health | Returns status: ok |
| POST | /predict | Returns the predicted type |

```bash
curl http://127.0.0.1:8000/health
```

Use http://127.0.0.1:8000/docs to inspect the request schema. From app/web:

```bash
npm run lint
npm run build
```

No model training, API request, frontend build, or browser check was executed during this documentation update.

## Evaluation evidence and limits

The existing [evaluation report](app/server/README.md) records a 400-row dataset with 23 features and a 320/80 train/test split. It reports 0.925 holdout accuracy and 0.7698 macro F1, with class imbalance and missed examples in a rare class. These are recorded results from that report, not measurements rerun for this documentation update.

The report also records that the selected grid-search parameters matched the baseline defaults and did not improve holdout results. Preserve this comparison when presenting the project rather than reporting accuracy alone.

This is an educational classification prototype, not a clinically validated diagnostic service. Review dataset limitations, per-class behavior, input validation, and independent evaluation before extending its use.
