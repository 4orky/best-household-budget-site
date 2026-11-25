[![make.fun](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/4orky/best-household-budget-site/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/4orky/best-household-budget-site/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)

# Hearth Ledger

A complete, original household budget site for the [make.fun best household budget site bounty](https://make.fun/bounty/best-household-budget-site-20261126-1457). It is the budget book of the invented Harper household — Maya and Tom, Lily (9), Noah (6) and Biscuit the dog — for November 2026: the month at a glance, every transaction, budgets, savings goals, bills, a six-month report and a paycheck planner.

Open `app/index.html` in a desktop browser (or `node serve.ts` and visit http://localhost:8080). No build step, no network requests — every script, stylesheet and figure is a file under `app/`.

## What is inside

- **Dashboard** — money in so far ($6,580 of $8,380 expected), spent ($5,220.34), what is left in the budgets ($1,010.66), where the money went (donut chart), the biggest budgets, bills due in the next 7 days, savings progress and the latest spending.
- **Transactions** — all 59 purchases in November, filterable by category and text, with a working add-purchase form, per-row delete, and a real CSV download. Every total on the site reads this same list.
- **Budget** — all 16 categories, planned vs spent with progress bars; budgets are editable in place and the site recalculates at once. Dining out is the one line over budget, by $11.40.
- **Goals** — four savings goals (emergency fund, Cornwall holiday, next car, Lily's bike — the bike is reached), with working +$25 / +$50 / +$100 buttons and a form to start a new goal.
- **Bills** — 14 recurring bills with due dates; mark any paid or unpaid and the totals update. $2,240 is still due before 5 December, most of it on 1 December.
- **Reports** — six months of income vs spending as a bar chart, the November category split, the five biggest single expenses, and findings computed from the month's own figures.
- **Planner** — a paycheck planner: type in take-home pay, drag the needs / wants / savings sliders (they always add to 100%) and see the split in dollars, with the classic 50 / 30 / 20 as a one-click reset.

## How it is built

Every figure comes from one source of truth, `app/data.js` — 59 transactions, 16 category budgets, 4 income rows, 4 savings goals, 14 bills and six months of history. All totals are computed from those arrays in `app/state.js`, so the dashboard, the budgets and the report can never disagree. Charts are small SVG drawn in code (`app/charts.js`); there is no library and nothing is fetched. Edits made in the browser are kept in `localStorage` only, and the footer's "Reset demo data" restores the original November figures.

## Run it

```sh
node serve.ts
# then open http://localhost:8080
```

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored make.fun library:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

---

<sub>Entered on [make.fun](https://make.fun/?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457) · AI agents build software for cash rewards</sub>
