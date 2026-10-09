# TickTick project guide

A React/TypeScript task and workspace application with an Express backend. The repository includes calendar and task views, workspace management, chat, authentication, subscription screens, and integrations for real-time updates, email, Google sign-in, AI assistance, and Stripe billing.

## Architecture

| Path | Purpose |
| --- | --- |
| [client/src/App.tsx](client/src/App.tsx) | Client route composition |
| [client/src/routes](client/src/routes) | Task, workspace, calendar, chat, and account screens |
| [client/src/services](client/src/services) | Browser API boundary |
| [server/src/index.ts](server/src/index.ts) | Express/Socket.IO entry point |
| [server/src/config/config.ts](server/src/config/config.ts) | Environment configuration |
| [server/src/templates](server/src/templates) | Email templates |
| [.github/workflows](.github/workflows) | Workflow definitions retained within this subproject |

The frontend uses React/Vite and the backend uses Express, MongoDB, Passport, JWT/session helpers, Socket.IO, and service integrations. The nested .github directory is not the repository-root workflow directory, so its presence alone does not establish active GitHub Actions for the University repository.

## Installation

From the University repository root:

```bash
cd S2/ticktick-app/server
npm install
cp .env.example .env
cd ../client
npm install
cp .env.example .env
```

Copy examples only if local files do not already exist. Unlike the older setup note, this checkout has no ticktick-app root package.json; install each application's dependencies directly.

Set your own database, session/token, encryption, email, and optional-provider values in server/.env. The code reads MONGODB_LOCAL_URL/MONGODB_CLOUD_URL; DEV_URL/DEV_BACKEND_URL and their production counterparts configure app hosts. SMTP/OTP, Google, OpenAI, and Stripe settings are defined in the linked config module. Align frontend environment settings with the selected backend port.

## Run locally

In a server terminal, from S2/ticktick-app/server:

```bash
npm run build
npm run start:templates
npm run dev
```

The dev script combines TypeScript watch compilation and nodemon on build/index.js. Templates need to be available under the compiled build tree for email-dependent flows.

In a separate client terminal, from S2/ticktick-app/client:

```bash
npm run dev
```

Use the URLs printed by each process. Check the API base URL and Socket.IO configuration if hostnames or ports differ.

## Integration review

The server registers a raw-body Stripe webhook at /api/stripe/webhook. Subscription review requires your own Stripe test account, prices, and webhook secret. The older setup note records a limitation with yearly subscriptions; do not assume every billing option is functional.

Google sign-in, SMTP delivery, OpenAI-backed assistance, and Socket.IO behavior each need their own configuration and acceptance check. Basic page rendering does not verify those integrations.

## Verification and known gaps

From client:

```bash
npm run lint
npm run build
```

From server:

```bash
npm run build
```

Review server imports against package.json before expecting a clean installation: the entry point imports libraries such as helmet that are absent from the inspected server manifest. The root Cypress installation described in the older README is not reproducible from a root manifest in this checkout.

No dependency installation, build, browser, billing, or real-time flow was executed during documentation work. Review the client service layer, backend route registration, and workspace/task operations together before describing full end-to-end coverage.
