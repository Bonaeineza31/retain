# Retain

A personal expense and budget manager. Record what you spend, set a monthly budget, and see where your money goes. All amounts are in Rwandan francs (RWF).

- **Live app:** https://retain-kappa.vercel.app
- **Live API:** https://retain-m7f1.onrender.com
- **API documentation (Swagger):** https://retain-m7f1.onrender.com/api/docs/

## Features

**Users**
- Sign up, sign in, sign out
- Create, view, update and delete expenses (title, amount, category, date, payment method, optional notes)
- Search, filter (category, payment method, date, amount) and sort (date, amount) expenses
- Paginated expense list
- Set a monthly budget and track total spent, remaining amount, and whether you are within, approaching or over budget
- Dashboard: monthly spending, remaining budget, highest expense, spending by category, recent expenses
- Notifications (bell in the top bar) when a budget is set, and when spending is approaching or over the budget
- Light and dark mode: starts with the device setting, and the choice is remembered

**Admins**
- Create, update and delete expense categories (expenses of a deleted category move to "Uncategorized")
- Browse all registered users and the expenses of all users, with search and pages
- Notifications when a new user registers
- Platform insights: user and expense totals, spending per category, top and bottom 5 categories, recent expenses and recent users

## Built with

| Part | Folder | Technology |
| --- | --- | --- |
| Frontend | `frontend/` | React, TypeScript, Vite, Material-UI. React Context for sign in, Redux Toolkit for search, filters and sorting |
| Backend | `backend/` | Node.js, Express, MongoDB with Mongoose. JWT tokens, bcrypt for passwords, Swagger for the API docs |

## Run it on your computer

You need Node.js 20 or newer and a MongoDB database.

**1. The backend**

```
cd backend
npm install
```

Copy `.env.example` to `.env` and fill in `MONGODB_URI` and `JWT_SECRET`. Then run `npm run dev`. The API runs at http://localhost:3000.

**2. The frontend**

```
cd frontend
npm install
```

Copy `.env.example` to `.env`. `VITE_BACKEND_URL` is the address of the backend: the live one, or `http://localhost:3000`. Then run `npm run dev` and open http://localhost:5173. Other commands: `npm run build` and `npm run lint`.

## Trying the admin features

New accounts are always normal users, so nobody can make themselves an admin from the app.

- **On your computer:** sign up in the app. Then in MongoDB, open the `users` collection and change the `role` of your account from `user` to `admin`. In the shell this is `db.users.updateOne({ email: "you@example.com" }, { $set: { role: "admin" } })`. Sign out and sign in again, and the Admin menu appears.
- **On the live app:** the details of an admin account are given to the instructor with the submission. They are not written here, because the admin pages list the name and email of every registered user.

## API

Every endpoint is listed, and can be tried, on the Swagger page linked above. On your computer it is at http://localhost:3000/api/docs. Protected routes need the header `Authorization: Bearer <token>`, with the token from login.
