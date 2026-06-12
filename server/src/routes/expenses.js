const express = require("express");
const router = express.Router();
const store = require("../store");

// GET /api/expenses
// supports optional query params: category, startDate, endDate
router.get("/", (req, res) => {
  let expenses = store.getAll();
  const { category, startDate, endDate } = req.query;

  if (category && category !== "All") {
    expenses = expenses.filter((e) => e.category === category);
  }

  if (startDate) {
    expenses = expenses.filter((e) => e.date >= startDate);
  }

  if (endDate) {
    expenses = expenses.filter((e) => e.date <= endDate);
  }

  res.json(expenses);
});

// GET /api/expenses/summary
// returns totals for the current month broken down by category
// keeping this route BEFORE /:id so express doesn't think "summary" is an id
router.get("/summary", (req, res) => {
  const all = store.getAll();

  const now = new Date();
  const thisMonth = all.filter((e) => {
    const d = new Date(e.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  // total spent this month
  const totalThisMonth = thisMonth.reduce((sum, e) => sum + e.amount, 0);

  // breakdown by category
  const byCategory = {};
  thisMonth.forEach((e) => {
    byCategory[e.category] = (byCategory[e.category] || 0) + e.amount;
  });

  // highest single expense this month
  const highest = thisMonth.length
    ? thisMonth.reduce((max, e) => (e.amount > max.amount ? e : max), thisMonth[0])
    : null;

  res.json({ totalThisMonth, byCategory, highest });
});

// GET /api/expenses/:id
router.get("/:id", (req, res) => {
  const expense = store.getById(req.params.id);
  if (!expense) return res.status(404).json({ error: "Expense not found" });
  res.json(expense);
});

// POST /api/expenses
router.post("/", (req, res) => {
  const { amount, category, date, note } = req.body;

  // basic validation - don't trust the client
  if (!amount || isNaN(amount) || Number(amount) <= 0) {
    return res.status(400).json({ error: "Amount must be a positive number" });
  }
  if (!category) {
    return res.status(400).json({ error: "Category is required" });
  }
  if (!date) {
    return res.status(400).json({ error: "Date is required" });
  }
  // no future dates
  if (date > new Date().toISOString().split("T")[0]) {
    return res.status(400).json({ error: "Date cannot be in the future" });
  }

  const expense = store.create({
    amount: Number(amount),
    category,
    date,
    note,
  });

  res.status(201).json(expense);
});

// PUT /api/expenses/:id
router.put("/:id", (req, res) => {
  const { amount, category, date, note } = req.body;

  if (amount !== undefined && (isNaN(amount) || Number(amount) <= 0)) {
    return res.status(400).json({ error: "Amount must be a positive number" });
  }
  if (date && date > new Date().toISOString().split("T")[0]) {
    return res.status(400).json({ error: "Date cannot be in the future" });
  }

  const updated = store.update(req.params.id, {
    amount: amount !== undefined ? Number(amount) : undefined,
    category,
    date,
    note,
  });

  if (!updated) return res.status(404).json({ error: "Expense not found" });
  res.json(updated);
});

// DELETE /api/expenses/:id
router.delete("/:id", (req, res) => {
  const deleted = store.remove(req.params.id);
  if (!deleted) return res.status(404).json({ error: "Expense not found" });
  res.json({ message: "Expense deleted" });
});

module.exports = router;
