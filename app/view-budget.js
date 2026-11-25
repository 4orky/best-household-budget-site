// Budget: one row per category — what was planned, what was spent, what
// is left. Budgets are editable in place; saving one updates every page.

import { escapeHtml, money, money0, pct } from './format.js';
import { leftToBudget, saveState, spentByCategory, state, totalBudgeted, totalSpent } from './state.js';

let lastBudgetMessage = 'Budgets save when you change a number — no save button needed. The dining-out budget is the one to watch: five days left and it is already $11.40 over.';

export function budget() {
  const spent = totalSpent();
  const planned = totalBudgeted();
  const rows = state.categories.map((c) => {
    const s = spentByCategory(c.id);
    const share = Math.min(100, pct(s, c.budget));
    const over = s > c.budget;
    const left = c.budget - s;
    return `<tr>
      <td><span class="dot" style="background:${c.color}"></span> ${escapeHtml(c.name)}</td>
      <td class="num"><input class="budget-input" type="number" min="0" step="1" value="${c.budget}" data-category="${c.id}" aria-label="Monthly budget for ${escapeHtml(c.name)}"></td>
      <td class="num">${money(s)}</td>
      <td><span class="budget-bar"><span class="${over ? 'budget-fill over' : 'budget-fill'}" style="width:${share}%"></span></span></td>
      <td class="num ${over ? 'over' : ''}">${over ? '−' + money(-left).slice(1) + ' over' : money(left) + ' left'}</td>
    </tr>`;
  });
  const overCount = state.categories.filter((c) => spentByCategory(c.id) > c.budget).length;

  return `
  <section class="hero">
    <p class="eyebrow">Plan · ${state.household.month}</p>
    <h1>The November budget</h1>
    <p class="lede">Planned ${money0(planned)} across ${state.categories.length} categories. Spent ${money(spent)} so far, leaving ${money(planned - spent)}. ${overCount === 1 ? 'One category is over its line — dining out, by $11.40.' : `${overCount} categories are over their lines.`} Change any budget below and the site recalculates at once.</p>
  </section>

  <section class="card">
    <table class="ledger budget-table">
      <thead><tr><th>Category</th><th class="num">Budget / mo</th><th class="num">Spent</th><th>Progress</th><th class="num">Left</th></tr></thead>
      <tbody>${rows.join('')}</tbody>
      <tfoot><tr><td>Total</td><td class="num">${money0(planned)}</td><td class="num">${money(spent)}</td><td></td><td class="num">${money(planned - spent)} left</td></tr></tfoot>
    </table>
    <p class="card-note" id="budget-note" role="status">${escapeHtml(lastBudgetMessage)}</p>
  </section>

  <section class="card">
    <h2>How the plan is built</h2>
    <p>The Harpers budget every dollar before the month starts: ${money0(planned)} to categories, ${money0(state.savingsPlan.monthlyTarget)} straight to savings, and ${money(leftToBudget())} left unassigned on purpose — the cushion for whatever November throws at them. Housing is the biggest line at ${money0(1850)}; subscriptions are the smallest at ${money0(86)}.</p>
    <p>Rule of thumb on this page: a category at 80% with a week left is fine; a category over 100% before the month ends means moving money from another line, not pretending it did not happen. <a href="#/planner">The paycheck planner</a> shows the same split as percentages of take-home pay.</p>
  </section>`;
}

export function bindBudget(root) {
  root.querySelectorAll('.budget-input').forEach((input) => {
    input.addEventListener('change', () => {
      const category = state.categories.find((c) => c.id === input.dataset.category);
      const value = Number(input.value);
      if (!category || !Number.isFinite(value) || value < 0) return;
      category.budget = Math.round(value);
      saveState();
      lastBudgetMessage = `${category.name} budget set to ${money(category.budget)}. Totals updated everywhere.`;
      window.dispatchEvent(new Event('hashchange'));
    });
  });
}
