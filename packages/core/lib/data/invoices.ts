import type { Invoice, InvoiceStatus } from "./types";

export const invoices: Invoice[] = [
  { id: "INV-2041", orderId: "ORD-7891", customerName: "Emma Wilson", customerEmail: "emma@example.com", amount: 299, status: "paid", issuedDate: "Feb 14, 2026", dueDate: "Mar 14, 2026" },
  { id: "INV-2040", orderId: "ORD-7890", customerName: "James Chen", customerEmail: "james@company.io", amount: 599, status: "pending", issuedDate: "Feb 14, 2026", dueDate: "Mar 14, 2026" },
  { id: "INV-2039", orderId: "ORD-7889", customerName: "Sofia Garcia", customerEmail: "sofia@startup.co", amount: 1499, status: "paid", issuedDate: "Feb 13, 2026", dueDate: "Mar 13, 2026" },
  { id: "INV-2038", orderId: "ORD-7888", customerName: "Alex Thompson", customerEmail: "alex@dev.com", amount: 79, status: "pending", issuedDate: "Feb 13, 2026", dueDate: "Mar 13, 2026" },
  { id: "INV-2037", orderId: "ORD-7887", customerName: "Maria Santos", customerEmail: "maria@agency.co", amount: 299, status: "paid", issuedDate: "Feb 12, 2026", dueDate: "Mar 12, 2026" },
  { id: "INV-2036", orderId: "ORD-7885", customerName: "Lisa Park", customerEmail: "lisa@design.co", amount: 299, status: "paid", issuedDate: "Feb 11, 2026", dueDate: "Mar 11, 2026" },
  { id: "INV-2035", orderId: "ORD-7884", customerName: "Ryan Mitchell", customerEmail: "ryan@startup.io", amount: 1499, status: "paid", issuedDate: "Feb 11, 2026", dueDate: "Mar 11, 2026" },
  { id: "INV-2034", orderId: "ORD-7883", customerName: "Nina Patel", customerEmail: "nina@corp.com", amount: 79, status: "overdue", issuedDate: "Jan 10, 2026", dueDate: "Feb 10, 2026" },
  { id: "INV-2033", orderId: "ORD-7882", customerName: "Tom Bradley", customerEmail: "tom@agency.io", amount: 599, status: "overdue", issuedDate: "Jan 10, 2026", dueDate: "Feb 10, 2026" },
  { id: "INV-2032", orderId: "ORD-7881", customerName: "Anna Kowalski", customerEmail: "anna@dev.co", amount: 299, status: "paid", issuedDate: "Feb 9, 2026", dueDate: "Mar 9, 2026" },
  { id: "INV-2031", orderId: "ORD-7880", customerName: "Chris Lee", customerEmail: "chris@tech.com", amount: 49, status: "paid", issuedDate: "Feb 9, 2026", dueDate: "Mar 9, 2026" },
  { id: "INV-2030", orderId: "ORD-7879", customerName: "Emma Wilson", customerEmail: "emma@example.com", amount: 599, status: "paid", issuedDate: "Feb 8, 2026", dueDate: "Mar 8, 2026" },
];

export interface InvoiceFilters {
  status?: InvoiceStatus;
  search?: string;
  page?: number;
  perPage?: number;
}

export function getInvoices(filters?: InvoiceFilters) {
  let result = [...invoices];

  if (filters?.status) {
    result = result.filter((inv) => inv.status === filters.status);
  }

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (inv) =>
        inv.id.toLowerCase().includes(q) ||
        inv.customerName.toLowerCase().includes(q) ||
        inv.orderId.toLowerCase().includes(q)
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
