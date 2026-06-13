import React from "react";
import { formatCurrency, formatDate, CATEGORY_COLORS } from "../utils/helpers";

function ExpenseTable({ expenses, onEdit, onDelete }) {
  if (expenses.length === 0) {
    return (
      <div className="empty-state">
        <div style={{ fontSize: "2.5rem" }}>💸</div>
        <p>No expenses found. Add one to get started!</p>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Note</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense.id}>
              <td>{formatDate(expense.date)}</td>

              <td>
                <span
                  className="category-badge"
                  style={{
                    background: CATEGORY_COLORS[expense.category] + "22",
                    color: CATEGORY_COLORS[expense.category] || "#64748b",
                  }}
                >
                  {expense.category}
                </span>
              </td>

              <td style={{ fontWeight: 600 }}>{formatCurrency(expense.amount)}</td>

              <td style={{ color: "#64748b", maxWidth: "200px" }}>
                {expense.note || <span style={{ color: "#cbd5e1" }}>—</span>}
              </td>

              <td>
                <div className="actions-cell">
                  <button className="btn-edit" onClick={() => onEdit(expense)}>
                    Edit
                  </button>
                  <button className="btn-danger" onClick={() => onDelete(expense)}>
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ExpenseTable;
