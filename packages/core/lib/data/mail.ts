export type EmailLabel = "personal" | "work" | "important" | "updates";
export type EmailFolder = "inbox" | "sent" | "drafts" | "trash" | "starred";

export interface Email {
  id: string;
  from: { name: string; email: string; initials: string };
  to: string;
  subject: string;
  body: string;
  preview: string;
  folder: Exclude<EmailFolder, "starred">;
  labels: EmailLabel[];
  read: boolean;
  starred: boolean;
  hasAttachment: boolean;
  date: string;
}

// ── Fixed timestamps (anchored to Feb 22 2026 to avoid SSR hydration mismatch) ──

// ── Mock Emails ──

let nextEmailId = 100;

let emails: Email[] = [
  // Inbox — unread
  {
    id: "mail-1",
    from: { name: "Sarah Chen", email: "sarah@apex.dev", initials: "SC" },
    to: "aigars@apex.dev",
    subject: "Updated design tokens for the dashboard",
    body: "Hi Aigars,\n\nI've finished updating the OKLCh color tokens across all components. The new palette has better contrast ratios in dark mode.\n\nKey changes:\n- Primary hue shifted from 160 to 165 for better readability\n- Added semantic tokens for success/warning states\n- Chart colors now have consistent lightness values\n\nCan you review the PR when you get a chance? It's #247.\n\nThanks,\nSarah",
    preview: "I've finished updating the OKLCh color tokens across all components...",
    folder: "inbox",
    labels: ["work"],
    read: false,
    starred: true,
    hasAttachment: false,
    date: "2026-02-22T13:00:00.000Z",
  },
  {
    id: "mail-2",
    from: { name: "Marcus Johnson", email: "marcus@apex.dev", initials: "MJ" },
    to: "aigars@apex.dev",
    subject: "TanStack Table v9 migration plan",
    body: "Hey,\n\nI've been looking into the TanStack Table v9 release notes. There are some breaking changes we should be aware of:\n\n1. Row model API has changed significantly\n2. Column definitions now use a builder pattern\n3. Virtual scroll is now a separate package\n\nI'd suggest we hold off on upgrading until after the current sprint. We can plan the migration for Sprint 15.\n\nLet me know your thoughts.\n\nMarcus",
    preview: "I've been looking into the TanStack Table v9 release notes...",
    folder: "inbox",
    labels: ["work", "important"],
    read: false,
    starred: false,
    hasAttachment: false,
    date: "2026-02-22T11:00:00.000Z",
  },
  {
    id: "mail-3",
    from: { name: "Priya Sharma", email: "priya@apex.dev", initials: "PS" },
    to: "aigars@apex.dev",
    subject: "Q1 roadmap review — action items",
    body: "Hi team,\n\nFollowing up on our roadmap review yesterday. Here are the action items:\n\n- Aigars: Complete Phase 4 app pages (Chat, Email, File Manager)\n- Marcus: Virtual scroll implementation for large data tables\n- Sarah: Component library documentation refresh\n- Alex: API layer architecture proposal\n\nDeadline for all items: End of February.\n\nPlease update the Kanban board with your estimates.\n\nBest,\nPriya",
    preview: "Following up on our roadmap review yesterday. Here are the action items...",
    folder: "inbox",
    labels: ["important"],
    read: false,
    starred: true,
    hasAttachment: true,
    date: "2026-02-22T09:00:00.000Z",
  },
  {
    id: "mail-4",
    from: { name: "Alex Rivera", email: "alex@apex.dev", initials: "AR" },
    to: "aigars@apex.dev",
    subject: "Re: Notification API endpoints",
    body: "Aigars,\n\nThe notification endpoints are now deployed to staging. Here's the base URL:\n\nhttps://api.staging.apex.dev/v1/notifications\n\nEndpoints available:\n- GET /notifications — list all (supports ?filter=unread)\n- PATCH /notifications/:id — mark as read\n- POST /notifications/mark-all-read\n- GET /notifications/count — unread count\n\nAll responses follow our standard envelope format. Let me know if you hit any issues.\n\nAlex",
    preview: "The notification endpoints are now deployed to staging...",
    folder: "inbox",
    labels: ["work"],
    read: false,
    starred: false,
    hasAttachment: false,
    date: "2026-02-22T06:00:00.000Z",
  },
  {
    id: "mail-5",
    from: { name: "GitHub", email: "notifications@github.com", initials: "GH" },
    to: "aigars@apex.dev",
    subject: "[DashboardPack/apex-dashboard] PR #245 merged",
    body: "Pull request #245 has been merged.\n\nTitle: feat: add advanced form components (Phase 2)\nAuthor: aigars\nReviewed by: sarah-chen, marcus-j\n\nFiles changed: 12\nAdditions: 1,847\nDeletions: 23\n\nThis PR adds 8 new UI primitives (Calendar, DatePicker, Combobox, MultiSelect, InputOTP, ColorPicker, PhoneInput, FileUpload) and a Forms showcase page.\n\nView on GitHub: https://github.com/DashboardPack/apex-dashboard/pull/245",
    preview: "Pull request #245 has been merged. Title: feat: add advanced form components...",
    folder: "inbox",
    labels: ["updates"],
    read: false,
    starred: false,
    hasAttachment: false,
    date: "2026-02-21T14:30:00.000Z",
  },
  // Inbox — read
  {
    id: "mail-6",
    from: { name: "Emma Taylor", email: "emma@apex.dev", initials: "ET" },
    to: "aigars@apex.dev",
    subject: "QA report: Density settings regression",
    body: "Hi Aigars,\n\nDuring the latest QA pass, I found a regression with the density settings:\n\n- Card padding is being overridden on stat cards that don't have a CardHeader\n- The compact density makes the table rows too tight on mobile\n\nI've documented the steps to reproduce in the ticket. Priority is medium since it only affects the settings page flow.\n\nLet me know if you need more details.\n\nEmma",
    preview: "During the latest QA pass, I found a regression with the density settings...",
    folder: "inbox",
    labels: ["work"],
    read: true,
    starred: false,
    hasAttachment: false,
    date: "2026-02-21T09:15:00.000Z",
  },
  {
    id: "mail-7",
    from: { name: "David Park", email: "david@apex.dev", initials: "DP" },
    to: "aigars@apex.dev",
    subject: "Cloudflare Pages deployment config",
    body: "Hey Aigars,\n\nI've looked into the auto-deploy setup for Cloudflare Pages. Here's what we need:\n\n1. Connect the GitHub repo in the CF dashboard\n2. Set build command: npm run build\n3. Set output directory: out\n4. Add environment variables for any API keys\n\nThe manual wrangler deploy is working fine for now, but auto-deploy would save us 2-3 minutes per deployment.\n\nWant me to set it up?\n\nDavid",
    preview: "I've looked into the auto-deploy setup for Cloudflare Pages...",
    folder: "inbox",
    labels: ["work"],
    read: true,
    starred: true,
    hasAttachment: false,
    date: "2026-02-20T11:00:00.000Z",
  },
  {
    id: "mail-8",
    from: { name: "Liam Murphy", email: "liam@apex.dev", initials: "LM" },
    to: "aigars@apex.dev",
    subject: "Architecture review: State management approach",
    body: "Team,\n\nI want to open a discussion about our state management approach before we add more app pages.\n\nCurrently we're using:\n- Module-level mutable arrays for mock data\n- useState + forceUpdate pattern for reactivity\n- No global state management library\n\nThis works well for the demo, but if we ever add real API integration, we'll need something like TanStack Query or SWR.\n\nProposal: Keep the current approach for now, but structure our data layer so it can be swapped to API calls later without changing the UI components.\n\nThoughts?\n\nLiam",
    preview: "I want to open a discussion about our state management approach...",
    folder: "inbox",
    labels: ["work", "important"],
    read: true,
    starred: false,
    hasAttachment: false,
    date: "2026-02-19T15:30:00.000Z",
  },
  {
    id: "mail-9",
    from: { name: "Olivia Brown", email: "olivia@apex.dev", initials: "OB" },
    to: "aigars@apex.dev",
    subject: "Analytics dashboard data refresh",
    body: "Hi Aigars,\n\nI've updated the mock analytics data to reflect more realistic patterns:\n\n- Revenue shows seasonal trends (Q4 spike)\n- User growth follows a logarithmic curve\n- Traffic sources are weighted toward organic/direct\n- Conversion rates correlate with marketing spend\n\nThe data is in the analytics.ts file. I also added chart-5 color token usage for the new scatter plot.\n\nOlivia",
    preview: "I've updated the mock analytics data to reflect more realistic patterns...",
    folder: "inbox",
    labels: ["updates"],
    read: true,
    starred: false,
    hasAttachment: true,
    date: "2026-02-18T10:00:00.000Z",
  },
  {
    id: "mail-10",
    from: { name: "Stripe", email: "receipts@stripe.com", initials: "ST" },
    to: "aigars@apex.dev",
    subject: "Your invoice from DashboardPack — $49.00",
    body: "Invoice #INV-2026-0214\n\nDashboardPack Pro Plan\nPeriod: Feb 1 - Feb 28, 2026\nAmount: $49.00\n\nPayment method: Visa ending in 4242\nStatus: Paid\n\nView your invoice: https://dashboard.stripe.com/invoices/INV-2026-0214\n\nThank you for your business.",
    preview: "Invoice #INV-2026-0214 — DashboardPack Pro Plan, $49.00...",
    folder: "inbox",
    labels: ["personal"],
    read: true,
    starred: false,
    hasAttachment: true,
    date: "2026-02-17T08:00:00.000Z",
  },
  // Sent
  {
    id: "mail-11",
    from: { name: "Aigars Silkalns", email: "aigars@apex.dev", initials: "AS" },
    to: "sarah@apex.dev",
    subject: "Re: Updated design tokens for the dashboard",
    body: "Sarah,\n\nLooks great! I'll review PR #247 this afternoon. The OKLCh improvements sound solid.\n\nOne question — did you test the new tokens with all 6 color presets in settings? I want to make sure they work across all themes.\n\nThanks,\nAigars",
    preview: "Looks great! I'll review PR #247 this afternoon...",
    folder: "sent",
    labels: [],
    read: true,
    starred: false,
    hasAttachment: false,
    date: "2026-02-22T13:30:00.000Z",
  },
  {
    id: "mail-12",
    from: { name: "Aigars Silkalns", email: "aigars@apex.dev", initials: "AS" },
    to: "team@apex.dev",
    subject: "Phase 4 progress update",
    body: "Team,\n\nQuick update on Phase 4 progress:\n\n✅ Chat app — Complete (6 conversations, auto-reply, mobile responsive)\n🔄 Email/Inbox — In progress\n⏳ File Manager — Next up\n⏳ User Profile — After file manager\n\nWe're on track for the end-of-February deadline. Chat turned out really well — the typing indicator and auto-reply simulation make it feel very realistic.\n\nWill share a demo link once Email is done.\n\nAigars",
    preview: "Quick update on Phase 4 progress: Chat app complete, Email in progress...",
    folder: "sent",
    labels: ["work"],
    read: true,
    starred: false,
    hasAttachment: false,
    date: "2026-02-21T16:00:00.000Z",
  },
  {
    id: "mail-13",
    from: { name: "Aigars Silkalns", email: "aigars@apex.dev", initials: "AS" },
    to: "david@apex.dev",
    subject: "Re: Cloudflare Pages deployment config",
    body: "David,\n\nYes, please go ahead and set up auto-deploy. The manual wrangler flow works but it's one more step we can eliminate.\n\nCredentials are in the shared vault. Account ID: 1f543c93...\n\nThanks!\nAigars",
    preview: "Yes, please go ahead and set up auto-deploy...",
    folder: "sent",
    labels: [],
    read: true,
    starred: false,
    hasAttachment: false,
    date: "2026-02-20T14:00:00.000Z",
  },
  // Drafts
  {
    id: "mail-14",
    from: { name: "Aigars Silkalns", email: "aigars@apex.dev", initials: "AS" },
    to: "liam@apex.dev",
    subject: "Re: Architecture review: State management approach",
    body: "Liam,\n\nGreat points. I agree we should keep the current approach but prepare for API integration.\n\nHere's my proposal:\n- Keep module-level data for the demo/template version\n- Add a data provider abstraction layer\n- Document the swap-out pattern in the docs\n\nThis way customers can",
    preview: "Great points. I agree we should keep the current approach but prepare...",
    folder: "drafts",
    labels: [],
    read: true,
    starred: false,
    hasAttachment: false,
    date: "2026-02-20T16:30:00.000Z",
  },
  {
    id: "mail-15",
    from: { name: "Aigars Silkalns", email: "aigars@apex.dev", initials: "AS" },
    to: "",
    subject: "February newsletter draft",
    body: "Subject: Apex Dashboard — February Update\n\nHi there,\n\nExciting updates this month:\n\n1. TanStack Table migration complete\n2. 8 new form components\n3. Chat app with real-time simulation\n4. Collapsible sidebar navigation\n\nComing soon: Email inbox, File manager, User profiles\n\n",
    preview: "Apex Dashboard — February Update. Exciting updates this month...",
    folder: "drafts",
    labels: ["personal"],
    read: true,
    starred: false,
    hasAttachment: false,
    date: "2026-02-19T20:00:00.000Z",
  },
  // Trash
  {
    id: "mail-16",
    from: { name: "No Reply", email: "noreply@marketing.io", initials: "NR" },
    to: "aigars@apex.dev",
    subject: "🎉 You won't believe this limited offer!",
    body: "Dear valued customer,\n\nFor a limited time only, get 90% off our premium plan...\n\nThis is clearly spam and has been moved to trash.",
    preview: "For a limited time only, get 90% off our premium plan...",
    folder: "trash",
    labels: [],
    read: true,
    starred: false,
    hasAttachment: false,
    date: "2026-02-16T12:00:00.000Z",
  },
];

// ── CRUD Functions ──

export function getEmails(folder?: EmailFolder, search?: string): Email[] {
  let result = [...emails];

  if (folder === "starred") {
    result = result.filter((e) => e.starred);
  } else if (folder) {
    result = result.filter((e) => e.folder === folder);
  }

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (e) =>
        e.subject.toLowerCase().includes(q) ||
        e.from.name.toLowerCase().includes(q) ||
        e.preview.toLowerCase().includes(q)
    );
  }

  return result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getEmail(id: string): Email | undefined {
  return emails.find((e) => e.id === id);
}

export function getFolderCounts(): Record<EmailFolder, number> {
  return {
    inbox: emails.filter((e) => e.folder === "inbox" && !e.read).length,
    sent: emails.filter((e) => e.folder === "sent").length,
    drafts: emails.filter((e) => e.folder === "drafts").length,
    trash: emails.filter((e) => e.folder === "trash").length,
    starred: emails.filter((e) => e.starred).length,
  };
}

export function markAsRead(id: string): void {
  emails = emails.map((e) => (e.id === id ? { ...e, read: true } : e));
}

export function markAllRead(folder: EmailFolder): void {
  emails = emails.map((e) => {
    if (folder === "starred") return e.starred ? { ...e, read: true } : e;
    return e.folder === folder ? { ...e, read: true } : e;
  });
}

export function toggleStar(id: string): void {
  emails = emails.map((e) => (e.id === id ? { ...e, starred: !e.starred } : e));
}

export function moveToTrash(id: string): void {
  emails = emails.map((e) => (e.id === id ? { ...e, folder: "trash" as const } : e));
}

export function bulkMoveToTrash(ids: string[]): void {
  const idSet = new Set(ids);
  emails = emails.map((e) => (idSet.has(e.id) ? { ...e, folder: "trash" as const } : e));
}

export function bulkMarkRead(ids: string[]): void {
  const idSet = new Set(ids);
  emails = emails.map((e) => (idSet.has(e.id) ? { ...e, read: true } : e));
}

export function sendEmail(to: string, subject: string, body: string): Email {
  const newEmail: Email = {
    id: `mail-${nextEmailId++}`,
    from: { name: "Aigars Silkalns", email: "aigars@apex.dev", initials: "AS" },
    to,
    subject,
    body,
    preview: body.slice(0, 80) + (body.length > 80 ? "..." : ""),
    folder: "sent",
    labels: [],
    read: true,
    starred: false,
    hasAttachment: false,
    date: new Date().toISOString(),
  };
  emails = [newEmail, ...emails];
  return newEmail;
}

export function saveDraft(to: string, subject: string, body: string): Email {
  const newEmail: Email = {
    id: `mail-${nextEmailId++}`,
    from: { name: "Aigars Silkalns", email: "aigars@apex.dev", initials: "AS" },
    to,
    subject: subject || "(No subject)",
    body,
    preview: body.slice(0, 80) + (body.length > 80 ? "..." : ""),
    folder: "drafts",
    labels: [],
    read: true,
    starred: false,
    hasAttachment: false,
    date: new Date().toISOString(),
  };
  emails = [newEmail, ...emails];
  return newEmail;
}
