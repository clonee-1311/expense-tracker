import React from "react";

function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "360px" }}>
        <h2 style={{ fontSize: "1rem" }}>Are you sure?</h2>
        <p style={{ color: "#64748b", margin: "12px 0 20px", fontSize: "0.9rem" }}>
          {message}
        </p>
        <div className="form-actions">
          <button className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="btn-danger"
            style={{ background: "#dc2626", color: "#fff", padding: "10px 20px" }}
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
