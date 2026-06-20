# myfininsight — Frontend

> **Your finances, finally clear.**

Personal finance dashboard for Indian consumers. Manually log transactions, track monthly spend, and understand where your money goes.

Live: deployed on Vercel.

---

## Features (Phase 1)

- Sign up / log in (email + Google OAuth)
- Manually log income and expense transactions
- Monthly expense summary cards
- Daily spending bar chart
- Category breakdown (donut chart)
- Top merchants
- Full transaction list with filters
- Net worth tracker (assets & liabilities over time)
- Demo mode — explore the dashboard without an account

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 19 + TypeScript |
| Build tool | Vite (SWC) |
| State | Redux Toolkit |
| Routing | React Router v7 |
| Charts | ECharts (`echarts-for-react`) |
| Styling | Tailwind CSS v4 |
| HTTP | Axios (singleton `axiosInstance`) |
| Validation | Zod |
| Animations | Framer Motion |
| Deploy | Vercel |

---

## Local Dev Setup

### Prerequisites

- Node.js ≥ 20
- npm

### Install

```bash
git clone https://github.com/<your-org>/Expense-Tracker-Frontend.git
cd Expense-Tracker-Frontend
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_BACKEND_BASE_URL=http://localhost:8000
```

| Variable | Description |
|---|---|
| `VITE_BACKEND_BASE_URL` | Base URL of the myfininsight backend API |

### Run Dev Server

```bash
npm run dev
```

App runs at `http://localhost:5173` by default.

---

## Build

```bash
npm run build
```

Output goes to `dist/`. Preview the production build locally:

```bash
npm run preview
```

---

## Deploy (Vercel)

1. Connect the repo to a Vercel project.
2. Set `VITE_BACKEND_BASE_URL` in **Vercel → Settings → Environment Variables**.
3. Vercel auto-detects Vite — no extra config needed.
4. SPA routing is handled via `vercel.json` (all routes rewrite to `/`).

---

## Folder Structure

```
src/
├── api/                   # Axios instance + API helpers
├── components/
│   ├── charts/            # Reusable ECharts wrappers (bar, donut)
│   ├── common/            # Modal, Loader, ConfirmModal
│   ├── dashboardContainer/# Main dashboard widgets (snapshot, trends)
│   ├── expenseDashboard/  # Expense-specific widgets
│   └── networthContainer/ # Net worth table + charts
├── hooks/
│   └── useApi.tsx         # Generic fetch hook (loading/error/data)
├── pages/
│   ├── demo/              # Demo mode (no auth required)
│   ├── expenses/          # Expense dashboard page
│   ├── netWorthPage/      # Net worth page
│   ├── admin/             # Admin panel
│   └── AccountManger/     # Account settings
├── routes/                # App routes + ProtectedRoutes guard
├── store/                 # Redux slices (auth, account)
├── utils/                 # Currency formatter, constants, auth helpers
└── validation/            # Zod schemas (login, signup)
```

---

## Related

- **Backend repo:** <!-- add link when available -->
- **Design / product decisions:** tracked in project conversations
