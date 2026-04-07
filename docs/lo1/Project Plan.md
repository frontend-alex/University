# Project Plan

## Project Overview

| Field | Detail |
| --- | --- |
| **Project Title** | Barbershop No-Show Predictor |
| **Semester** | S3 — Machine Learning & AI |
| **Deadline** | Week 9 (Practice Challenge) |
| **Methodology** | Agile — iterative ML loop |
| **Model** | Logistic Regression (binary classification) |
| **Data** | Synthetic barbershop appointment data (1500 rows) |
| **Target** | `no_show` → 1 (no-show) or 0 (showed up) |

## The ML Loop (Repeated Each Sprint)

Data → EDA → Preprocess → Train → Evaluate → Iterate & Improve

Each sprint completes at least one full pass through this loop. Deliverables are produced **as outputs of the loop**, not as prerequisites to it.

---

## Problem Statement

A barbershop loses revenue every time a customer books a slot and fails to show up without cancelling. No-show rates in low-commitment appointment businesses are estimated at **15–30%**. The goal is a binary classification model that outputs per-appointment no-show probabilities and itsgiving the owner a data-driven view of scheduling risk.

**Sources (with links)**

- 21.16% for barbershops:
    
    [**Professional Beauty – No‑shows cost beauty businesses £2.6m this summer**](https://professionalbeauty.co.uk/beauty-pros-lost-26m-to-no-shows-this-summer)
    
- 15% for hair salon / barber industry average:
    
    [**Etisia – Appointment No‑Show Statistics 2026**](https://www.etisia.com/ca/no-show-statistics)
    
- 20–30% range for salons/barber‑style businesses:
    
    [**Attenda – Reduce No‑Shows in Your Salon or Barbershop**](https://attenda.app/blog/reduce-no-shows-salon)
    
    [**Dingg – No‑Show Rate for Salons**](https://dingg.ai/glossary/no-show-rate)
    

---

## Scope & Boundaries

- **In scope:** One business type (barbershop), one model (Logistic Regression), one binary outcome (`no_show`)
- **Out of scope:** Real customer data, multi-location businesses, deep learning, deployment/API
- **Data source:** Fully synthetic dataset generated via `generate_data.py`, designed to reflect realistic barbershop booking patterns

---

## Input Features

| Feature | Type | Description |
| --- | --- | --- |
| `day_of_week` | Categorical | Monday–Sunday (Mondays = highest risk) |
| `hour_of_day` | Numerical | Slot time 9–18 (early/late = higher risk) |
| `lead_time_days` | Numerical | Days between booking and appointment |
| `is_returning_customer` | Binary | 1 = returning, 0 = first-time |
| `booking_channel` | Categorical | app / phone / walk-in |
| `service_type` | Categorical | haircut / beard_trim / combo |
| `reminder_sent` | Binary | 1 = sent, 0 = not sent |
| `barber_id` | Categorical | B01–B04 |
| `previous_no_shows` | Numerical | Count of past no-shows for this customer |
| `total_previous_visits` | Numerical | Total historical visits |

---

## Agile Sprint Plan

Each sprint is **one full iteration of the ML loop**.

### Sprint 1 — Bootstrap

First pass: get data, run a naive model, establish baseline

- [x]  Project Plan (this document)
- [x]  GitHub repo + folder structure
- [x]  Domain Research Document
- [x]  `generate_data.py` — synthetic data generation
- [ ]  Basic EDA (distributions, class balance)
- [ ]  First Logistic Regression run (no tuning, baseline metrics only)

### Sprint 2 — Analyse & Improve

Full EDA + requirements + first real model iteration

- [ ]  Data Exploration Report (full EDA notebook)
- [ ]  Functional & Non-Functional Requirements
- [ ]  Use Cases / Stakeholder Objectives
- [ ]  Preprocessing Design Document
- [ ]  Data Preprocessing Notebook (encoding, scaling, split)
- [ ]  Iteration Log — entry 1 (what changed vs baseline, why)

### Sprint 3 — Design & Iterate

Pipeline documented, second modelling iteration

- [ ]  ML Pipeline Design Document
- [ ]  Data Schema / Dataset Design Document
- [ ]  Model Selection & Analytical Approach Document
- [ ]  Model Training Notebook (cross-validation, hyperparameter tuning)
- [ ]  Model Evaluation Report (Accuracy, Precision, Recall, F1, ROC-AUC)
- [ ]  Iteration Log — entry 2
- [ ]  Model Architecture Diagram / Flowchart

### Sprint 4 — Advise & Validate

Stakeholder-facing outputs, explainability, acceptance testing

- [ ]  Feature Importance Report (coefficients / SHAP)
- [ ]  Stakeholder Advisory Document
- [ ]  Ethical Considerations / Sustainable AI Section
- [ ]  Acceptance Tests
- [ ]  Unit Tests
- [ ]  End User Test Plan
- [ ]  Iteration Log — entry 3 (final model decision)

### Sprint 5 — Manage & Close

Documentation, reproducibility, reflection

- [ ]  Explainability Report
- [ ]  Reproducibility Guide
- [ ]  Code Documentation (README + docstrings)
- [ ]  GitHub Professional Standard Commits Document
- [ ]  Technical Analysis / Literature Research (DOT framework)
- [ ]  Data Generation Research Note (DOT)
- [ ]  FeedPulse Records (all sprints)
- [ ]  Reflection Document

---

## Evaluation Metrics

| Metric | Purpose |
| --- | --- |
| Accuracy | Overall correctness |
| Precision | Of predicted no-shows, how many were real |
| Recall | Of actual no-shows, how many were caught |
| F1-score | Balance between precision and recall |
| ROC-AUC | Overall discriminative power of the model |

**Priority metric:** Recall — a missed no-show (false negative) costs the barbershop a wasted slot; a false alarm is just an unnecessary reminder.

---

## Tech Stack

| Tool | Purpose |
| --- | --- |
| Python 3.12 | Primary language |
| `numpy` / `pandas` | Data generation and manipulation |
| `scikit-learn` | Logistic Regression, preprocessing, evaluation |
| `matplotlib` / `seaborn` | EDA and evaluation visualisations |
| Jupyter Notebooks | EDA, preprocessing, training notebooks |
| `uv` | Dependency management (`pyproject.toml`) |
| GitHub | Version control + project board |

---

## Risks & Mitigations

| Risk | Likelihood | Mitigation |
| --- | --- | --- |
| Synthetic data doesn't reflect real patterns | Medium | Feature-driven probability function with realistic distributions |
| Class imbalance (~20% no-show) | Low | Monitor Recall/F1; consider threshold tuning in later iterations |
| Overfitting on small dataset | Low | Cross-validation + L2 regularisation in Logistic Regression |
| Scope creep into deep learning | Low | Strict scope boundary — Logistic Regression only |
| Iteration loop doesn't converge | Low | Cap at 3 logged iterations; document reasoning for stopping |