// Bills: every recurring payment, when it is due, and whether it is paid.
// Marking a bill paid really flips it, and the totals update.

import { escapeHtml, longDate, money, shortDate } from './format.js';
import { billsPaidTotal, saveState, state } from './state.js';

let lastBillMessage = '';

function billRow(b) {
  const cat = state.categories.find((c) => c.id === b.category);
  return `<tr class="${b.paid ? 'bill-paid' : ''}">
    <td>${escapeHtml(b.name)}${b.autopay ? ' <span class="tag">autopay</span>' : ''}</td>
    <td>${escapeHtml(cat ? cat.name : b.category)}</td>
    <td>${longDate(b.due)}</td>
    <td class="num">${money(b.amount)}</td>
    <td><span class="bill-status ${b.paid ? 'paid' : 'due'}">${b.paid ? 'Paid' : 'Due ' + shortDate(b.due)}</span></td>
    <td><button class="btn btn-small ${b.paid ? 'btn-ghost' : ''} toggle-bill" type="button" data-bill="${b.id}">${b.paid ? 'Mark unpaid' : 'Mark paid'}</button></td>
  </tr>`;
}

export function bills() {
  const upcoming = state.bills.filter((b) => !b.paid).sort((a, b) => (a.due < b.due ? -1 : 1));
  const paid = state.bills.filter((b) => b.paid).sort((a, b) => (a.due < b.due ? -1 : 1));
  const upcomingTotal = upcoming.reduce((sum, b) => sum + b.amount, 0);
  const paidTotal = billsPaidTotal();

  return `
  <section class="hero">
    <p class="eyebrow">Bills · ${upcoming.length} still to pay · ${money(upcomingTotal)} due</p>
    <h1>Bills &amp; due dates</h1>
    <p class="lede">Nothing here is a surprise: every recurring payment, its due date, and whether it has gone out. ${money(paidTotal)} has been paid this month; ${money(upcomingTotal)} is still to come, most of it on 1 December.</p>
  </section>

  <p class="card-note" id="bill-note" role="status">${escapeHtml(lastBillMessage)}</p>

  <section class="card">
    <h2>Still to pay · ${money(upcomingTotal)}</h2>
    ${upcoming.length ? `<table class="ledger bills-table">
      <thead><tr><th>Bill</th><th>Category</th><th>Due</th><th class="num">Amount</th><th>Status</th><th></th></tr></thead>
      <tbody>${upcoming.map(billRow).join('')}</tbody>
    </table>` : '<p class="empty">Everything is paid. Enjoy the quiet.</p>'}
  </section>

  <section class="card">
    <h2>Paid this month · ${money(paidTotal)}</h2>
    <table class="ledger bills-table">
      <thead><tr><th>Bill</th><th>Category</th><th>Due</th><th class="num">Amount</th><th>Status</th><th></th></tr></thead>
      <tbody>${paid.map(billRow).join('')}</tbody>
    </table>
  </section>

  <section class="card">
    <h2>Add a bill</h2>
    <form id="add-bill" class="form-grid">
      <label>Bill name <input name="name" type="text" placeholder="e.g. Water bill" required maxlength="60"></label>
      <label>Amount ($) <input name="amount" type="number" min="0.01" step="0.01" placeholder="0.00" required></label>
      <label>Due date <input name="due" type="date" value="2026-12-01" required></label>
      <label>Category
        <select name="category">
          ${state.categories.map((c) => `<option value="${c.id}">${escapeHtml(c.name)}</option>`).join('')}
        </select>
      </label>
      <label class="check"><input name="autopay" type="checkbox"> Paid automatically each month</label>
      <span></span>
      <button class="btn" type="submit">Add bill</button>
      <p class="form-note" id="add-bill-note" role="status"></p>
    </form>
  </section>`;
}

export function bindBills(root) {
  root.querySelectorAll('.toggle-bill').forEach((btn) => {
    btn.addEventListener('click', () => {
      const bill = state.bills.find((b) => b.id === btn.dataset.bill);
      if (!bill) return;
      bill.paid = !bill.paid;
      saveState();
      lastBillMessage = bill.paid
        ? `${bill.name} (${money(bill.amount)}) marked paid.`
        : `${bill.name} (${money(bill.amount)}) marked unpaid — it is back on the to-pay list.`;
      window.dispatchEvent(new Event('hashchange'));
    });
  });
  const form = root.querySelector('#add-bill');
  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const amount = Number(data.get('amount'));
      if (!Number.isFinite(amount) || amount <= 0) return;
      state.bills.push({
        id: `bill-${Date.now()}`,
        name: String(data.get('name')).trim(),
        amount: Math.round(amount * 100) / 100,
        due: String(data.get('due')),
        category: String(data.get('category')),
        paid: false,
        autopay: data.get('autopay') === 'on',
      });
      saveState();
      lastBillMessage = `Bill added: ${String(data.get('name')).trim()} — ${money(amount)}, due ${String(data.get('due'))}.`;
      window.dispatchEvent(new Event('hashchange'));
    });
  }
}
