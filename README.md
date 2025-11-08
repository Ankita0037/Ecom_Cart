# Ecom_Cart — Mock E‑Commerce Cart

This repository contains a full-stack mock e-commerce cart application built to satisfy the Vibe Commerce screening task.

Structure
- backend/: Node + Express + MongoDB API
- frontend/: React app (Create React App) with Tailwind CSS styling

Features
- GET /api/products — returns sample products
- GET /api/cart — returns cart with items and total
- POST /api/cart — add { productId, quantity }
- DELETE /api/cart/:id — remove item by product id
- POST /api/cart/checkout — mock checkout → returns receipt (total, timestamp)

Frontend
- Product grid with "Add to Cart"
- Cart sliding panel with quantity update, remove, total
- Checkout form (name/email) → shows receipt
- Responsive design using Tailwind CSS

Setup (Windows PowerShell)

1. Start the backend

```powershell
cd backend
npm install
# ensure MongoDB is running locally (or set MONGODB_URI in .env)
npm run start
```

The backend will run on http://localhost:5000 and will seed sample products on first run.

2. Start the frontend

```powershell
cd frontend
npm install
# If you want Tailwind to work, these dev dependencies are included in package.json.
npm start
```

The React app will run on http://localhost:3000 by default.

Notes
- Tailwind is configured (postcss + tailwind.config.js). After running `npm install` in `frontend`, CRA will pick up PostCSS and Tailwind.
- The backend uses a simple single-cart model (no auth) to keep the project focused on e‑com flows.

Deliverables to submit
- This GitHub repository (push to your account)
- README with setup and explanation (this file)
- A 1–2 minute demo video (Loom/YouTube unlisted) showing adding items, updating quantities, and checkout

If you want, I can:
- Add scripts to build/deploy or Dockerfiles
- Improve form validation and add tests
- Integrate Fake Store API as an alternate product source

---
I updated the frontend components to use Tailwind and wired them to the backend API. Start both servers and open the React app to try it. If you want, I can now run quick checks (install & start) here or add unit tests.
