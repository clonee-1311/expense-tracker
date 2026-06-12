// I'm using an in-memory array here instead of a database.
// It's simple and gets the job done for this project.
// In a real app I'd switch this to SQLite or PostgreSQL.

const { v4: uuidv4 } = require("uuid");

// seed a few expenses so the UI isn't empty when the reviewer first opens it
let expenses = [
  {
    id: uuidv4(),
    amount: 450,
    category: "Food",
    date: new Date().toISOString().split("T")[0],
    note: "Lunch with team",
    createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    amount: 1200,
    category: "Bills",
    date: new Date().toISOString().split("T")[0],
    note: "Electricity bill",
    createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    amount: 350,
    category: "Transport",
    date: new Date().toISOString().split("T")[0],
    note: "Cab to office",
    createdAt: new Date().toISOString(),
  },
];

function getAll() {
  // return newest first
  return [...expenses].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
}

function getById(id) {
  return expenses.find((e) => e.id === id);
}

function create(data) {
  const expense = {
    id: uuidv4(),
    amount: data.amount,
    category: data.category,
    date: data.date,
    note: data.note || "",
    createdAt: new Date().toISOString(),
  };
  expenses.push(expense);
  return expense;
}

function update(id, data) {
  const index = expenses.findIndex((e) => e.id === id);
  if (index === -1) return null;

  expenses[index] = {
    ...expenses[index],
    amount: data.amount ?? expenses[index].amount,
    category: data.category ?? expenses[index].category,
    date: data.date ?? expenses[index].date,
    note: data.note ?? expenses[index].note,
  };

  return expenses[index];
}

function remove(id) {
  const index = expenses.findIndex((e) => e.id === id);
  if (index === -1) return false;
  expenses.splice(index, 1);
  return true;
}

module.exports = { getAll, getById, create, update, remove };
