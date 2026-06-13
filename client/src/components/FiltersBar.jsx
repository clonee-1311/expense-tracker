import React from "react";
import { CATEGORIES, startOfMonth, todayISO } from "../utils/helpers";

function FiltersBar({ filters, onFilterChange, expenses }) {
  function handleChange(e) {
    onFilterChange({ ...filters, [e.target.name]: e.target.value });
  }

  // preset date range shortcuts
  function applyPreset(preset) {
    const now = new Date();
    if (preset === "this-month") {
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      onFilterChange({
        ...filters,
        startDate: `${year}-${month}-01`,
        endDate: todayISO(),
      });
    } else if (preset === "last-month") {
      const d = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const lastDay = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
      onFilterChange({
        ...filters,
        startDate: `${year}-${month}-01`,
        endDate: `${year}-${month}-${lastDay}`,
      });
    } else {
      onFilterChange({ ...filters, startDate: "", endDate: "" });
    }
  }

  // export the currently filtered list as a CSV
  function exportCSV() {
    if (expenses.length === 0) return;

    const header = ["Date", "Category", "Amount (INR)", "Note"];
    const rows = expenses.map((e) => [
      e.date,
      e.category,
      e.amount,
      `"${(e.note || "").replace(/"/g, '""')}"`,
    ]);

    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "expenses.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="filters-bar">
      <select name="category" value={filters.category} onChange={handleChange}>
        <option value="All">All Categories</option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <select
        defaultValue=""
        onChange={(e) => applyPreset(e.target.value)}
      >
        <option value="">Date range</option>
        <option value="this-month">This month</option>
        <option value="last-month">Last month</option>
        <option value="">All time</option>
      </select>

      <input
        type="date"
        name="startDate"
        value={filters.startDate}
        max={todayISO()}
        onChange={handleChange}
        title="From date"
      />

      <input
        type="date"
        name="endDate"
        value={filters.endDate}
        max={todayISO()}
        onChange={handleChange}
        title="To date"
      />

      <button className="export-btn" onClick={exportCSV} title="Export as CSV">
        ↓ Export CSV
      </button>
    </div>
  );
}

export default FiltersBar;
