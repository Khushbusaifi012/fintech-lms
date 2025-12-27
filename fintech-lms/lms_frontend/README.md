# LMS Frontend (Vite + React)

Quick scaffold for a dashboard that consumes the Django API at `/api`.

Setup

```bash
cd lms_backend/frontend
npm install
npm run dev
```

The Vite dev server runs on `http://localhost:3000` and proxies `/api` to the Django backend at `http://127.0.0.1:8000` (see `vite.config.js`).

Next steps

- Add more pages/components for Applications, Collaterals, Loans.
- Implement auth (SimpleJWT recommended) and add token handling in `src/api.js`.
- Build with `npm run build` and either serve `dist` with Django static files or host separately.
