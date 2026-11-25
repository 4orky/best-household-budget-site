// Paycheck planner: split a month's take-home pay between needs, wants
// and savings. Three sliders that always add to 100%, with live dollar
// amounts and a concrete suggestion for this household.

import { escapeHtml, money0 } from './format.js';

let pay = 8380;
let needs = 60;
let wants = 25;
let savings = 15;
let planMessage = '';

function clampSliders(changedKey) {
  // Keep the three shares adding to 100: the slider just moved keeps its
  // value, the other two share the rest in their current ratio.
  const changed = { needs, wants, savings }[changedKey];
  const rest = 100 - changed;
  if (changedKey === 'needs') {
    const ratio = wants + savings > 0 ? wants / (wants + savings) : 0.5;
    wants = Math.round(rest * ratio);
    savings = rest - wants;
  } else if (changedKey === 'wants') {
    const ratio = needs + savings > 0 ? needs / (needs + savings) : 0.5;
    needs = Math.round(rest * ratio);
    savings = rest - needs;
  } else {
    const ratio = needs + wants > 0 ? needs / (needs + wants) : 0.5;
    needs = Math.round(rest * ratio);
    wants = rest - needs;
  }
}

export function planner() {
  const needsAmount = Math.round((pay * needs) / 100);
  const wantsAmount = Math.round((pay * wants) / 100);
  const savingsAmount = pay - needsAmount - wantsAmount;
  const classic = needs === 50 && wants === 30 && savings === 20;

  return `
  <section class="hero">
    <p class="eyebrow">Tool · the 50 / 30 / 20 rule, tuned to your pay</p>
    <h1>Paycheck planner</h1>
    <p class="lede">Type in a month's take-home pay, drag the three sliders, and see the split in dollars. The classic split is 50% needs, 30% wants, 20% savings — most households land near it, few land on it exactly.</p>
  </section>

  <section class="card">
    <form id="planner-form" class="planner-form">
      <label>Monthly take-home pay ($)
        <input id="planner-pay" name="pay" type="number" min="0" step="10" value="${pay}">
      </label>
      <div class="slider-row">
        <label for="slider-needs">Needs — rent, bills, groceries, transport</label>
        <input id="slider-needs" type="range" min="0" max="100" value="${needs}">
        <output id="out-needs">${needs}% · ${money0(needsAmount)}</output>
      </div>
      <div class="slider-row">
        <label for="slider-wants">Wants — eating out, fun, new things</label>
        <input id="slider-wants" type="range" min="0" max="100" value="${wants}">
        <output id="out-wants">${wants}% · ${money0(wantsAmount)}</output>
      </div>
      <div class="slider-row">
        <label for="slider-savings">Savings — goals, emergency fund, extra debt</label>
        <input id="slider-savings" type="range" min="0" max="100" value="${savings}">
        <output id="out-savings">${savings}% · ${money0(savingsAmount)}</output>
      </div>
    </form>

    <div class="planner-result">
      <p><strong>${money0(pay)}</strong> take-home pay splits into <strong>${money0(needsAmount)}</strong> needs, <strong>${money0(wantsAmount)}</strong> wants and <strong>${money0(savingsAmount)}</strong> savings.</p>
      <p>${classic ? 'That is the classic 50 / 30 / 20 split, right on the line.' : `That is a ${needs} / ${wants} / ${savings} split. ${savings >= 20 ? 'Saving a fifth or more of take-home pay puts the household well ahead of most.' : savings >= 10 ? 'Saving a tenth or more is a solid habit — nudge it up a point whenever pay rises.' : 'Savings under 10% is thin for a household with two children; even $50 more a month compounds into a real cushion.'}`}</p>
      <p class="card-note">For the Harpers' ${money0(8380)} month, a 60 / 25 / 15 split means ${money0(5028)} needs, ${money0(2095)} wants and ${money0(1257)} savings — close to the ${money0(1500)} they actually target, and the ${money0(649)} left unbudgeted is the slack that covers it.</p>
    </div>

    <p class="card-note" id="planner-note" role="status">${escapeHtml(planMessage)}</p>
    <p><button class="btn" type="button" id="planner-classic">Reset to 50 / 30 / 20</button></p>
  </section>

  <section class="card">
    <h2>How to use the split</h2>
    <ul class="findings">
      <li><strong>Needs first.</strong> If needs run past 60% of pay, the fix is rarely a cheaper coffee — it is the big lines: housing, transport, insurance. The budget page shows which.</li>
      <li><strong>Automate savings.</strong> Move the savings share on payday, before the month starts spending it. The Harpers move theirs on the 7th and the 21st.</li>
      <li><strong>Wants are the flex.</strong> When a month runs hot, wants absorb it — that is their job. Cutting them to zero for months on end is how budgets get abandoned.</li>
    </ul>
  </section>`;
}

export function bindPlanner(root) {
  const payInput = root.querySelector('#planner-pay');
  const sliders = {
    needs: root.querySelector('#slider-needs'),
    wants: root.querySelector('#slider-wants'),
    savings: root.querySelector('#slider-savings'),
  };
  const outputs = {
    needs: root.querySelector('#out-needs'),
    wants: root.querySelector('#out-wants'),
    savings: root.querySelector('#out-savings'),
  };

  function refresh(changedKey) {
    if (changedKey) clampSliders(changedKey);
    const needsAmount = Math.round((pay * needs) / 100);
    const wantsAmount = Math.round((pay * wants) / 100);
    const savingsAmount = pay - needsAmount - wantsAmount;
    sliders.needs.value = needs;
    sliders.wants.value = wants;
    sliders.savings.value = savings;
    outputs.needs.textContent = `${needs}% · ${money0(needsAmount)}`;
    outputs.wants.textContent = `${wants}% · ${money0(wantsAmount)}`;
    outputs.savings.textContent = `${savings}% · ${money0(savingsAmount)}`;
    const result = root.querySelector('.planner-result p');
    if (result) {
      result.innerHTML = `<strong>${money0(pay)}</strong> take-home pay splits into <strong>${money0(needsAmount)}</strong> needs, <strong>${money0(wantsAmount)}</strong> wants and <strong>${money0(savingsAmount)}</strong> savings.`;
    }
  }

  if (payInput) {
    payInput.addEventListener('input', () => {
      const value = Number(payInput.value);
      if (Number.isFinite(value) && value >= 0) {
        pay = Math.round(value);
        refresh();
      }
    });
  }
  for (const [key, slider] of Object.entries(sliders)) {
    if (!slider) continue;
    slider.addEventListener('input', () => {
      if (key === 'needs') needs = Number(slider.value);
      if (key === 'wants') wants = Number(slider.value);
      if (key === 'savings') savings = Number(slider.value);
      refresh(key);
    });
  }
  const classicBtn = root.querySelector('#planner-classic');
  if (classicBtn) {
    classicBtn.addEventListener('click', () => {
      needs = 50;
      wants = 30;
      savings = 20;
      refresh();
      planMessage = 'Back to the classic 50 / 30 / 20 split.';
      const note = root.querySelector('#planner-note');
      if (note) note.textContent = planMessage;
    });
  }
}
