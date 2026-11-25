// Hearth Ledger: the Harper household's November 2026 figures.
//
// One source of truth. Every total the site shows — the dashboard cards, the
// budget bars, the reports charts — is computed from these arrays, so the
// numbers can never disagree between pages. Amounts are US dollars.
//
// The household: Maya Harper (designer, Northwind Studio) and Tom Harper
// (bus driver, City Transit Authority), with Lily, 9, and Noah, 6, and
// Biscuit the dog. The month runs 1–30 November 2026; "today" in the demo
// data is 25 November, so the last five days are still to come.

export const HOUSEHOLD = {
  name: 'The Harper household',
  members: 'Maya & Tom Harper, Lily (9), Noah (6) and Biscuit the dog',
  month: 'November 2026',
  monthLabel: 'November 2026',
  todayLabel: '25 November 2026',
  daysInMonth: 30,
  dayOfMonth: 25,
  currency: 'USD',
};

export const CATEGORIES = [
  { id: 'housing', name: 'Housing', color: '#1f4d3a', budget: 1850 },
  { id: 'groceries', name: 'Groceries', color: '#2e7d5b', budget: 780 },
  { id: 'utilities', name: 'Utilities', color: '#4a90a4', budget: 340 },
  { id: 'transport', name: 'Transport', color: '#7a6aa8', budget: 460 },
  { id: 'dining', name: 'Dining out', color: '#c96f4a', budget: 280 },
  { id: 'kids', name: 'Kids & school', color: '#d9a441', budget: 420 },
  { id: 'health', name: 'Health', color: '#b65c7a', budget: 240 },
  { id: 'fun', name: 'Fun & outings', color: '#5b8c5a', budget: 200 },
  { id: 'clothing', name: 'Clothing', color: '#8a6d4b', budget: 180 },
  { id: 'household', name: 'Home & household', color: '#6b7f8f', budget: 220 },
  { id: 'car', name: 'Car loan', color: '#3e5c76', budget: 385 },
  { id: 'insurance', name: 'Insurance', color: '#748cab', budget: 310 },
  { id: 'subscriptions', name: 'Subscriptions', color: '#9b7ede', budget: 86 },
  { id: 'personal', name: 'Personal', color: '#c98a7a', budget: 240 },
  { id: 'giving', name: 'Giving', color: '#7fb069', budget: 150 },
  { id: 'pet', name: 'Biscuit the dog', color: '#a9713f', budget: 90 },
];

// Money in. The 28 November payday has not landed yet, so the dashboard
// counts only what has actually arrived.
export const INCOME = [
  { date: '2026-11-07', source: 'Maya — payday', detail: 'Northwind Studio', amount: 2300 },
  { date: '2026-11-14', source: 'Tom — payday', detail: 'City Transit Authority', amount: 1800 },
  { date: '2026-11-15', source: 'Tom — side work', detail: 'Oak bookshelf, sold locally', amount: 180 },
  { date: '2026-11-21', source: 'Maya — payday', detail: 'Northwind Studio', amount: 2300 },
];

// Money out, newest last. Category totals are computed from this list.
export const TRANSACTIONS = [
  { date: '2026-11-01', description: 'Mortgage', merchant: 'First County Bank', category: 'housing', amount: 1850.0 },
  { date: '2026-11-02', description: 'Weekly shop', merchant: 'GreenMart', category: 'groceries', amount: 142.38 },
  { date: '2026-11-02', description: 'Food bank donation', merchant: 'City Food Bank', category: 'giving', amount: 50.0 },
  { date: '2026-11-02', description: 'Music streaming', merchant: 'TuneWave', category: 'subscriptions', amount: 11.99 },
  { date: '2026-11-03', description: 'School lunch money', merchant: 'Maplewood Primary', category: 'kids', amount: 40.0 },
  { date: '2026-11-03', description: 'Electricity', merchant: 'City Power & Light', category: 'utilities', amount: 128.4 },
  { date: '2026-11-04', description: 'Fuel', merchant: 'Shell, High Street', category: 'transport', amount: 48.2 },
  { date: '2026-11-05', description: 'Pizza night', merchant: "Mario's Pizza", category: 'dining', amount: 38.5 },
  { date: '2026-11-05', description: 'Car loan', merchant: 'First County Bank', category: 'car', amount: 385.0 },
  { date: '2026-11-05', description: 'Cleaning supplies', merchant: 'GreenMart', category: 'household', amount: 24.3 },
  { date: '2026-11-06', description: 'Weekly shop', merchant: 'GreenMart', category: 'groceries', amount: 98.54 },
  { date: '2026-11-06', description: 'Pharmacy', merchant: "Boots Pharmacy", category: 'health', amount: 28.75 },
  { date: '2026-11-07', description: 'Dog food', merchant: 'Pet Corner', category: 'pet', amount: 38.4 },
  { date: '2026-11-07', description: 'Dance class', merchant: "Lily's dance school", category: 'kids', amount: 85.0 },
  { date: '2026-11-08', description: 'Haircut — Maya', merchant: 'Curl Up Hair Salon', category: 'personal', amount: 48.0 },
  { date: '2026-11-08', description: 'Thai takeout', merchant: 'Bangkok Kitchen', category: 'dining', amount: 42.75 },
  { date: '2026-11-08', description: 'Water bill', merchant: 'Water District', category: 'utilities', amount: 54.15 },
  { date: '2026-11-09', description: 'Butcher', merchant: 'Corner Butcher', category: 'groceries', amount: 46.2 },
  { date: '2026-11-09', description: 'Cloud storage', merchant: 'CloudBox', category: 'subscriptions', amount: 9.99 },
  { date: '2026-11-09', description: 'Cinema', merchant: 'Regal Cinema', category: 'fun', amount: 32.0 },
  { date: '2026-11-10', description: 'Fuel', merchant: 'Shell, High Street', category: 'transport', amount: 52.75 },
  { date: '2026-11-10', description: 'Home insurance', merchant: 'SafeHome Insurance', category: 'insurance', amount: 186.0 },
  { date: '2026-11-10', description: 'Work shirts', merchant: 'H&M', category: 'clothing', amount: 58.0 },
  { date: '2026-11-11', description: 'Bus passes', merchant: 'City Transit', category: 'transport', amount: 64.0 },
  { date: '2026-11-12', description: 'Weekly shop', merchant: 'GreenMart', category: 'groceries', amount: 121.76 },
  { date: '2026-11-12', description: 'Car insurance', merchant: 'SafeHome Insurance', category: 'insurance', amount: 124.0 },
  { date: '2026-11-12', description: 'Football boots', merchant: 'Sports Direct', category: 'kids', amount: 62.99 },
  { date: '2026-11-12', description: 'Gas bill', merchant: 'City Gas', category: 'utilities', amount: 62.3 },
  { date: '2026-11-13', description: 'Dentist copay — Noah', merchant: 'Bright Smile Dental', category: 'health', amount: 65.0 },
  { date: '2026-11-13', description: 'Gym', merchant: 'FitZone', category: 'personal', amount: 35.0 },
  { date: '2026-11-14', description: 'Lunch with the team', merchant: 'Café Lumen', category: 'dining', amount: 28.4 },
  { date: '2026-11-14', description: 'Light bulbs & batteries', merchant: 'Hardware Store', category: 'household', amount: 18.75 },
  { date: '2026-11-15', description: 'Board game', merchant: 'Toy Chest', category: 'fun', amount: 28.99 },
  { date: '2026-11-16', description: 'Fuel', merchant: 'Shell, High Street', category: 'transport', amount: 45.6 },
  { date: '2026-11-16', description: 'Burger joint', merchant: 'Burger Barn', category: 'dining', amount: 34.9 },
  { date: '2026-11-16', description: 'Video streaming', merchant: 'StreamBox', category: 'subscriptions', amount: 15.49 },
  { date: '2026-11-16', description: 'School fundraiser', merchant: 'Maplewood PTA', category: 'giving', amount: 25.0 },
  { date: '2026-11-17', description: 'Weekly shop', merchant: 'GreenMart', category: 'groceries', amount: 87.43 },
  { date: '2026-11-17', description: 'Winter coat — Noah', merchant: 'H&M', category: 'clothing', amount: 74.5 },
  { date: '2026-11-18', description: 'School trip', merchant: 'Maplewood Primary', category: 'kids', amount: 45.0 },
  { date: '2026-11-18', description: 'Parking', merchant: 'City Centre Car Park', category: 'transport', amount: 12.0 },
  { date: '2026-11-19', description: 'Pharmacy', merchant: 'Boots Pharmacy', category: 'health', amount: 34.2 },
  { date: '2026-11-19', description: 'Vet check — Biscuit', merchant: 'Riverside Vets', category: 'pet', amount: 45.0 },
  { date: '2026-11-20', description: 'Date night', merchant: 'The Old Mill', category: 'dining', amount: 68.0 },
  { date: '2026-11-20', description: 'New kettle', merchant: 'Hardware Store', category: 'household', amount: 42.0 },
  { date: '2026-11-20', description: 'Books — Maya', merchant: 'Waterstones', category: 'personal', amount: 22.5 },
  { date: '2026-11-21', description: 'Farmers market', merchant: 'Saturday Market', category: 'groceries', amount: 58.9 },
  { date: '2026-11-21', description: 'Books & stationery', merchant: 'Paperchase', category: 'kids', amount: 38.4 },
  { date: '2026-11-22', description: 'Internet', merchant: 'FastNet Broadband', category: 'utilities', amount: 79.0 },
  { date: '2026-11-22', description: 'Coffee & pastries', merchant: 'Corner Bakery', category: 'dining', amount: 24.6 },
  { date: '2026-11-22', description: 'Mini golf', merchant: 'Putt & Play', category: 'fun', amount: 41.0 },
  { date: '2026-11-23', description: 'Fuel', merchant: 'Shell, High Street', category: 'transport', amount: 51.3 },
  { date: '2026-11-23', description: 'Towels', merchant: 'HomeSense', category: 'household', amount: 31.2 },
  { date: '2026-11-23', description: 'News app', merchant: 'Daily Post', category: 'subscriptions', amount: 8.99 },
  { date: '2026-11-24', description: 'Weekly shop', merchant: 'GreenMart', category: 'groceries', amount: 84.65 },
  { date: '2026-11-24', description: 'Eye test — Tom', merchant: 'Vision Express', category: 'health', amount: 55.0 },
  { date: '2026-11-24', description: 'Sushi takeout', merchant: 'Sakura Sushi', category: 'dining', amount: 54.25 },
  { date: '2026-11-24', description: 'Movie rental', merchant: 'StreamBox', category: 'fun', amount: 5.99 },
  { date: '2026-11-25', description: 'Birthday gift — Lily', merchant: 'Toy Chest', category: 'kids', amount: 24.95 },
];

// What the household aims to put aside each month, and what has moved so far.
export const SAVINGS_PLAN = { monthlyTarget: 1500, savedSoFar: 1000 };

// Savings goals. Saved amounts grow from the "add money" buttons on the Goals page.
export const GOALS = [
  { id: 'emergency', name: 'Emergency fund', note: 'Six months of essentials, for the day the boiler dies or a job disappears.', target: 10000, saved: 6850 },
  { id: 'holiday', name: 'Summer holiday — Cornwall cottage', note: 'Two weeks by the sea next July: cottage, train fares and fish and chips.', target: 2400, saved: 1150 },
  { id: 'car', name: 'Next family car — deposit', note: 'A bigger, newer car before Noah outgrows the back seat.', target: 6000, saved: 2300 },
  { id: 'bike', name: "Lily's birthday bike", note: 'A red 24-inch bike with a basket. Bought 24 November — goal reached.', target: 320, saved: 320 },
];

// Recurring bills. Paid ones match a transaction above; unpaid ones are still to come.
export const BILLS = [
  { id: 'b1', name: 'Mortgage', amount: 1850, due: '2026-11-01', category: 'housing', paid: true, autopay: true },
  { id: 'b2', name: 'Music streaming — TuneWave', amount: 11.99, due: '2026-11-02', category: 'subscriptions', paid: true, autopay: true },
  { id: 'b3', name: 'Car loan', amount: 385, due: '2026-11-05', category: 'car', paid: true, autopay: true },
  { id: 'b4', name: 'Cloud storage — CloudBox', amount: 9.99, due: '2026-11-09', category: 'subscriptions', paid: true, autopay: true },
  { id: 'b5', name: 'Home insurance', amount: 186, due: '2026-11-10', category: 'insurance', paid: true, autopay: false },
  { id: 'b6', name: 'Car insurance', amount: 124, due: '2026-11-12', category: 'insurance', paid: true, autopay: false },
  { id: 'b7', name: 'Video streaming — StreamBox', amount: 15.49, due: '2026-11-16', category: 'subscriptions', paid: true, autopay: true },
  { id: 'b8', name: 'Internet — FastNet', amount: 79, due: '2026-11-25', category: 'utilities', paid: true, autopay: true },
  { id: 'b9', name: 'News app — Daily Post', amount: 8.99, due: '2026-11-23', category: 'subscriptions', paid: true, autopay: true },
  { id: 'b10', name: 'Mobile — two lines', amount: 96, due: '2026-11-28', category: 'utilities', paid: false, autopay: false },
  { id: 'b11', name: 'Family gym — FitZone', amount: 42, due: '2026-11-28', category: 'personal', paid: false, autopay: true },
  { id: 'b12', name: 'Council tax', amount: 212, due: '2026-12-01', category: 'housing', paid: false, autopay: true },
  { id: 'b13', name: 'Mortgage — December', amount: 1850, due: '2026-12-01', category: 'housing', paid: false, autopay: true },
  { id: 'b14', name: 'School lunches — December', amount: 40, due: '2026-12-05', category: 'kids', paid: false, autopay: false },
];

// Six months of income and spending, for the Reports chart.
export const MONTHLY_HISTORY = [
  { month: 'Jun 2026', income: 8380, spent: 6120 },
  { month: 'Jul 2026', income: 8380, spent: 5890 },
  { month: 'Aug 2026', income: 8560, spent: 6340 },
  { month: 'Sep 2026', income: 8380, spent: 5980 },
  { month: 'Oct 2026', income: 8380, spent: 6050 },
  { month: 'Nov 2026', income: 8380, spent: 5220.34, note: 'so far' },
];
