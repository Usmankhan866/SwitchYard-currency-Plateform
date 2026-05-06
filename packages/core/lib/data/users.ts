import type { User, UserRole, UserStatus } from "./types";

export const users: User[] = [
  { id: "usr-1", name: "Aigars Silkalns", email: "aigars@company.com", initials: "AS", role: "admin", status: "active", department: "Engineering", joinDate: "Jan 5, 2025", lastActive: "2 hours ago", permissions: ["users.manage", "orders.manage", "products.manage", "settings.manage", "billing.manage"] },
  { id: "usr-2", name: "Emma Wilson", email: "emma@company.com", initials: "EW", role: "editor", status: "active", department: "Marketing", joinDate: "Feb 12, 2025", lastActive: "5 min ago", permissions: ["orders.view", "products.manage", "customers.view"] },
  { id: "usr-3", name: "James Chen", email: "james@company.com", initials: "JC", role: "admin", status: "active", department: "Engineering", joinDate: "Mar 1, 2025", lastActive: "1 hour ago", permissions: ["users.manage", "orders.manage", "products.manage", "settings.manage", "billing.manage"] },
  { id: "usr-4", name: "Sofia Garcia", email: "sofia@company.com", initials: "SG", role: "moderator", status: "active", department: "Support", joinDate: "Mar 15, 2025", lastActive: "30 min ago", permissions: ["orders.view", "customers.view", "customers.manage", "support.manage"] },
  { id: "usr-5", name: "Alex Thompson", email: "alex@company.com", initials: "AT", role: "viewer", status: "active", department: "Sales", joinDate: "Apr 2, 2025", lastActive: "3 hours ago", permissions: ["orders.view", "products.view", "customers.view"] },
  { id: "usr-6", name: "Maria Santos", email: "maria@company.com", initials: "MS", role: "editor", status: "active", department: "Design", joinDate: "Apr 18, 2025", lastActive: "1 day ago", permissions: ["products.manage", "products.view"] },
  { id: "usr-7", name: "David Kim", email: "david@company.com", initials: "DK", role: "viewer", status: "inactive", department: "Finance", joinDate: "May 5, 2025", lastActive: "2 weeks ago", permissions: ["orders.view", "billing.view"] },
  { id: "usr-8", name: "Lisa Park", email: "lisa@company.com", initials: "LP", role: "editor", status: "active", department: "Marketing", joinDate: "May 20, 2025", lastActive: "10 min ago", permissions: ["orders.view", "products.manage", "customers.view"] },
  { id: "usr-9", name: "Ryan Mitchell", email: "ryan@company.com", initials: "RM", role: "moderator", status: "active", department: "Support", joinDate: "Jun 8, 2025", lastActive: "45 min ago", permissions: ["orders.view", "customers.view", "customers.manage", "support.manage"] },
  { id: "usr-10", name: "Nina Patel", email: "nina@company.com", initials: "NP", role: "admin", status: "active", department: "Engineering", joinDate: "Jun 22, 2025", lastActive: "15 min ago", permissions: ["users.manage", "orders.manage", "products.manage", "settings.manage", "billing.manage"] },
  { id: "usr-11", name: "Tom Bradley", email: "tom@company.com", initials: "TB", role: "viewer", status: "suspended", department: "Sales", joinDate: "Jul 10, 2025", lastActive: "1 month ago", permissions: ["orders.view"] },
  { id: "usr-12", name: "Anna Kowalski", email: "anna@company.com", initials: "AK", role: "editor", status: "active", department: "Content", joinDate: "Jul 25, 2025", lastActive: "20 min ago", permissions: ["products.manage", "orders.view"] },
  { id: "usr-13", name: "Chris Lee", email: "chris@company.com", initials: "CL", role: "viewer", status: "active", department: "Finance", joinDate: "Aug 5, 2025", lastActive: "4 hours ago", permissions: ["orders.view", "billing.view", "invoices.view"] },
  { id: "usr-14", name: "Jake Rivera", email: "jake@company.com", initials: "JR", role: "moderator", status: "inactive", department: "Support", joinDate: "Aug 18, 2025", lastActive: "3 weeks ago", permissions: ["customers.view", "support.manage"] },
  { id: "usr-15", name: "Mia Zhang", email: "mia@company.com", initials: "MZ", role: "editor", status: "active", department: "Design", joinDate: "Sep 1, 2025", lastActive: "1 hour ago", permissions: ["products.manage", "products.view"] },
  { id: "usr-16", name: "Daniel Olsen", email: "daniel@company.com", initials: "DO", role: "admin", status: "active", department: "Engineering", joinDate: "Sep 15, 2025", lastActive: "Just now", permissions: ["users.manage", "orders.manage", "products.manage", "settings.manage", "billing.manage"] },
  { id: "usr-17", name: "Kai Tanaka", email: "kai@company.com", initials: "KT", role: "viewer", status: "active", department: "Operations", joinDate: "Oct 3, 2025", lastActive: "6 hours ago", permissions: ["orders.view", "products.view"] },
  { id: "usr-18", name: "Olivia Brown", email: "olivia@company.com", initials: "OB", role: "editor", status: "active", department: "Marketing", joinDate: "Oct 20, 2025", lastActive: "2 hours ago", permissions: ["orders.view", "products.manage", "customers.view"] },
  { id: "usr-19", name: "Liam Murphy", email: "liam@company.com", initials: "LM", role: "viewer", status: "suspended", department: "Sales", joinDate: "Nov 5, 2025", lastActive: "2 months ago", permissions: ["orders.view"] },
  { id: "usr-20", name: "Priya Sharma", email: "priya@company.com", initials: "PS", role: "moderator", status: "active", department: "Support", joinDate: "Nov 18, 2025", lastActive: "25 min ago", permissions: ["orders.view", "customers.view", "customers.manage", "support.manage"] },
  { id: "usr-21", name: "Marcus Johnson", email: "marcus@company.com", initials: "MJ", role: "editor", status: "active", department: "Content", joinDate: "Dec 1, 2025", lastActive: "3 hours ago", permissions: ["products.manage", "orders.view"] },
  { id: "usr-22", name: "Yuki Nakamura", email: "yuki@company.com", initials: "YN", role: "viewer", status: "active", department: "Finance", joinDate: "Dec 15, 2025", lastActive: "1 day ago", permissions: ["orders.view", "billing.view", "invoices.view"] },
  { id: "usr-23", name: "Rachel Green", email: "rachel@company.com", initials: "RG", role: "admin", status: "active", department: "HR", joinDate: "Jan 5, 2026", lastActive: "10 min ago", permissions: ["users.manage", "settings.manage"] },
  { id: "usr-24", name: "Omar Hassan", email: "omar@company.com", initials: "OH", role: "editor", status: "inactive", department: "Engineering", joinDate: "Jan 15, 2026", lastActive: "1 week ago", permissions: ["products.manage", "orders.view"] },
  { id: "usr-25", name: "Clara Müller", email: "clara@company.com", initials: "CM", role: "viewer", status: "active", department: "Operations", joinDate: "Feb 1, 2026", lastActive: "8 hours ago", permissions: ["orders.view", "products.view"] },
];

// ── Available permissions ──

export const allPermissions = [
  { key: "users.manage", label: "Manage Users", group: "Users" },
  { key: "users.view", label: "View Users", group: "Users" },
  { key: "orders.manage", label: "Manage Orders", group: "Orders" },
  { key: "orders.view", label: "View Orders", group: "Orders" },
  { key: "products.manage", label: "Manage Products", group: "Products" },
  { key: "products.view", label: "View Products", group: "Products" },
  { key: "customers.manage", label: "Manage Customers", group: "Customers" },
  { key: "customers.view", label: "View Customers", group: "Customers" },
  { key: "billing.manage", label: "Manage Billing", group: "Billing" },
  { key: "billing.view", label: "View Billing", group: "Billing" },
  { key: "invoices.view", label: "View Invoices", group: "Invoices" },
  { key: "settings.manage", label: "Manage Settings", group: "Settings" },
  { key: "support.manage", label: "Manage Support", group: "Support" },
];

export const departments = [
  "Engineering",
  "Marketing",
  "Design",
  "Sales",
  "Support",
  "Finance",
  "Content",
  "Operations",
  "HR",
];

// ── Filters ──

export interface UserFilters {
  status?: UserStatus;
  role?: UserRole;
  search?: string;
  page?: number;
  perPage?: number;
}

export function getUsers(filters?: UserFilters) {
  let result = [...users];

  if (filters?.status) {
    result = result.filter((u) => u.status === filters.status);
  }

  if (filters?.role) {
    result = result.filter((u) => u.role === filters.role);
  }

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.department.toLowerCase().includes(q)
    );
  }

  const total = result.length;
  const page = filters?.page ?? 1;
  const perPage = filters?.perPage ?? 10;
  const start = (page - 1) * perPage;

  return {
    data: result.slice(start, start + perPage),
    total,
    page,
    perPage,
    totalPages: Math.ceil(total / perPage),
  };
}

export function getUserById(id: string) {
  return users.find((u) => u.id === id);
}

export function getUserIds() {
  return users.map((u) => u.id);
}

export function createUser(data: Omit<User, "id">) {
  const id = `usr-${users.length + 1}`;
  const user: User = { id, ...data };
  users.push(user);
  return user;
}

export function updateUser(id: string, data: Partial<User>) {
  const idx = users.findIndex((u) => u.id === id);
  if (idx !== -1) {
    users[idx] = { ...users[idx], ...data };
    return users[idx];
  }
  return null;
}

export function deleteUser(id: string) {
  const idx = users.findIndex((u) => u.id === id);
  if (idx !== -1) {
    users.splice(idx, 1);
    return true;
  }
  return false;
}
