// Savings goals: each goal shows its target, what is saved, and how far
// there is to go. The quick-add buttons really move money into the goal.

import { escapeHtml, money, money0, pct } from './format.js';
import { saveState, state } from './state.js';

let lastGoalMessage = '';

export function goals() {
  const totalSaved = state.goals.reduce((sum, g) => sum + g.saved, 0);
  const totalTarget = state.goals.reduce((sum, g) => sum + g.target, 0);
  return `
  <section class="hero">
    <p class="eyebrow">Saving · ${money0(totalSaved)} of ${money0(totalTarget)} across ${state.goals.length} goals</p>
    <h1>Savings goals</h1>
    <p class="lede">Money with a name on it gets saved; money without one gets spent. Each goal below is a real pot the Harpers are filling — press a button to move money in and watch the bar move.</p>
  </section>

  <p class="card-note" id="goal-note" role="status">${escapeHtml(lastGoalMessage)}</p>

  <div class="grid-two">
    ${state.goals.map((g) => {
      const share = pct(g.saved, g.target);
      const done = g.saved >= g.target;
      return `<article class="card goal-card ${done ? 'goal-done' : ''}">
        <h2>${escapeHtml(g.name)}</h2>
        <p>${escapeHtml(g.note)}</p>
        <p class="goal-numbers"><strong>${money(g.saved)}</strong> of ${money0(g.target)} <span class="goal-pct">${share}%</span></p>
        <div class="big-bar"><span class="big-bar-fill ${done ? 'done' : ''}" style="width:${Math.min(100, share)}%"></span></div>
        <p class="card-note">${done ? 'Reached — well done. Start a new goal below or keep topping it up.' : `${money(g.target - g.saved)} to go.`}</p>
        <div class="goal-actions">
          <button class="btn btn-small add-goal" type="button" data-goal="${g.id}" data-amount="25">+ $25</button>
          <button class="btn btn-small add-goal" type="button" data-goal="${g.id}" data-amount="50">+ $50</button>
          <button class="btn btn-small add-goal" type="button" data-goal="${g.id}" data-amount="100">+ $100</button>
        </div>
      </article>`;
    }).join('')}
  </div>

  <section class="card">
    <h2>Start a new goal</h2>
    <form id="add-goal" class="form-grid">
      <label>Goal name <input name="name" type="text" placeholder="e.g. Christmas presents" required maxlength="60"></label>
      <label>Target ($) <input name="target" type="number" min="1" step="1" placeholder="500" required></label>
      <label>Saved so far ($) <input name="saved" type="number" min="0" step="1" placeholder="0"></label>
      <label>Why it matters <input name="note" type="text" placeholder="e.g. No credit-card Christmas this year" maxlength="120"></label>
      <button class="btn" type="submit">Add goal</button>
      <p class="form-note" id="add-goal-note" role="status"></p>
    </form>
  </section>`;
}

export function bindGoals(root) {
  root.querySelectorAll('.add-goal').forEach((btn) => {
    btn.addEventListener('click', () => {
      const goal = state.goals.find((g) => g.id === btn.dataset.goal);
      if (!goal) return;
      goal.saved += Number(btn.dataset.amount);
      saveState();
      lastGoalMessage = `Added ${money(Number(btn.dataset.amount))} to ${goal.name} — now ${money(goal.saved)} of ${money0(goal.target)}.`;
      window.dispatchEvent(new Event('hashchange'));
    });
  });
  const form = root.querySelector('#add-goal');
  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const target = Number(data.get('target'));
      if (!Number.isFinite(target) || target <= 0) return;
      const saved = Math.max(0, Number(data.get('saved')) || 0);
      state.goals.push({
        id: `goal-${Date.now()}`,
        name: String(data.get('name')).trim(),
        note: String(data.get('note')).trim() || 'A new goal — write down why it matters.',
        target: Math.round(target),
        saved: Math.min(Math.round(saved), Math.round(target)),
      });
      saveState();
      lastGoalMessage = `Goal added: ${String(data.get('name')).trim()} — target ${money0(target)}.`;
      window.dispatchEvent(new Event('hashchange'));
    });
  }
}
