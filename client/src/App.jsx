import React, { useState } from "react";
import { useExpenses } from "./hooks/useExpenses";
import { startOfMonth, todayISO } from "./utils/helpers";
import SummaryCards from "./components/SummaryCards";
import CategoryChart from "./components/CategoryChart";
import FiltersBar from "./components/FiltersBar";
import ExpenseTable from "./components/ExpenseTable";
import ExpenseModal from "./components/ExpenseModal";
import ConfirmDialog from "./components/ConfirmDialog";

function App() {
  // filter state lives here so both the FiltersBar and the hook share it
  const [filters, setFilters] = useState({
    category: "All",
    startDate: startOfMonth(),
    endDate: todayISO(),
  });

  const { expenses, summary, loading, error, addExpense, updateExpense, deleteExpense } =
    useExpenses(filters);

  // modal state
  const [showAdd, setShowAdd] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [deletingExpense, setDeletingExpense] = useState(null);

  async function handleSaveNew(data) {
    await addExpense(data);
  }

  async function handleSaveEdit(data) {
    await updateExpense(editingExpense.id, data);
  }

  async function handleConfirmDelete() {
    await deleteExpense(deletingExpense.id);
    setDeletingExpense(null);
  }

  return (
    <div className="app-wrapper">
      {/* Header */}
      <div className="app-header">
        <div>
          <h1>💰 Expense Tracker</h1>
          <p>Track your daily spending across categories</p>
        </div>
        <button className="btn-primary" onClick={() => setShowAdd(true)}>
          + Add Expense
        </button>
      </div>

      {/* Error banner */}
      {error && (
        <div
          style={{
            background: "#fee2e2",
            color: "#dc2626",
            padding: "12px 16px",
            borderRadius: "10px",
            marginBottom: "20px",
            fontSize: "0.9rem",
          }}
        >
          {error}
        </div>
      )}

      {/* Summary cards */}
      <SummaryCards summary={summary} />

      {/* Pie chart */}
      <CategoryChart byCategory={summary?.byCategory} />

      {/* Filters + table */}
      <div className="card">
        <FiltersBar
          filters={filters}
          onFilterChange={setFilters}
          expenses={expenses}
        />

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
            Loading expenses...
          </div>
        ) : (
          <ExpenseTable
            expenses={expenses}
            onEdit={(exp) => setEditingExpense(exp)}
            onDelete={(exp) => setDeletingExpense(exp)}
          />
        )}
      </div>

      {/* Add modal */}
      {showAdd && (
        <ExpenseModal onSave={handleSaveNew} onClose={() => setShowAdd(false)} />
      )}

      {/* Edit modal */}
      {editingExpense && (
        <ExpenseModal
          expense={editingExpense}
          onSave={handleSaveEdit}
          onClose={() => setEditingExpense(null)}
        />
      )}

      {/* Delete confirmation */}
      {deletingExpense && (
        <ConfirmDialog
          message={`Delete this ₹${deletingExpense.amount} expense (${deletingExpense.category})?`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeletingExpense(null)}
        />
      )}
    </div>
  );
}

export default App;
