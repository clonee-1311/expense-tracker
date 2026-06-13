import React from "react";
import { formatCurrency } from "../utils/helpers";

function SummaryCards({ summary }) {
  if (!summary) return null;

  const { totalThisMonth, byCategory, highest } = summary;

  // find the category with most spending
  const topCategory = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="summary-grid">
      <div className="summary-card">
        <div className="label">This Month</div>
        <div className="value">{formatCurrency(totalThisMonth)}</div>
        <div className="sub">Total spent</div>
      </div>

      <div className="summary-card">
        <div className="label">Top Category</div>
        <div className="value" style={{ fontSize: "1.1rem" }}>
          {topCategory ? topCategory[0] : "—"}
        </div>
        <div className="sub">
          {topCategory ? formatCurrency(topCategory[1]) : "No data"}
        </div>
      </div>

      <div className="summary-card">
        <div className="label">Highest Expense</div>
        <div className="value">{highest ? formatCurrency(highest.amount) : "—"}</div>
        <div className="sub">{highest ? highest.note || highest.category : "No data"}</div>
      </div>

      <div className="summary-card">
        <div className="label">Categories Used</div>
        <div className="value">{Object.keys(byCategory).length}</div>
        <div className="sub">This month</div>
      </div>
    </div>
  );
}

export default SummaryCards;
