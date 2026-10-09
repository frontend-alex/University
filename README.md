# University projects

A collection of software-engineering and applied-ML work from different semesters. Each application has its own runtime, dependencies, and configuration; this repository is not one deployable app.

## Major projects

| Project | Focus | Setup and review guide |
| --- | --- | --- |
| S2 / TickTick | React/Express task and workspace application, real-time collaboration, and billing integrations | [TickTick guide](S2/ticktick-app/PROJECT_GUIDE.md) |
| S3 / Individual | Barbershop appointment no-show prediction with a Python ML pipeline, FastAPI, and Next.js | [No-show guide](S3/individual/PROJECT_GUIDE.md) |
| S3 / Individual Two | Migraine-type classification with Random Forest, FastAPI, and a Next.js form/proxy | [Migraine guide](S3/individual_two/PROJECT_GUIDE.md) |
| S3 / Group / Scoped | Dashboard-image analysis group project | [Standalone Scoped repository](https://github.com/frontend-alex/Scoped) |

## Clone and choose a project

```bash
git clone https://github.com/frontend-alex/University.git
cd University
```

Choose one guide above and run its commands from the stated directory. There is no root package manifest or common install/start command.

Scoped is recorded as a Git submodule. The checked-in .gitmodules URL uses SSH; initializing it requires GitHub SSH access, or you can clone the public Scoped repository separately over HTTPS and use that repository's README.

## Additional lab material

[S3/lab/titanic_survival_rater](S3/lab/titanic_survival_rater) contains processed data, a saved decision-tree artifact, and Python bytecode caches. The inspected tree does not include the corresponding runnable .py source files or a dependency manifest. Treat it as retained lab artifacts rather than a reproducible training application.

## How to review the work

Start with an application's entry point and API/client boundary, then inspect its models, contracts, and verification commands. ML evaluation documents describe particular datasets and splits, not universal performance guarantees. The guides link existing evaluation evidence without replacing it.

Setup commands and linked paths were checked against the repository structure and manifests for this documentation update. Runtime builds, model training, external services, and end-to-end flows were not executed.
