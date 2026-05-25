<div align="center">

```
██████╗  █████╗ ███╗   ██╗██╗   ██╗███████╗███████╗██████╗
██╔══██╗██╔══██╗████╗  ██║██║   ██║██╔════╝██╔════╝██╔══██╗
██████╔╝███████║██╔██╗ ██║██║   ██║█████╗  █████╗  ██████╔╝
██╔══██╗██╔══██║██║╚██╗██║╚██╗ ██╔╝██╔══╝  ██╔══╝  ██╔══██╗
██║  ██║██║  ██║██║ ╚████║ ╚████╔╝ ███████╗███████╗██║  ██║
╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝  ╚═══╝  ╚══════╝╚══════╝╚═╝  ╚═╝

      ─────── A I   H R M S   S Y S T E M ───────
```

**A complete, browser-native Human Resource Management System.**  
Employees · Payroll · Attendance · Recruitment · CRM · and more — all in one place.

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![Zero Backend](https://img.shields.io/badge/Backend-None%20Required-brightgreen?style=flat-square)](#persistence)

</div>

---

## What is Ranveer AI HRMS?

Ranveer AI HRMS is a **fully client-side HR management platform** that covers the entire employee lifecycle — from recruitment and onboarding to payroll, leave management, performance tracking, and offboarding — without requiring a single server or database.

All data lives in `localStorage`. Drop it on any static host, share the URL, and your HR team is operational in minutes.

It also bundles a lightweight **CRM** (Leads, Accounts, Contacts) and a **Voice Agent** integration — making it a surprising amount of firepower for a zero-backend app.

---

## 🗺 Module Map

```
┌──────────────────────────────────────────────────────────────┐
│  HR CORE                                                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────────┐  │
│  │Employees │ │Attendance│ │  Leave   │ │    Payroll     │  │
│  │ profiles │ │clock-in/ │ │requests/ │ │ slips, salary  │  │
│  │ + CRUD   │ │ out log  │ │ approval │ │ breakdown, tax │  │
│  └──────────┘ └──────────┘ └──────────┘ └────────────────┘  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────────┐  │
│  │Recruitmt │ │Performnce│ │  Assets  │ │ Announcements  │  │
│  │jobs +    │ │  goals & │ │ assigned │ │  org-wide      │  │
│  │applicnts │ │ progress │ │ inventory│ │  broadcasts    │  │
│  └──────────┘ └──────────┘ └──────────┘ └────────────────┘  │
│                                                               │
│  OPERATIONS                                                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────────┐  │
│  │ Tickets  │ │ Calendar │ │ Reports  │ │    Settings    │  │
│  │ IT/HR/   │ │ events + │ │ saved &  │ │ org, theme,    │  │
│  │ Finance  │ │ remindrs │ │ favrites │ │ user prefs     │  │
│  └──────────┘ └──────────┘ └──────────┘ └────────────────┘  │
│                                                               │
│  CRM                                                          │
│  ┌──────────┐ ┌──────────┐                                   │
│  │  Leads   │ │ Accounts │  + Voice Agent Integration        │
│  │ pipeline │ │ + contct │                                   │
│  └──────────┘ └──────────┘                                   │
└──────────────────────────────────────────────────────────────┘
```

---

## ✨ Feature Highlights

### 👤 Employee Management
Full employee directory with rich profiles — department, designation, salary structure, join date, contact info, and status. Add, edit, and deactivate employees directly from the UI.

### 🕐 Attendance Tracking
Daily clock-in / clock-out log per employee. Filter by date, view present/absent/on-leave status at a glance. Admins see the full team view; employees see their own record.

### 📅 Leave Management
Employees apply for sick, casual, paid, or unpaid leave. HR gets a pending-approval queue. Full history with decision timestamps and approver attribution.

### 💰 Payroll
Per-employee monthly salary breakdown: basic, HRA, allowance, bonus, deductions, PF, and tax. One-click payslip generation. Pending vs. paid status tracking.

### 🎯 Recruitment Pipeline
Post jobs with location, experience requirements, and descriptions. Track applicants through stages: `Applied → Screening → Interview → Offer → Rejected`. Attach notes per applicant.

### 📊 Performance Goals
Set measurable goals per employee with deadlines and target metrics. Track progress (0–100%) visually. Admin can rate and leave feedback; employees can self-report progress.

### 🖥 Asset Inventory
Assign laptops, phones, and other equipment to employees. Track model, serial number, condition, and assignment date.

### 🎟 Helpdesk Tickets
Internal ticketing across IT, Facilities, Finance, and HR categories. Priority levels (low → critical), status tracking, threaded message history per ticket.

### 📢 Announcements
Broadcast messages to the whole org. Pin important notices. Rich text, timestamps, and author attribution.

### 📆 Calendar
Personal and shared event management. Add, edit, remove events. Visual monthly/weekly view.

### 📈 CRM: Leads & Accounts
Track inbound leads through the sales funnel with source, industry, revenue potential, and conversion status. Manage accounts and associated contacts.

### 📋 Reports
Create, organise, and favourite saved reports. Filter by module (Employee, Attendance, Leave, Payroll, Lead, etc.) and folder. Export to CSV.

### 🔊 Voice Agent
One-click redirect to the hosted Ranveer Voice Agent (`ranveer-voice-agent.netlify.app/phone`) for AI-powered HR interactions.

### 🔐 Auth System
Local login/signup with role-based access (`admin`, `hr`, `employee`). Password hashing via deterministic hash function. Session persisted in `localStorage`.

---

## 🏗 Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **React 18** | Component model, ecosystem |
| Language | **TypeScript 5.8** | Type safety across all data models |
| Build | **Vite 5** + SWC | Sub-second HMR, fast CI builds |
| Routing | **React Router v6** | File-based pages with protected routes |
| Styling | **TailwindCSS 3** | Utility-first, custom design tokens |
| Components | **shadcn/ui + Radix UI** | Accessible primitives, fully owned |
| Charts | **Recharts** | Pie, Bar, Line charts on the dashboard |
| Forms | **React Hook Form + Zod** | Validated forms with schema inference |
| Server state | **TanStack Query v5** | Async state, caching (future API-ready) |
| Persistence | **localStorage** | Zero-backend, works offline |
| Notifications | **Sonner** | Toast system |
| Testing | **Vitest + Testing Library** | Unit tests, jsdom environment |

---

## 📁 Project Structure

```
ranveer-ai-hrms-system/
│
├── src/
│   ├── pages/                      # One file per route / feature module
│   │   ├── Index.tsx               # Login page
│   │   ├── Signup.tsx
│   │   ├── ForgotPassword.tsx
│   │   ├── Dashboard.tsx           # KPIs, charts, activity feed
│   │   ├── Employees.tsx           # Employee directory + CRUD
│   │   ├── EmployeeProfile.tsx     # Individual employee detail
│   │   ├── Attendance.tsx          # Daily clock-in/out log
│   │   ├── Leave.tsx               # Leave request + approval workflow
│   │   ├── Payroll.tsx             # Salary slips + payroll runs
│   │   ├── Recruitment.tsx         # Jobs + applicant pipeline
│   │   ├── Performance.tsx         # Goals, progress tracking, ratings
│   │   ├── AssetsPage.tsx          # Hardware/asset inventory
│   │   ├── Tickets.tsx             # Internal helpdesk
│   │   ├── Announcements.tsx       # Org-wide broadcasts
│   │   ├── Leads.tsx               # CRM lead pipeline
│   │   ├── Accounts.tsx            # CRM accounts + contacts
│   │   ├── Reports.tsx             # Saved report library
│   │   ├── CalendarPage.tsx        # Event calendar
│   │   ├── Settings.tsx            # App + user preferences
│   │   └── NotFound.tsx
│   │
│   ├── components/
│   │   ├── Layout.tsx              # App shell — sidebar nav + top bar
│   │   ├── NavLink.tsx             # Active-state aware nav item
│   │   └── ui/                     # shadcn/ui component library (40+ files)
│   │
│   ├── lib/
│   │   ├── auth.ts                 # Login, signup, logout, role helpers
│   │   ├── storage.ts              # localStorage CRUD + CSV export
│   │   ├── mockData.ts             # Seed data (15 employees, full dataset)
│   │   └── utils.ts                # clsx/cn utility
│   │
│   ├── hooks/
│   │   ├── use-mobile.tsx          # Responsive breakpoint hook
│   │   └── use-toast.ts            # Toast trigger hook
│   │
│   ├── test/
│   │   ├── example.test.ts
│   │   └── setup.ts
│   │
│   ├── App.tsx                     # Route tree + auth guards
│   ├── main.tsx
│   └── index.css                   # Global styles + Tailwind base
│
├── vite.config.ts
├── vitest.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── components.json                 # shadcn/ui config
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** (or Bun 1.x)
- No database. No API keys. No environment variables required.

### Install & run

```bash
# Clone
git clone https://github.com/your-org/ranveer-ai-hrms-system.git
cd ranveer-ai-hrms-system

# Install (npm, yarn, or bun all work)
npm install

# Start dev server
npm run dev
# → http://localhost:5173
```

That's it. The app seeds itself with mock data on first load.

---

## 🔑 Demo Credentials

Three roles are pre-seeded and ready to use:

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@company.test` | `Password123!` |
| **HR Manager** | `hr@company.test` | `Password123!` |
| **Employee** | `emp@company.test` | `Password123!` |

> Role controls what you can see and do. Admins have full access; employees see only their own records.

---

## 💾 Persistence

All data is stored in `localStorage` under namespaced keys:

```
hr_employees        hr_attendance       hr_leaves
hr_payrolls         hr_jobs             hr_applicants
hr_tickets          hr_assets           hr_announcements
hr_performance      hr_leads            hr_accounts
hr_contacts         hr_reports          hr_calendar_events
hr_users            hr_settings         hr_current_user
```

**Resetting data:** Open DevTools → Application → Local Storage → clear keys prefixed with `hr_`. The app re-seeds on next load.

**Exporting:** Any list view with a **Download** button exports its current filtered data as CSV via the `exportCSV` utility in `lib/storage.ts`.

---

## 🔐 Role Permissions

| Feature | Employee | HR | Admin |
|---|:---:|:---:|:---:|
| View own profile | ✅ | ✅ | ✅ |
| View all employees | ❌ | ✅ | ✅ |
| Approve leave | ❌ | ✅ | ✅ |
| Run payroll | ❌ | ❌ | ✅ |
| Post jobs | ❌ | ✅ | ✅ |
| Manage assets | ❌ | ✅ | ✅ |
| View all tickets | ❌ | ✅ | ✅ |
| Manage leads/accounts | ❌ | ❌ | ✅ |
| Access settings | ❌ | partial | ✅ |

---

## 🧪 Testing

```bash
npm run test          # Run all tests once
npm run test:watch    # Watch mode
```

Tests use **Vitest** with **@testing-library/react** and a jsdom environment. Test files live in `src/test/`.

---

## 🏗 Building for Production

```bash
npm run build         # Outputs to dist/
npm run preview       # Preview the production build locally
```

The output is a fully static SPA — deploy to **Netlify**, **Vercel**, **GitHub Pages**, or any CDN. No server-side rendering needed.

---

## 🛠 Scripts

```bash
npm run dev           # Dev server with HMR
npm run build         # Production build
npm run build:dev     # Dev-mode build (source maps on)
npm run preview       # Serve dist/ locally
npm run lint          # ESLint
npm run test          # Vitest
npm run test:watch    # Vitest watch
```

---

## 🗺 Roadmap Ideas

- [ ] Supabase / Firebase backend option for multi-device sync
- [ ] Email notifications for leave approvals and payroll
- [ ] PDF payslip generation
- [ ] Advanced analytics dashboard with date-range filters
- [ ] Org chart visualiser
- [ ] Mobile app (React Native or PWA manifest)
- [ ] SSO / OAuth login

---

## 📄 License

MIT — free to use, modify, and distribute.

---

<div align="center">

Built under **RanveerAI** · Powered by React + Vite + TailwindCSS

*"Your whole HR stack, in one tab."*

</div>
