// Household state: the demo data from data.js, plus whatever the household
// changes in the browser. Edits are kept in localStorage so a page reload
// keeps them; with storage unavailable the site still works in memory.
// "Reset demo data" in the footer restores the original figures.

import { BILLS, CATEGORIES, GOALS, HOUSEHOLD, INCOME, MONTHLY_HISTORY, SAVINGS_PLAN, TRANSACTIONS } from './data.js';

const STORAGE_KEY = 'hearth-ledger-v1';

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function freshState() {
  return {
    household: clone(HOUSEHOLD),
    categories: clone(CATEGORIES),
    income: clone(INCOME),
    transactions: clone(TRANSACTIONS),
    savingsPlan: clone(SAVINGS_PLAN),
    goals: clone(GOALS),
    bills: clone(BILLS),
    monthlyHistory: clone(MONTHLY_HISTORY),
  };
}

function loadStored() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.transactions) || !Array.isArray(parsed.categories)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export const state = loadStored() || freshState();

export function saveState() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage full or blocked: the site keeps working in memory.
  }
}

export function resetState() {
  const fresh = freshState();
  for (const key of Object.keys(fresh)) state[key] = fresh[key];
  saveState();
}

// ---- derived figures: every page reads these, never its own sums ----

export function incomeReceived() {
  return state.income.reduce((sum, row) => sum + row.amount, 0);
}

export function incomePlanned() {
  // The month's full expected income, including the 28 November payday.
  return 8380;
}

export function spentByCategory(categoryId) {
  return state.transactions
    .filter((t) => t.category === categoryId)
    .reduce((sum, t) => sum + t.amount, 0);
}

export function totalSpent() {
  return state.transactions.reduce((sum, t) => sum + t.amount, 0);
}

export function totalBudgeted() {
  return state.categories.reduce((sum, c) => sum + c.budget, 0);
}

export function budgetLeft() {
  return totalBudgeted() - totalSpent();
}

export function leftToBudget() {
  return incomePlanned() - totalBudgeted() - state.savingsPlan.monthlyTarget;
}

export function billsDueSoon() {
  // Unpaid bills due within the next 7 days (today is the 25th).
  return state.bills.filter((b) => !b.paid && b.due <= '2026-12-02');
}

export function billsPaidTotal() {
  return state.bills.filter((b) => b.paid).reduce((sum, b) => sum + b.amount, 0);
}

export function overBudgetCategories() {
  return state.categories
    .map((c) => ({ ...c, spent: spentByCategory(c.id) }))
    .filter((c) => c.spent > c.budget);
}
