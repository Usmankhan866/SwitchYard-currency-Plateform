import type { Customer } from "./types";

export const customers: Customer[] = [
  { id: "cust-1", name: "Emma Wilson", email: "emma@example.com", initials: "EW", joinDate: "Jan 5, 2026", totalSpent: 898, ordersCount: 3, status: "active" },
  { id: "cust-2", name: "James Chen", email: "james@company.io", initials: "JC", joinDate: "Jan 12, 2026", totalSpent: 599, ordersCount: 1, status: "active" },
  { id: "cust-3", name: "Sofia Garcia", email: "sofia@startup.co", initials: "SG", joinDate: "Dec 18, 2025", totalSpent: 1548, ordersCount: 2, status: "active" },
  { id: "cust-4", name: "Alex Thompson", email: "alex@dev.com", initials: "AT", joinDate: "Jan 20, 2026", totalSpent: 79, ordersCount: 1, status: "active" },
  { id: "cust-5", name: "Maria Santos", email: "maria@agency.co", initials: "MS", joinDate: "Dec 2, 2025", totalSpent: 299, ordersCount: 1, status: "active" },
  { id: "cust-6", name: "David Kim", email: "david@tech.io", initials: "DK", joinDate: "Nov 15, 2025", totalSpent: 0, ordersCount: 1, status: "inactive" },
  { id: "cust-7", name: "Lisa Park", email: "lisa@design.co", initials: "LP", joinDate: "Jan 8, 2026", totalSpent: 299, ordersCount: 1, status: "active" },
  { id: "cust-8", name: "Ryan Mitchell", email: "ryan@startup.io", initials: "RM", joinDate: "Dec 28, 2025", totalSpent: 1499, ordersCount: 1, status: "active" },
  { id: "cust-9", name: "Nina Patel", email: "nina@corp.com", initials: "NP", joinDate: "Jan 15, 2026", totalSpent: 79, ordersCount: 1, status: "active" },
  { id: "cust-10", name: "Tom Bradley", email: "tom@agency.io", initials: "TB", joinDate: "Jan 22, 2026", totalSpent: 599, ordersCount: 1, status: "active" },
  { id: "cust-11", name: "Anna Kowalski", email: "anna@dev.co", initials: "AK", joinDate: "Dec 10, 2025", totalSpent: 299, ordersCount: 1, status: "active" },
  { id: "cust-12", name: "Chris Lee", email: "chris@tech.com", initials: "CL", joinDate: "Nov 30, 2025", totalSpent: 49, ordersCount: 1, status: "active" },
  { id: "cust-13", name: "Jake Rivera", email: "jake@freelance.io", initials: "JR", joinDate: "Jan 3, 2026", totalSpent: 0, ordersCount: 1, status: "inactive" },
  { id: "cust-14", name: "Mia Zhang", email: "mia@studio.co", initials: "MZ", joinDate: "Dec 22, 2025", totalSpent: 1499, ordersCount: 1, status: "active" },
  { id: "cust-15", name: "Daniel Olsen", email: "dan@build.io", initials: "DO", joinDate: "Jan 18, 2026", totalSpent: 299, ordersCount: 1, status: "active" },
  { id: "cust-16", name: "Kai Tanaka", email: "kai@app.dev", initials: "KT", joinDate: "Dec 5, 2025", totalSpent: 599, ordersCount: 1, status: "active" },
  { id: "cust-17", name: "Olivia Brown", email: "olivia@co.uk", initials: "OB", joinDate: "Nov 20, 2025", totalSpent: 299, ordersCount: 1, status: "active" },
  { id: "cust-18", name: "Liam Murphy", email: "liam@ops.com", initials: "LM", joinDate: "Jan 25, 2026", totalSpent: 79, ordersCount: 1, status: "active" },
];

export interface CustomerFilters {
  status?: "active" | "inactive";
  search?: string;
  page?: number;
  perPage?: number;
}

export function getCustomers(filters?: CustomerFilters) {
  let result = [...customers];

  if (filters?.status) {
    result = result.filter((c) => c.status === filters.status);
  }

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q)
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

export function getCustomerById(id: string) {
  return customers.find((c) => c.id === id);
}
