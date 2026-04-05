# FinSight Dashboard

Welcome to **FinSight**, a modern, production-quality finance dashboard that I built to manage and visualize mock financial data with elegance and precision.  

🔗 **Live Demo:** https://finsight-dashboard-xi.vercel.app/dashboard

## Screenshots Using GoFullPage Extension

### Dashboard (Dark Mode)
<img width="1920" height="1776" alt="image" src="https://github.com/user-attachments/assets/d15349ef-1ace-4a3d-b06e-a8ed5eebe5e6" />

### Dashboard (Light Mode)
<img width="1920" height="1599" alt="image" src="https://github.com/user-attachments/assets/72564aef-8455-459d-a8c6-c9094ddea165" />

### Transactions - Viewer Role
<img width="1920" height="1389" alt="image" src="https://github.com/user-attachments/assets/24026d58-8035-43fd-9bdd-6d2e520f8bfb" />

### Transactions - Admin Role
<img width="1916" height="857" alt="image" src="https://github.com/user-attachments/assets/0019e52e-dc3b-46dd-9f0e-b5728442a8fc" />
<img width="679" height="720" alt="image" src="https://github.com/user-attachments/assets/04c77e96-d35a-44da-95ba-0c5d2dcbe771" />

*Admin role unlocks Add, Edit, and Delete controls*

### Insights
<img width="1920" height="1197" alt="image" src="https://github.com/user-attachments/assets/ce790593-33f6-4294-b047-740c91f436ed" />

> **Tip for reviewers:** To see the Admin role in action, switch the role  
> from the dropdown at the bottom of the sidebar from **Viewer → Admin**.  
> This unlocks the Add Transaction button and Edit/Delete controls on each row.

---

## 🎨 Why I Built This

I set out to build a dashboard that feels like a real, premium fintech product, rather than just another tutorial project. For me, finance tools should be snappy, visually stunning, and deeply informative. I wanted to craft an experience where you could simply toggle between "Admin" and "Viewer" to see how role-based features behave dynamically in memory, and seamlessly switch themes without a jarring flash of unstyled content. 

---

## 🛠 Tech Stack & My Rationale

- **Next.js 14+ (App Router):** I chose this because of its exceptional file-system routing and modern approach to React semantics. It keeps the architecture incredibly clean.
- **TypeScript (Strict):** Essential for production confidence. I typed the entire codebase completely—no `any`—to ensure that data structures like `Transaction` and `Category` are reliable everywhere.
- **Tailwind CSS:** I love styling with Tailwind because it allows me to build custom, dynamic designs right from the markup. Instead of slapping generic UI libraries on, I custom-styled everything—from the scrollbars to the responsive layout logic.
- **Recharts:** I selected Recharts for data visualization because it integrates beautifully with React. Setting up a gradient fill on a `LineChart` and custom tooltips with Tailwind classes was straightforward and powerful.
- **React Context API:** Since everything here relies on synchronous, mock, in-memory state, Context was the perfect lightweight solution. I avoided Redux because it was simply unnecessary overhead for this scale.
- **Lucide-react:** Clean, consistent SVG icons.
- **next-themes:** The only acceptable way to implement zero-flash dark mode in Next.js right now.

---

## ✨ Features

- **Dashboard:** At-a-glance KPIs (Income, Expenses, Savings Rate), a responsive 6-month Balance Trend chart, a Spending Breakdown donut chart, and a quick list of Recent Transactions.
- **Transactions Management:** A full-fledged table. You can search by merchant, filter by multiple categories, sort by date/amount, and paginate results.
- **Insights Page:** I engineered a custom analytics engine that parses the transactions on the fly to give you actionable insights (like MoM change, Top Category, and Best Saving Month), visualized next to a Monthly Comparison bar chart.
- **Role-Based Access Control (RBAC):** Switch between Viewer and Admin using the bottom-left sidebar toggle. As an Admin, you gain access to Add/Edit/Delete actions with full validation.
- **Persistence:** Edits persist through page reloads via `localStorage` synchronization injected directly into the App Context.
- **Theming:** Full comprehensive dark mode, utilizing a carefully selected slate/indigo palette to look sophisticated in both themes.

---

## 🚀 Setup & Local Execution

Getting this running on your local machine is simple:

```bash
# 1. Clone the repository
git clone https://github.com/[your-username]/finsight-dashboard.git
cd finsight-dashboard

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 📂 Folder Structure

I opted for a feature-based / component-focused architecture within `src/`:

```text
/src
  /app
    /dashboard         -> The main overview dashboard
    /transactions      -> Full table and management view
    /insights          -> Analytical charts and KPI logic
    layout.tsx         -> Global AppShell, Providers, and Fonts
  /components
    /charts            -> Recharts implementations (Balance, Spending, Comparison)
    /dashboard         -> Dashboard-specific modular pieces
    /layout            -> Sidebar, Navbar, ThemeToggle, RoleSwitcher
    /transactions      -> Table logic, Pagination, Modal forms
    /insights          -> Insight metric derivations
  /context
    AppContext.tsx     -> Global state and localStorage synchronizer
  /data
    mockData.ts        -> Generates 50 realistic historical mock transactions
  /lib
    utils.ts           -> Core helpers: groupByCategory, getMonthlyTotals, formatCurrency
  /types
    index.ts           -> Shared type definitions for the entire application
```

---

## 🧠 State Management & Design Decisions

### The State Container
I chose to encapsulate the global state in `AppContext.tsx`. The Context holds the master list of `transactions`, the current `filters` state (which determines what the table renders), and the active `role`. 

Every time a transaction is mutated (Add/Edit/Delete), it updates the local state array. To prevent data loss on a hard refresh, I added a hydration wrapper that serializes this state to `localStorage`!

### Design Aesthetics over Placeholders
I intentionally avoided standard wireframe placeholders. The chart tooltips mimic native OS floating overlays, the sidebar has a transparent mobile-backdrop, and numerical values utilize strict `Intl.NumberFormat` output. 

I used **Indigo** as the primary interactive accent, paired with **Emerald/Rose** to quickly convey positive/negative financial flows.

---




