// Hearth Ledger: a household budget site that runs from static files.
//
//   #/                Dashboard — the month at a glance
//   #/transactions    The full ledger, with a working add form and CSV export
//   #/budget          Every category's budget, editable in place
//   #/goals           Savings goals, with working add-money buttons
//   #/bills           Bills and due dates, markable paid
//   #/reports         Six-month report with charts and findings
//   #/planner         Paycheck planner — split take-home pay three ways
//
// window.__shotReady is false while a page renders and true once it is on
// screen, so a screenshot script knows when to capture.

import { dashboard } from './view-dashboard.js';
import { bindTransactions, transactions } from './view-transactions.js';
import { bindBudget, budget } from './view-budget.js';
import { bindGoals, goals } from './view-goals.js';
import { bindBills, bills } from './view-bills.js';
import { reports } from './view-reports.js';
import { bindPlanner, planner } from './view-planner.js';
import { resetState } from './state.js';

const app = document.getElementById('app');

const PAGES = {
  '': { title: 'Hearth Ledger — the Harper household budget', render: dashboard },
  'transactions': { title: 'Transactions | Hearth Ledger', render: transactions, bind: bindTransactions },
  'budget': { title: 'Budget | Hearth Ledger', render: budget, bind: bindBudget },
  'goals': { title: 'Savings goals | Hearth Ledger', render: goals, bind: bindGoals },
  'bills': { title: 'Bills | Hearth Ledger', render: bills, bind: bindBills },
  'reports': { title: 'Monthly report | Hearth Ledger', render: reports },
  'planner': { title: 'Paycheck planner | Hearth Ledger', render: planner, bind: bindPlanner },
};

function render() {
  window.__shotReady = false;
  const page = (location.hash.match(/^#\/([a-z-]*)/) || [])[1] || '';
  const found = PAGES[page];
  document.title = found ? found.title : 'Not found | Hearth Ledger';
  app.innerHTML = found
    ? found.render()
    : '<section class="hero"><h1>Not found</h1><p class="lede">There is no page at this address. <a href="#/">Back to the dashboard</a>.</p></section>';
  document.querySelectorAll('nav a').forEach((a) => {
    a.classList.toggle('active', a.dataset.page === page);
  });
  if (found && found.bind) found.bind(app);
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

document.getElementById('reset-demo').addEventListener('click', () => {
  resetState();
  render();
});

window.addEventListener('hashchange', render);
render();
