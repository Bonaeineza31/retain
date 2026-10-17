# Retain

A personal expense and budget manager. Record what you spend, set a monthly budget, and see where your money goes. All amounts are in Rwandan francs (RWF).

**Live app:** https://retain-kappa.vercel.app

**Live API:** https://retain-m7f1.onrender.com (documentation: https://retain-m7f1.onrender.com/api/docs/)



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

### Frontend

You need Node.js 20 or newer.

```
cd frontend
npm install
```

Copy `.env.example` to `.env`. It holds `VITE_BACKEND_URL`, the address of the backend. Use the live one, or `http://localhost:3000` if you run the backend yourself. Then run `npm run dev` and open the address the terminal prints (usually http://localhost:5173).

Other commands: `npm run build` makes a production build, and `npm run lint` checks the code.

Create an account on the sign up page to start. All the data comes from the backend.

### Backend

You need Node.js 20 or newer and a MongoDB database (a free MongoDB Atlas cluster works).

```
cd backend
npm install
```

Copy `.env.example` to `.env` and fill in `MONGODB_URI` and `JWT_SECRET`. Then run `npm run dev`.

New accounts are always normal users. To make an admin, change a user's `role` to `admin` in the `users` collection in MongoDB.

## API

The API is documented with Swagger: https://retain-m7f1.onrender.com/api/docs/. It lists every endpoint and lets you try them. On your own computer, it is at http://localhost:3000/api/docs.

Protected routes need the header `Authorization: Bearer <token>`, with the token from login.

