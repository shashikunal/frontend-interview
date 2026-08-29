const fs = require('fs')

const jsxRaw = fs.readFileSync('_budget.jsx', 'utf8')
const cssRaw = fs.readFileSync('_budget.css', 'utf8')

const solutionJsx = jsxRaw
  .replace(/BudgetTracker/g, 'App')
  .replace('./BudgetTracker.css', './App.css')

const starterJsx = `import React, { useState } from "react";
import "./App.css";

// Task: Build a Budget Tracker.
// Track income and expense transactions, show totals,
// and render the list of transactions. Styles live in App.css.
const App = () => {
  return (
    <div className="budget-tracker">
      <h1 className="title">Budget Tracker</h1>
      {/* Implement the input form, analytics, and transaction list here */}
    </div>
  );
};

export default App;
`

const examples = [
  {
    id: 'budget',
    title: 'Budget Tracker',
    description:
      'Build a budget tracker that records income/expense transactions, shows totals, and lists them.',
    starter: { 'App.jsx': starterJsx, 'App.css': cssRaw },
    solution: { 'App.jsx': solutionJsx, 'App.css': cssRaw },
  },
]

fs.writeFileSync('src/data/taskBased.json', JSON.stringify({ examples }, null, 2))
console.log('wrote src/data/taskBased.json')
