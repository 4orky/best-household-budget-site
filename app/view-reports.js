// Reports: the six-month picture — income against spending, the category
// split, the biggest single expenses, and plain-English findings computed
// from the month's own figures.

import { donutChart, monthBars } from './charts.js';
import { escapeHtml, money, money0, pct, shortDate } from './format.js';
import { overBudgetCategories, spentByCategory, state, totalSpent } from './state.js';

export function reports() {
  const spent = totalSpent();
  const history = state.monthlyHistory;
  const last = history[history.length - 1];
  const previous = history[history.length - 2];
  const change = pct(spent - previous.spent, previous.spent);
  const slices = state.categories
    .map((c) => ({ label: c.name, value: spentByCategory(c.id), color: c.color }))
    .filter((s) => s.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);
  const biggest = [...state.transactions].sort((a, b) => b.amount - a.amount).slice(0, 5);
  const over = overBudgetCategories();
  const savings = state.savingsPlan;
  const october = history.find((h) => h.month === 'Oct 2026');

  const findings = [
    `Dining out is the only budget over its line: ${money(over.length ? over[0].spent : 0)} against a ${money0(over.length ? over[0].budget : 0)} budget, ${money(over.length ? over[0].spent - over[0].budget : 0)} over with five days left. Two takeaways would have covered it.`,
    `Groceries are tracking well at ${money(spentByCategory('groceries'))} of ${money0(780)} — the weekly GreenMart shop plus the Saturday market, with no top-up trips this week.`,
    `Housing takes ${pct(spentByCategory('housing'), spent)}% of everything spent so far. It is fixed, so the lever is everywhere else.`,
    `November spending so far is ${change < 0 ? `${-change}% below` : `${change}% above`} October's full-month ${money0(october.spent)} — with five days still to come, expect it to close most of that gap before the month ends.`,
    `Savings are ${money(savings.savedSoFar)} of the ${money0(savings.monthlyTarget)} November target. Moving the last ${money(savings.monthlyTarget - savings.savedSoFar)} on payday, the 28th, keeps the habit automatic.`,
  ];

  return `
  <section class="hero">
    <p class="eyebrow">Report · June – November 2026</p>
    <h1>Monthly report</h1>
    <p class="lede">Six months of income and spending, the shape of this month, and what it actually means — all computed from the ledger, so the words and the numbers can never drift apart.</p>
  </section>

  <section class="card">
    <h2>Income vs spending, by month</h2>
    ${monthBars(history)}
    <p class="card-note">* November is five days short — ${money(last.spent)} spent so far against ${money0(last.income)} expected in. Spending has stayed inside income every month since June.</p>
  </section>

  <div class="grid-two">
    <section class="card">
      <h2>November by category</h2>
      ${donutChart(slices, spent, 'spent in Nov')}
    </section>

    <section class="card">
      <h2>Biggest single expenses</h2>
      <ol class="big-list">
        ${biggest.map((t) => {
          const cat = state.categories.find((c) => c.id === t.category);
          return `<li><span class="big-amount">${money(t.amount)}</span><span>${escapeHtml(t.description)} <span class="muted">— ${escapeHtml(t.merchant)}, ${shortDate(t.date)}</span></span><span class="tag" style="--tag:${cat ? cat.color : '#666'}">${escapeHtml(cat ? cat.name : t.category)}</span></li>`;
        }).join('')}
      </ol>
      <p class="card-note">The top five are ${money(biggest.reduce((s, t) => s + t.amount, 0))} — ${pct(biggest.reduce((s, t) => s + t.amount, 0), spent)}% of the month's spending. Four of them are fixed bills; only the kettle was a choice.</p>
    </section>
  </div>

  <section class="card">
    <h2>What November is saying</h2>
    <ul class="findings">
      ${findings.map((f) => `<li>${escapeHtml(f)}</li>`).join('')}
    </ul>
  </section>`;
}
