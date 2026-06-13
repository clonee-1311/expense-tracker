import React, { useState, useEffect } from "react";
import { CATEGORIES, todayISO } from "../utils/helpers";

// This modal is used for both adding a new expense and editing an existing one.
// When `expense` prop is passed it's edit mode, otherwise it's add mode.
function ExpenseModal({ expense, onSave, onClose }) {
  const isEdit = Boolean(expense);

  const [form, setForm] = useState({
    amount: "",
    category: "Food",
    date: todayISO(),
    note: "",
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // if we're in edit mode, pre-fill the form with existing data
  useEffect(() => {
    if (expense) {
      setForm({
        amount: String(expense.amount),
        category: expense.category,
        date: expense.date,
        note: expense.note || "",
      });
    }
  }, [expense]);

  function validate() {
    const errs = {};
    const amt = parseFloat(form.amount);

    if (!form.amount || isNaN(amt) || amt <= 0) {
      errs.amount = "Enter a valid positive amount";
    }
    if (!form.category) {
      errs.category = "Category is required";
    }
    if (!form.date) {
      errs.date = "Date is required";
    } else if (form.date > todayISO()) {
      errs.date = "Date cannot be in the future";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;

    setSaving(true);
    try {
      await onSave({
        amount: parseFloat(form.amount),
        category: form.category,
        date: form.date,
        note: form.note.trim(),
      });
      onClose();
    } catch (err) {
      setErrors({ global: err.message });
    } finally {
      setSaving(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // clear the error for that field as user types
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      {/* stop clicks inside the box from closing the modal */}
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h2>{isEdit ? "Edit Expense" : "Add New Expense"}</h2>

        {errors.global && (
          <div className="form-error" style={{ marginBottom: "12px" }}>
            {errors.global}
          </div>
        )}

        <div className="form-group">
          <label>Amount (₹) *</label>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            placeholder="e.g. 450"
            min="0.01"
            step="0.01"
          />
          {errors.amount && <div className="form-error">{errors.amount}</div>}
        </div>

        <div className="form-group">
          <label>Category *</label>
          <select name="category" value={form.category} onChange={handleChange}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.category && <div className="form-error">{errors.category}</div>}
        </div>

        <div className="form-group">
          <label>Date *</label>
          <input
            type="date"
            name="date"
            value={form.date}
            max={todayISO()}
            onChange={handleChange}
          />
          {errors.date && <div className="form-error">{errors.date}</div>}
        </div>

        <div className="form-group">
          <label>Note (optional)</label>
          <textarea
            name="note"
            value={form.note}
            onChange={handleChange}
            placeholder="e.g. Lunch with team"
          />
        </div>

        <div className="form-actions">
          <button className="btn-secondary" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleSubmit} disabled={saving}>
            {saving ? "Saving..." : isEdit ? "Save Changes" : "Add Expense"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExpenseModal;
