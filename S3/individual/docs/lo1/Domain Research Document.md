# Domain Research Document

## Document Info

| Field | Detail |
| --- | --- |
| LO | LO1 - Analysing |
| Project | Barbershop No-Show Predictor |
| Method | DOT Framework - Library and Field research |
| Status | Sprint 1 |

---

## 1. Introduction

This document captures the exploratory domain investigation conducted before any modelling decisions were made. The purpose is to understand the barbershop business context deeply enough to justify every feature, the synthetic data design, and the choice of Logistic Regression. All findings feed directly into the EDA, requirements, and model design.

---

## 2. The Barbershop Business Context

A barbershop is an appointment-based small business where customers book time slots (20-45 min) with a specific barber for services such as a haircut, beard trim, or combo.

Key operational characteristics:

- Fixed capacity: each barber has a fixed number of slots per day (9:00-18:00, Mon-Sat)
- Short service duration: a no-show wastes a slot that cannot be filled on short notice
- Low booking commitment: no deposit or penalty for missing unlike medical appointments
- Mixed customer base: loyal regulars (low risk) vs. first-time or app-booked customers (higher risk)

At a 20% no-show rate across 8 slots/day with 4 barbers at 20 EUR per slot, the barbershop loses approximately 128 EUR per day or 2,800 EUR per month.

---

## 3. No-Show Behaviour Patterns

### 3.1 Lead Time

| Lead Time | Expected No-Show Risk |
| --- | --- |
| Same day 0-1 days | Low around 10% |
| 2-6 days | Medium around 15% |
| 7+ days | High around 20-30% |

Longer time between booking and appointment correlates strongly with higher no-show rates. Customers who book 7+ days in advance are more likely to forget or have schedule changes.

### 3.2 Day of Week

| Day | Risk Level |
| --- | --- |
| Monday | High |
| Tuesday to Thursday | Low to Medium |
| Friday | Medium |
| Saturday | Medium |

Monday has the highest no-show rate. Customers often book on Friday for the following week and change plans over the weekend.

### 3.3 Booking Channel

| Channel | No-Show Rate | Reason |
| --- | --- | --- |
| App | Low around 15% | Active booking effort equals higher commitment |
| Phone | Medium around 20% | Moderate friction |
| Walk-in | High around 25-30% | Least friction, easiest to forget |

### 3.4 Returning vs First-Time Customers

Returning customers with established relationships are significantly more reliable. First-time customers have no accountability history and are more likely to no-show.

### 3.5 Reminder Effect

SMS or email reminders sent 24-48h before appointment reduce no-show rates by an estimated 8-15%. This is the most actionable lever available to the barbershop owner.

### 3.6 Previous No-Show History

Customers who have previously no-showed are more likely to do so again. Each prior no-show adds measurable risk to future appointments.

---

## 4. Stakeholder Analysis

### 4.1 Primary Stakeholder - Barbershop Owner

| Aspect | Detail |
| --- | --- |
| Goal | Reduce revenue loss from empty slots |
| Decision | Who to send reminders to; whether to overbook high-risk slots |
| Model output needed | Per-appointment no-show probability |
| Acceptable false alarm | Moderate - a false reminder is low cost |
| Critical failure | Missing a high-risk appointment (false negative) |

### 4.2 Secondary Stakeholder - Barbers

- Want full schedules with minimal idle time
- Loyal customer relationships reduce no-show risk organically
- barber_id is included as a feature to capture barber-specific loyalty effects

### 4.3 Tertiary Stakeholder - Customers

- Not directly using the model but affected by overbooking decisions
- Ethical consideration: the model must not discriminate by demographic proxies

---

## 5. Synthetic Data Justification

| Reason | Explanation |
| --- | --- |
| Privacy | No real customer PII required |
| Control | Known ground-truth distributions allow validation of model learning |
| Reproducibility | Fixed seed ensures identical datasets across runs |
| Scope | 1500 rows is sufficient for Logistic Regression at university scale |

The synthetic data uses feature-driven no-show probabilities. Each appointment's no_show label is drawn from a probability that is a function of its feature values, not random noise. This ensures the model has genuine signal to learn from. See generate_[data.py](http://data.py) for the full implementation.

---

## 6. Feature Justification

| Feature | Domain Justification |
| --- | --- |
| day_of_week | Monday highest no-show rate; mid-week most reliable |
| hour_of_day | Early and late slots riskier than mid-day |
| lead_time_days | Longer lead means higher forgetting and cancellation risk |
| is_returning_customer | Regulars show up; first-timers less accountable |
| booking_channel | App beats phone beats walk-in in commitment level |
| service_type | Combo at 45 min may carry a different no-show profile |
| reminder_sent | Reminders reduce no-show by 8-15% |
| barber_id | Captures barber-specific loyal customer effects |
| previous_no_shows | Past no-show behaviour is the strongest individual predictor |
| total_previous_visits | Provides context for the previous_no_shows ratio |

---

## 7. Model Choice Justification

Logistic Regression is appropriate for this domain because:

- Interpretability: the owner needs to understand why an appointment is flagged as high-risk, not just that it is
- Probabilistic output: outputs a probability such as 73% no-show risk, allowing the owner to set their own threshold
- Sufficient complexity: no-show behaviour is largely linear in log-odds space; a complex model would reduce explainability
- Industry precedent: widely used as a baseline in no-show prediction research for appointment-based businesses

---

## 8. Research Sources (DOT Framework)

| Source | Type | Key Finding |
| --- | --- | --- |
| Dantas et al. (2018) - Predictive modelling of no-shows | Library academic | Lead time and prior no-show history are top predictors |
| Samorani and LaGanga (2015) - Overbooking in medical scheduling | Library academic | Reminder interventions reduce no-show by 8-12% |
| Mohammadi et al. (2020) - No-show prediction in outpatient clinics | Library academic | Day of week and booking channel are significant features |
| Barbershop industry reports | Field desk research | 15-30% no-show rate for low-commitment appointments |

---

## 9. Key Insights

- No-show behaviour in a barbershop is predictable from simple features with no deep learning required
- The top 3 predictors expected are previous_no_shows, lead_time_days, and is_returning_customer
- Reminders are the most actionable lever and model output should directly drive reminder targeting
- All 10 features have clear domain justification and none are included speculatively
- The ~20% no-show rate in synthetic data is realistic and creates a learnable class imbalance