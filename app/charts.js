// Small SVG charts, drawn in code — no library, no network. A donut shows
// where the month's money went; bars compare six months of income and spending.

import { money0 } from './format.js';

function polar(cx, cy, r, angleDeg) {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

function arcPath(cx, cy, rOuter, rInner, startAngle, endAngle) {
  const [x1, y1] = polar(cx, cy, rOuter, startAngle);
  const [x2, y2] = polar(cx, cy, rOuter, endAngle);
  const [x3, y3] = polar(cx, cy, rInner, endAngle);
  const [x4, y4] = polar(cx, cy, rInner, startAngle);
  const large = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${x1.toFixed(1)} ${y1.toFixed(1)} A ${rOuter} ${rOuter} 0 ${large} 1 ${x2.toFixed(1)} ${y2.toFixed(1)} L ${x3.toFixed(1)} ${y3.toFixed(1)} A ${rInner} ${rInner} 0 ${large} 0 ${x4.toFixed(1)} ${y4.toFixed(1)} Z`;
}

// Donut of spending by category. slices: [{label, value, color}].
// Returns an SVG string with a legend beside it.
export function donutChart(slices, total, centerLabel) {
  const width = 560;
  const height = 260;
  const cx = 130;
  const cy = 130;
  const rOuter = 110;
  const rInner = 68;
  let angle = 0;
  const paths = slices.map((s) => {
    const share = total > 0 ? s.value / total : 0;
    const sweep = Math.max(share * 360, share > 0 ? 2 : 0);
    const d = arcPath(cx, cy, rOuter, rInner, angle, angle + sweep);
    angle += sweep;
    return `<path d="${d}" fill="${s.color}"><title>${s.label}: ${money0(s.value)}</title></path>`;
  });
  const legend = slices
    .map(
      (s, i) => `<g transform="translate(268 ${18 + i * 30})">
        <rect width="14" height="14" rx="3" fill="${s.color}"></rect>
        <text x="22" y="12" class="chart-label">${s.label}</text>
        <text x="272" y="12" class="chart-value" text-anchor="end">${money0(s.value)}</text>
      </g>`,
    )
    .join('');
  return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Spending by category" class="chart-svg">
    ${paths.join('')}
    <text x="${cx}" y="${cy - 6}" text-anchor="middle" class="chart-centre-big">${money0(total)}</text>
    <text x="${cx}" y="${cy + 16}" text-anchor="middle" class="chart-centre-small">${centerLabel}</text>
    ${legend}
  </svg>`;
}

// Grouped bars: income vs spending for each month in history.
export function monthBars(history) {
  const width = 560;
  const height = 280;
  const top = 24;
  const bottom = 52;
  const plotHeight = height - top - bottom;
  const max = Math.max(...history.map((h) => Math.max(h.income, h.spent))) * 1.08;
  const slot = width / history.length;
  const barW = Math.min(34, slot / 3.4);
  const bars = history
    .map((h, i) => {
      const x = slot * i + slot / 2;
      const incomeH = (h.income / max) * plotHeight;
      const spentH = (h.spent / max) * plotHeight;
      const y0 = top + plotHeight;
      return `<g>
        <rect x="${(x - barW - 4).toFixed(1)}" y="${(y0 - incomeH).toFixed(1)}" width="${barW}" height="${incomeH.toFixed(1)}" rx="3" fill="#2e7d5b"><title>${h.month} income ${money0(h.income)}</title></rect>
        <rect x="${(x + 4).toFixed(1)}" y="${(y0 - spentH).toFixed(1)}" width="${barW}" height="${spentH.toFixed(1)}" rx="3" fill="#c96f4a"><title>${h.month} spent ${money0(h.spent)}${h.note ? ` (${h.note})` : ''}</title></rect>
        <text x="${x.toFixed(1)}" y="${height - 30}" text-anchor="middle" class="chart-label">${h.month}</text>
        <text x="${x.toFixed(1)}" y="${height - 12}" text-anchor="middle" class="chart-value">${money0(h.spent)}${h.note ? '*' : ''}</text>
      </g>`;
    })
    .join('');
  return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Income and spending by month" class="chart-svg">
    <line x1="8" y1="${top + plotHeight}" x2="${width - 8}" y2="${top + plotHeight}" class="chart-axis"></line>
    ${bars}
    <g transform="translate(8 8)">
      <rect width="12" height="12" rx="3" fill="#2e7d5b"></rect><text x="18" y="11" class="chart-label">Income</text>
      <rect x="90" width="12" height="12" rx="3" fill="#c96f4a"></rect><text x="108" y="11" class="chart-label">Spent</text>
    </g>
  </svg>`;
}
