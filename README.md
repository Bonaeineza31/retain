# Retain

A personal expense and budget manager. Record what you spend, set a monthly budget, and see where your money goes. All amounts are in Rwandan francs (RWF).

**Live app:** 

## Features

**Users**
- Sign up, sign in, sign out
- Create, view, update and delete expenses (title, amount, category, date, payment method, optional notes)
- Search, filter (category, payment method, date, amount) and sort (date, amount) expenses
- Paginated expense list
- Set a monthly budget and track total spent, remaining amount, and whether you are within, approaching or over budget
- Dashboard: monthly spending, remaining budget, highest expense, spending by category, recent expenses

**Admins**
- Create, update and delete expense categories (expenses of a deleted category move to "Uncategorized")
- Platform insights: user and expense totals, spending per category, top and bottom 5 categories, recent expenses and recent users

## Plan

We are building this in small steps, frontend first.

1. **Frontend** (`frontend/`), built against a mock data layer so the UI can be finished on its own
2. **Backend** (`backend/`), a REST API with MongoDB
3. **Integration**, replacing the mock data layer with the real API
4. **Deployment**

## Tech stack

| Part | Technology |
| --- | --- |
| Frontend | React, TypeScript, Vite, Material-UI |
| Auth state | React Context |
| Filter, search and sort state | Redux Toolkit |
| Backend | Node.js, MongoDB |

## Project structure

```
retain-1/
├── frontend/   React + TypeScript app
├── backend/    Node.js API
└── README.md
```

## Setup


## API

