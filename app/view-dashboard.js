// Dashboard: the month at a glance — money in, money out, what is left,
// where it went, what is due next, and the savings goals.

import { donutChart } from './charts.js';
import { escapeHtml, money, money0, pct, shortDate } from './format.js';
import { billsDueSoon, budgetLeft, incomePlanned, incomeReceived, leftToBudget, overBudgetCategories, spentByCategory, state, totalSpent } from './state.js';

function budgetBar(category) {
  const spent = spentByCategory(category.id);
  const share = Math.min(100, pct(spent, category.budget));
  const over = spent > category.budget;
  return `<li class="budget-row">
    <span class="budget-name">${escapeHtml(category.name)}</span>
    <span class="budget-bar"><span class="${over ? 'budget-fill over' : 'budget-fill'}" style="width:${share}%"></span></span>
    <span class="budget-numbers">${money(spent)} of ${money0(category.budget)}</span>
    <span class="budget-left ${over ? 'over' : ''}">${over ? money(spent - category.budget) + ' over' : money(category.budget - spent) + ' left'}</span>
  </li>`;
}

export function dashboard() {
  const spent = totalSpent();
  const received = incomeReceived();
  const planned = incomePlanned();
  const left = budgetLeft();
  const unbudgeted = leftToBudget();
  const due = billsDueSoon();
  const dueTotal = due.reduce((sum, b) => sum + b.amount, 0);
  const slices = state.categories
    .map((c) => ({ label: c.name, value: spentByCategory(c.id), color: c.color }))
    .filter((s) => s.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);
  const topCategories = [...state.categories]
    .map((c) => ({ ...c, spent: spentByCategory(c.id) }))
    .sort((a, b) => b.spent - a.spent)
    .slice(0, 5);
  const recent = [...state.transactions].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 6);
  const savings = state.savingsPlan;
  const savingsPct = pct(savings.savedSoFar, savings.monthlyTarget);
  const over = overBudgetCategories();

  return `
  <section class="hero">
    <p class="eyebrow">${escapeHtml(state.household.month)} · as of ${escapeHtml(state.household.todayLabel)}</p>
    <h1>Good evening, Harpers.</h1>
    <p class="lede">November is 25 days in. You have spent ${money(spent)} of ${money0(planned)} coming in, and ${money(left)} is still sitting in the month's budgets. Five days to go — ${over.length === 0 ? 'and every category is still inside its budget.' : over.length === 1 ? `and ${over[0].name.toLowerCase()} is the only budget over its line, by ${money(over[0].spent - over[0].budget)}.` : `and ${over.length} budgets are over their lines.`}</p>
  </section>

  <section class="cards" aria-label="Month summary">
    <article class="card stat"><p class="stat-label">Money in so far</p><p class="stat-value">${money(received)}</p><p class="stat-note">of ${money0(planned)} expected · Tom's payday lands 28 Nov</p></article>
    <article class="card stat"><p class="stat-label">Spent so far</p><p class="stat-value">${money(spent)}</p><p class="stat-note">${state.transactions.length} purchases logged</p></article>
    <article class="card stat"><p class="stat-label">Left in the budgets</p><p class="stat-value">${money(left)}</p><p class="stat-note">across ${state.categories.length} categories</p></article>
    <article class="card stat"><p class="stat-label">Left to budget</p><p class="stat-value">${money(unbudgeted)}</p><p class="stat-note">every dollar needs a job — <a href="#/planner">give it one</a></p></article>
  </section>

  <div class="grid-two">
    <section class="card">
      <h2>Where the money went</h2>
      ${donutChart(slices, spent, 'spent in Nov')}
      <p class="card-foot"><a href="#/reports">See the full six-month report →</a></p>
    </section>

    <section class="card">
      <h2>Biggest budgets</h2>
      <ul class="budget-list">${topCategories.map(budgetBar).join('')}</ul>
      <p class="card-foot"><a href="#/budget">All ${state.categories.length} budgets →</a></p>
    </section>
  </div>

  <div class="grid-two">
    <section class="card">
      <h2>Due in the next 7 days · ${money(dueTotal)}</h2>
      <ul class="bill-list">
        ${due.map((b) => `<li><span class="bill-name">${escapeHtml(b.name)}</span><span class="bill-due">due ${shortDate(b.due)}</span><span class="bill-amount">${money(b.amount)}</span></li>`).join('')}
      </ul>
      <p class="card-foot"><a href="#/bills">All bills, paid and upcoming →</a></p>
    </section>

    <section class="card">
      <h2>Saving for November · ${money(savings.savedSoFar)} of ${money0(savings.monthlyTarget)}</h2>
      <div class="big-bar"><span class="big-bar-fill" style="width:${savingsPct}%"></span></div>
      <p class="card-note">${savingsPct}% of the month's savings target is already moved aside. ${money(savings.monthlyTarget - savings.savedSoFar)} to go by the 30th.</p>
      <ul class="goal-mini">
        ${state.goals.map((g) => `<li><span>${escapeHtml(g.name)}</span><span class="goal-mini-bar"><span style="width:${pct(g.saved, g.target)}%"></span></span><span>${money0(g.saved)} / ${money0(g.target)}</span></li>`).join('')}
      </ul>
      <p class="card-foot"><a href="#/goals">Savings goals →</a></p>
    </section>
  </div>

  <section class="card">
    <h2>Latest spending</h2>
    <table class="ledger">
      <thead><tr><th>Date</th><th>What</th><th>Where</th><th>Category</th><th class="num">Amount</th></tr></thead>
      <tbody>
        ${recent.map((t) => {
          const cat = state.categories.find((c) => c.id === t.category);
          return `<tr><td>${shortDate(t.date)}</td><td>${escapeHtml(t.description)}</td><td>${escapeHtml(t.merchant)}</td><td><span class="tag" style="--tag:${cat ? cat.color : '#666'}">${escapeHtml(cat ? cat.name : t.category)}</span></td><td class="num">${money(t.amount)}</td></tr>`;
        }).join('')}
      </tbody>
    </table>
    <p class="card-foot"><a href="#/transactions">All ${state.transactions.length} transactions →</a></p>
  </section>`;
}
