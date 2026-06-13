import { useState, useEffect, useCallback } from "react";

const BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api/expenses`
  : "/api/expenses";

// This hook owns all the data-fetching logic.
// Components just call the functions - they don't need to know about fetch() at all.
export function useExpenses(filters) {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const buildQueryString = (f) => {
    const params = new URLSearchParams();
    if (f.category && f.category !== "All") params.set("category", f.category);
    if (f.startDate) params.set("startDate", f.startDate);
    if (f.endDate) params.set("endDate", f.endDate);
    return params.toString();
  };

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const qs = buildQueryString(filters);
      const [expRes, sumRes] = await Promise.all([
        fetch(`${BASE}?${qs}`),
        fetch(`${BASE}/summary`),
      ]);

      if (!expRes.ok) throw new Error("Failed to load expenses");
      if (!sumRes.ok) throw new Error("Failed to load summary");

      const [expData, sumData] = await Promise.all([expRes.json(), sumRes.json()]);
      setExpenses(expData);
      setSummary(sumData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  async function addExpense(data) {
    const res = await fetch(BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Failed to add expense");
    await fetchExpenses();
    return json;
  }

  async function updateExpense(id, data) {
    const res = await fetch(`${BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Failed to update expense");
    await fetchExpenses();
    return json;
  }

  async function deleteExpense(id) {
    const res = await fetch(`${BASE}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete expense");
    await fetchExpenses();
  }

  return {
    expenses,
    summary,
    loading,
    error,
    addExpense,
    updateExpense,
    deleteExpense,
    refresh: fetchExpenses,
  };
}
