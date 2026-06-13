# Mini Expense Tracker

**Exercise 2 — Studio Graphene Full Stack Assessment**

A small full-stack web app where a user can log daily expenses across categories, filter and view them in a table, and see a live summary and pie chart of where their money is going. No authentication — single user assumed.

---

## Tech Stack

| Layer    | Choice                                | Why                                               |
| -------- | ------------------------------------- | ------------------------------------------------- |
| Backend  | Node.js + Express                     | Lightweight, quick to set up REST routes          |
| Frontend | React + Vite                          | Fast dev server, functional components with hooks |
| Storage  | In-memory array (server/src/store.js) | Simple and sufficient for this project            |
| Charts   | Recharts                              | Easy to integrate with React, good docs           |
| Styling  | Plain CSS                             | Keeps things straightforward, no build overhead   |

---

## Live Demo

Frontend: https://expense-tracker-mu-ten-35.vercel.app/
Backend: https://expense-tracker-api-ng2t.onrender.com

## How to Run Locally

> Assumes you have **Node.js v18+** installed. That's all you need.

### 1. Clone the repo

```bash
git clone https://github.com/clonee-1311/expense-tracker.git
cd expense-tracker
```

### 2. Install dependencies

```bash
# Install server deps
cd server && npm install

# Install client deps
cd ../client && npm install
```

### 3. Start the backend

Open a terminal in the `server` folder:

```bash
cd server
npm run dev
```

Server starts at **http://localhost:5000**

### 4. Start the frontend

Open a second terminal in the `client` folder:

```bash
cd client
npm run dev
```

Frontend starts at **http://localhost:3000**

Open **http://localhost:3000** in your browser and you're good to go.

> Note: The Vite dev server proxies `/api` calls to `localhost:5000` automatically — no CORS issues locally.

---

## API Documentation

Base URL: `http://localhost:5000/api`

### GET /expenses

Returns all expenses. Supports optional query params:

| Param       | Type       | Description                                                       |
| ----------- | ---------- | ----------------------------------------------------------------- |
| `category`  | string     | Filter by category (Food, Transport, Bills, Entertainment, Other) |
| `startDate` | YYYY-MM-DD | Filter expenses on or after this date                             |
| `endDate`   | YYYY-MM-DD | Filter expenses on or before this date                            |

**Response:** Array of expense objects sorted by date descending.

```json
[
  {
    "id": "uuid",
    "amount": 450,
    "category": "Food",
    "date": "2025-08-10",
    "note": "Lunch with team",
    "createdAt": "2025-08-10T10:00:00.000Z"
  }
]
```

---

### GET /expenses/summary

Returns aggregated data for the current calendar month.

```json
{
  "totalThisMonth": 2000,
  "byCategory": {
    "Food": 450,
    "Bills": 1200,
    "Transport": 350
  },
  "highest": {
    "id": "uuid",
    "amount": 1200,
    "category": "Bills",
    "date": "2025-08-10",
    "note": "Electricity bill"
  }
}
```

---

### GET /expenses/:id

Returns a single expense by ID.

---

### POST /expenses

Creates a new expense.

**Request body:**

```json
{
  "amount": 450,
  "category": "Food",
  "date": "2025-08-10",
  "note": "Lunch"
}
```

`amount`, `category`, and `date` are required. `note` is optional.

**Response:** `201` with the created expense object.

---

### PUT /expenses/:id

Updates an existing expense. Same body shape as POST; all fields are optional.

**Response:** Updated expense object.

---

### DELETE /expenses/:id

Deletes an expense.

**Response:** `{ "message": "Expense deleted" }`

---

## Project Structure

```
expense-tracker/
├── server/
│   ├── package.json
│   └── src/
│       ├── index.js          # Express app setup, middleware, port
│       ├── store.js          # In-memory data store and CRUD functions
│       └── routes/
│           └── expenses.js   # All /api/expenses route handlers
│
├── client/
│   ├── package.json
│   ├── vite.config.js        # Vite config + API proxy
│   ├── index.html
│   └── src/
│       ├── main.jsx          # ReactDOM entry
│       ├── App.jsx           # Root component, state management
│       ├── index.css         # Global styles
│       ├── hooks/
│       │   └── useExpenses.js   # Custom hook: all fetch logic lives here
│       ├── utils/
│       │   └── helpers.js       # formatCurrency, formatDate, constants
│       └── components/
│           ├── SummaryCards.jsx  # Top stats row
│           ├── CategoryChart.jsx # Recharts pie chart
│           ├── FiltersBar.jsx    # Category + date filters, CSV export
│           ├── ExpenseTable.jsx  # Main data table
│           ├── ExpenseModal.jsx  # Add/edit form in a modal
│           └── ConfirmDialog.jsx # Delete confirmation
│
├── package.json              # Convenience scripts
└── README.md
```

---

## Features Implemented

**Must Have ✅**

- Add expense with amount, category, date, and optional note
- View all expenses sorted by date (newest first)
- Edit and delete with confirmation prompt
- Filter by category and date range (this month / last month / custom)
- Summary panel: total this month, top category, highest expense

**Should Have ✅**

- Pie chart showing spending by category (Recharts)
- Currency formatting in Indian Rupees (Intl.NumberFormat)
- Form validation: no negative amounts, no future dates, category required

**Bonus ✅**

- Export filtered expenses as CSV download

---

## Next Steps

Things I would build next with more time:

- **Persistence** — swap the in-memory array for SQLite using `better-sqlite3`. The store.js interface is already abstracted so it would be a small change.
- **Budget per category** — let the user set a monthly limit per category and highlight it in red when exceeded.
- **Tests** — add a few Jest tests on the Express routes (validation, 404 handling, summary calculation logic).
- **Search** — a text input to filter expenses by note/category as you type.
- **Authentication** — even a simple username + bcrypt setup would make it multi-user ready.

---

## Notes

- I used Claude to help structure some boilerplate and CSS. Every line has been reviewed and I can walk through any part of the code in detail.
- Data resets on server restart because of the in-memory store — this is intentional for simplicity.
