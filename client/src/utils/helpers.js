// format a number as Indian Rupees
export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
}

// format a date string nicely
export function formatDate(dateStr) {
  if (!dateStr) return "-";
  const [year, month, day] = dateStr.split("-");
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// today's date as YYYY-MM-DD — used to set max on date inputs
export function todayISO() {
  return new Date().toISOString().split("T")[0];
}

// first day of current month as YYYY-MM-DD
export function startOfMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
}

// colour palette per category — keeps the UI consistent
export const CATEGORY_COLORS = {
  Food: "#f97316",
  Transport: "#3b82f6",
  Bills: "#ef4444",
  Entertainment: "#a855f7",
  Other: "#64748b",
};

export const CATEGORIES = ["Food", "Transport", "Bills", "Entertainment", "Other"];
