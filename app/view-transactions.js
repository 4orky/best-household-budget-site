// Transactions: the full ledger — filterable by category and text, with a
// working add form, per-row delete, and a real CSV download.

import { escapeHtml, money, shortDate } from './format.js';
import { saveState, state, totalSpent } from './state.js';

let filterCategory = 'all';
let filterText = '';
let lastAddedMessage = '';

export function setTransactionFilters(category, text) {
  filterCategory = category;
  filterText = text.trim().toLowerCase();
}

export function transactions() {
  const rows = [...state.transactions]
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
    .filter((t) => (filterCategory === 'all' || t.category === filterCategory))
    .filter((t) => !filterText || `${t.description} ${t.merchant}`.toLowerCase().includes(filterText));
  const shownTotal = rows.reduce((sum, t) => sum + t.amount, 0);

  return `
  <section class="hero">
    <p class="eyebrow">Ledger · ${state.transactions.length} purchases in November</p>
    <h1>Transactions</h1>
    <p class="lede">Every dollar out, in the order it left. Add a purchase below and every total on the site updates at once — the dashboard, the budgets and the report all read this same list.</p>
  </section>

  <section class="card">
    <form id="filter-form" class="filters" action="#/transactions" method="get">
      <label>Category
        <select id="filter-category" name="category">
          <option value="all">All categories</option>
          ${state.categories.map((c) => `<option value="${c.id}" ${filterCategory === c.id ? 'selected' : ''}>${escapeHtml(c.name)}</option>`).join('')}
        </select>
      </label>
      <label>Search
        <input id="filter-text" name="q" type="search" placeholder="e.g. GreenMart or pizza" value="${escapeHtml(filterText)}">
      </label>
      <button class="btn" type="submit">Filter</button>
      <button class="btn btn-ghost" type="button" id="export-csv">Download CSV</button>
    </form>
    <p class="card-note">Showing ${rows.length} of ${state.transactions.length} transactions · ${money(shownTotal)}${filterCategory !== 'all' || filterText ? ` · <a href="#/transactions" id="clear-filters">clear filters</a>` : ` · total spent ${money(totalSpent())}`}</p>
    <table class="ledger tx-table">
      <thead><tr><th>Date</th><th>What</th><th>Where</th><th>Category</th><th class="num">Amount</th><th></th></tr></thead>
      <tbody>
        ${rows.length ? rows.map((t) => {
          const cat = state.categories.find((c) => c.id === t.category);
          return `<tr data-id="${t.date}|${escapeHtml(t.description)}|${t.amount}">
            <td>${shortDate(t.date)}</td><td>${escapeHtml(t.description)}</td><td>${escapeHtml(t.merchant)}</td>
            <td><span class="tag" style="--tag:${cat ? cat.color : '#666'}">${escapeHtml(cat ? cat.name : t.category)}</span></td>
            <td class="num">${money(t.amount)}</td>
            <td><button class="btn btn-small btn-ghost delete-tx" type="button" data-key="${t.date}|${escapeHtml(t.description)}|${t.amount}">Delete</button></td>
          </tr>`;
        }).join('') : `<tr><td colspan="6" class="empty">Nothing matches those filters. Try clearing them.</td></tr>`}
      </tbody>
    </table>
  </section>

  <section class="card">
    <h2>Add a purchase</h2>
    <form id="add-tx" class="form-grid">
      <label>Date <input name="date" type="date" value="2026-11-25" required></label>
      <label>What <input name="description" type="text" placeholder="e.g. Weekly shop" required maxlength="80"></label>
      <label>Where <input name="merchant" type="text" placeholder="e.g. GreenMart" required maxlength="80"></label>
      <label>Category
        <select name="category">
          ${state.categories.map((c) => `<option value="${c.id}">${escapeHtml(c.name)}</option>`).join('')}
        </select>
      </label>
      <label>Amount ($) <input name="amount" type="number" min="0.01" step="0.01" placeholder="0.00" required></label>
      <span></span>
      <button class="btn" type="submit">Add to the ledger</button>
      <p class="form-note" id="add-tx-note" role="status">${escapeHtml(lastAddedMessage)}</p>
    </form>
  </section>`;
}

// Wire up the ledger's controls after render. Called by main.js.
export function bindTransactions(root) {
  const filterForm = root.querySelector('#filter-form');
  if (filterForm) {
    filterForm.addEventListener('submit', (event) => {
      event.preventDefault();
      setTransactionFilters(root.querySelector('#filter-category').value, root.querySelector('#filter-text').value);
      window.dispatchEvent(new Event('hashchange'));
    });
  }
  const clear = root.querySelector('#clear-filters');
  if (clear) {
    clear.addEventListener('click', (event) => {
      event.preventDefault();
      setTransactionFilters('all', '');
      window.dispatchEvent(new Event('hashchange'));
    });
  }
  const exportBtn = root.querySelector('#export-csv');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const lines = [['Date', 'Description', 'Merchant', 'Category', 'Amount']];
      for (const t of state.transactions) {
        const cat = state.categories.find((c) => c.id === t.category);
        lines.push([t.date, t.description, t.merchant, cat ? cat.name : t.category, t.amount.toFixed(2)]);
      }
      const csv = lines.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
      const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'harper-household-november-2026.csv';
      a.click();
      URL.revokeObjectURL(url);
    });
  }
  const addForm = root.querySelector('#add-tx');
  if (addForm) {
    addForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(addForm);
      const amount = Number(data.get('amount'));
      if (!Number.isFinite(amount) || amount <= 0) return;
      state.transactions.push({
        date: String(data.get('date')),
        description: String(data.get('description')).trim(),
        merchant: String(data.get('merchant')).trim(),
        category: String(data.get('category')),
        amount: Math.round(amount * 100) / 100,
      });
      saveState();
      lastAddedMessage = `Added ${String(data.get('description')).trim()} — ${money(amount)}. Totals updated everywhere.`;
      window.dispatchEvent(new Event('hashchange'));
    });
  }
  root.querySelectorAll('.delete-tx').forEach((btn) => {
    btn.addEventListener('click', () => {
      const [date, description, amount] = btn.dataset.key.split('|');
      const index = state.transactions.findIndex(
        (t) => t.date === date && t.description === description && String(t.amount) === amount,
      );
      if (index !== -1) {
        state.transactions.splice(index, 1);
        saveState();
        window.dispatchEvent(new Event('hashchange'));
      }
    });
  });
}
