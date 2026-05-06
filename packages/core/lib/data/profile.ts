export type ProfileActivityType = "commit" | "review" | "deploy" | "comment" | "task" | "meeting";

export interface ProfileUser {
  id: string;
  firstName: string;
  lastName: string;
  initials: string;
  email: string;
  role: string;
  department: string;
  location: string;
  phone: string;
  bio: string;
  joinDate: string;
  website: string;
}

export interface ProfileStat {
  label: string;
  value: string;
  iconType: "projects" | "tasks" | "team" | "experience";
}

export interface ProfileSkill {
  name: string;
  level: number;
  color: string;
}

export interface ProfileActivity {
  id: string;
  type: ProfileActivityType;
  title: string;
  description: string;
  time: string;
  date: string;
}

export interface ProfileConnection {
  id: string;
  name: string;
  initials: string;
  role: string;
  department: string;
  status: "online" | "away" | "offline";
  mutualProjects: number;
}

// ── Current User ──

const currentUser: ProfileUser = {
  id: "me",
  firstName: "Aigars",
  lastName: "Silkalns",
  initials: "AS",
  email: "aigars@apex.dev",
  role: "Admin",
  department: "Engineering",
  location: "Riga, Latvia",
  phone: "+371 2000 0000",
  bio: "Founder at Colorlib. Building beautiful web templates and admin dashboards. Passionate about clean UI, open-source, and making the web more accessible. Over 6 years of experience shipping production-grade frontend applications with React, TypeScript, and modern CSS.",
  joinDate: "2020-03-15",
  website: "colorlib.com",
};

// ── Stats ──

const profileStats: ProfileStat[] = [
  { label: "Projects", value: "12", iconType: "projects" },
  { label: "Tasks Completed", value: "148", iconType: "tasks" },
  { label: "Team Members", value: "8", iconType: "team" },
  { label: "Experience", value: "6 yrs", iconType: "experience" },
];

// ── Skills ──

const profileSkills: ProfileSkill[] = [
  { name: "React", level: 95, color: "bg-chart-1" },
  { name: "TypeScript", level: 90, color: "bg-chart-2" },
  { name: "UI Design", level: 85, color: "bg-chart-3" },
  { name: "Node.js", level: 80, color: "bg-chart-4" },
  { name: "DevOps", level: 65, color: "bg-chart-5" },
];

// ── Activity (fixed timestamps to avoid hydration mismatch) ──

const profileActivities: ProfileActivity[] = [
  { id: "pa-1", type: "deploy", title: "Deployed v2.4.0 to production", description: "Includes Chat app, Email inbox, and File manager pages", time: "35 min ago", date: "2026-02-22" },
  { id: "pa-2", type: "review", title: "Reviewed PR #247 — Design token updates", description: "Sarah Chen's OKLCh color improvements for dark mode", time: "2 hours ago", date: "2026-02-22" },
  { id: "pa-3", type: "task", title: "Completed: File Manager page", description: "Grid/list views, folder navigation, upload dialog", time: "4 hours ago", date: "2026-02-22" },
  { id: "pa-4", type: "commit", title: "Fixed hydration mismatch in Chat and Mail", description: "Replaced dynamic timestamps with fixed ISO strings", time: "5 hours ago", date: "2026-02-22" },
  { id: "pa-5", type: "comment", title: "Commented on issue #312", description: "Suggested using TanStack Virtual for large table scroll performance", time: "Yesterday at 3:15 PM", date: "2026-02-21" },
  { id: "pa-6", type: "commit", title: "Merged PR #245 — Advanced form components", description: "8 new UI primitives including Calendar, DatePicker, and Combobox", time: "Yesterday at 11:00 AM", date: "2026-02-21" },
  { id: "pa-7", type: "deploy", title: "Deployed v2.3.8 hotfix", description: "Fixed density settings regression on stat cards", time: "Feb 20 at 4:30 PM", date: "2026-02-20" },
  { id: "pa-8", type: "task", title: "Completed: Email inbox page", description: "Folder navigation, compose dialog, bulk actions", time: "Feb 20 at 10:00 AM", date: "2026-02-20" },
  { id: "pa-9", type: "meeting", title: "Sprint 14 planning meeting", description: "Prioritized Phase 4 app pages and virtual scroll work", time: "Feb 18 at 9:00 AM", date: "2026-02-18" },
  { id: "pa-10", type: "review", title: "Reviewed PR #235 — TanStack Table migration", description: "Marcus Johnson's migration of Orders, Products, and Customers tables", time: "Feb 17 at 2:00 PM", date: "2026-02-17" },
];

// ── Connections (reusing names/roles from chat contacts) ──

const profileConnections: ProfileConnection[] = [
  { id: "contact-1", name: "Sarah Chen", initials: "SC", role: "Lead Designer", department: "Design", status: "online", mutualProjects: 5 },
  { id: "contact-2", name: "Marcus Johnson", initials: "MJ", role: "Frontend Dev", department: "Engineering", status: "online", mutualProjects: 8 },
  { id: "contact-3", name: "Priya Sharma", initials: "PS", role: "Product Manager", department: "Product", status: "away", mutualProjects: 6 },
  { id: "contact-4", name: "Alex Rivera", initials: "AR", role: "Backend Dev", department: "Engineering", status: "online", mutualProjects: 7 },
  { id: "contact-5", name: "Emma Taylor", initials: "ET", role: "QA Engineer", department: "Quality", status: "offline", mutualProjects: 4 },
  { id: "contact-6", name: "David Park", initials: "DP", role: "DevOps Engineer", department: "Infrastructure", status: "away", mutualProjects: 3 },
  { id: "contact-7", name: "Olivia Brown", initials: "OB", role: "Data Analyst", department: "Analytics", status: "offline", mutualProjects: 2 },
  { id: "contact-8", name: "Liam Murphy", initials: "LM", role: "Tech Lead", department: "Engineering", status: "offline", mutualProjects: 9 },
];

// ── Getter Functions ──

export function getProfileUser(): ProfileUser {
  return { ...currentUser };
}

export function getProfileStats(): ProfileStat[] {
  return [...profileStats];
}

export function getProfileSkills(): ProfileSkill[] {
  return [...profileSkills];
}

export function getProfileActivities(): ProfileActivity[] {
  return [...profileActivities];
}

export function getProfileConnections(): ProfileConnection[] {
  return [...profileConnections];
}
