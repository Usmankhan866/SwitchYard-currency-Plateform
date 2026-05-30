# Admindek — Premium Admin Dashboard Template

A feature-rich, production-ready admin dashboard built with **Next.js 16**, **React 19**, **TypeScript**, and **Tailwind CSS**. Ships with 80+ pages, 9 dashboard variants, e-commerce vertical, full auth flows, and comprehensive documentation.

![Admindek Dashboard](packages/nextjs/public/screenshots/dashboard-analytics.png)

## Quick Start

```bash
pnpm install
pnpm dev
```


Open [http://localhost:3000](http://localhost:3000) to see the dashboard.

## What's Included

### 9 Dashboard Variants
Analytics, CRM, eCommerce, Finance, Crypto, Project, SaaS, HR, Marketing — each with interactive date range toggles, live KPI cards, and chart data switching.

### E-commerce Vertical
Product List with filters/sort/grid-list view, Product Detail with tabs and reviews, Shopping Cart with order summary, Order History with DataTable, and Wishlist — all connected via shared React context.

### Full Auth System (18 Pages)
Login, Register, Forgot Password, Reset Password, Verify Email (OTP), Two-Factor Auth, Lock Screen, Account Disabled, Password Changed — each in 2 layout variants (centered card + split-screen branded panel).

### Error & Utility Pages (9 Pages)
404, 500, 403, Maintenance, Coming Soon, Under Construction, Offline, Session Expired, Rate Limited — each with unique visuals and interactive elements.

### Application Pages
- **Users** — Full CRUD with DataTable, add/edit/view/delete dialogs, bulk actions
- **Invoices** — Full CRUD with clickable status badges, live sidebar stats
- **Chat, Email, Calendar, File Manager, Task Board** — Interactive demo pages
- **Notifications** — Category tabs, mark-read, dismiss with animations
- **Gallery** — Category filter with lightbox

### Forms
- **Form Wizard** — Reusable Stepper component (horizontal + vertical), 3 demos: Checkout, Account Setup, Job Application
- **Rich Text Editor** — Tiptap-based with full and minimal toolbar variants
- **Form Elements** — Complete input showcase

### UI Components
- 35+ shadcn/ui components built on Radix UI
- TanStack Data Tables with sort, filter, paginate, CSV export
- ApexCharts with 10 chart types and legend toggle
- Accordion, Icon Browser (170 Lucide icons), Pricing page

### Customization
- **Theme Customizer** — 10 color presets, dark/light/system mode, sidebar theme
- **RTL Support** — Full right-to-left layout
- **i18n** — English, German, French with sidebar + header wired
- **Command Palette** — Cmd+K quick navigation

### Landing Page
Marketing page with 9 sections: hero, stats counter, features grid, interactive dashboard preview, tech stack logos, testimonials, pricing, FAQ accordion, CTA footer.

### Documentation
13-page built-in docs covering installation, theming, components, charts, i18n, e-commerce, form wizard, rich text editor, and deployment.

## Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 16 | React framework with App Router |
| React | 19 | UI library |
| TypeScript | 6 | Type safety |
| Tailwind CSS | 4 | Utility-first styling |
| Radix UI | Latest | Accessible UI primitives |
| TanStack Table | 8 | Advanced data tables |
| ApexCharts | 5 | Interactive charts |
| Tiptap | 2 | Rich text editor |
| React Hook Form | 7 | Form handling |
| Zod | 4 | Schema validation |
| Framer Motion | 12 | Animations |
| Sonner | 2 | Toast notifications |
| Lucide | 1 | Icon library |


## Project Structure

```
admindek/
├── packages/
│   ├── theme/          # Shared SCSS design system (@admindek/theme)
│   ├── html/           # HTML/Bootstrap template (@admindek/html)
│   └── nextjs/         # Next.js application (@admindek/nextjs)
├── package.json        # Monorepo root
├── pnpm-workspace.yaml
└── README.md
```

## Commands

```bash
pnpm install              # Install all workspace dependencies
pnpm dev                  # Start Next.js dev server (localhost:3000)
pnpm build                # Build all packages
pnpm preview              # Preview production build


# Package-specific
pnpm --filter @admindek/nextjs dev
pnpm --filter @admindek/nextjs build
pnpm --filter @admindek/html dev
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License - see [LICENSE](LICENSE) for details.

## Credits

Built by [DashboardPack](https://dashboardpack.com) | Powered by [Colorlib](https://colorlib.com)
