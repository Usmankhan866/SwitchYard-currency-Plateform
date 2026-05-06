import type { Order, OrderStatus } from "./types";

let orders: Order[] = [
  { id: "ORD-7891", customerId: "cust-1", customerName: "Emma Wilson", customerEmail: "emma@example.com", customerInitials: "EW", productId: "prod-1", productName: "Pro Dashboard License", amount: 299, status: "completed", date: "Feb 14, 2026", trend: [120, 180, 150, 220, 280, 299] },
  { id: "ORD-7890", customerId: "cust-2", customerName: "James Chen", customerEmail: "james@company.io", customerInitials: "JC", productId: "prod-2", productName: "Team Plan Upgrade", amount: 599, status: "processing", date: "Feb 14, 2026", trend: [400, 350, 480, 520, 560, 599] },
  { id: "ORD-7889", customerId: "cust-3", customerName: "Sofia Garcia", customerEmail: "sofia@startup.co", customerInitials: "SG", productId: "prod-3", productName: "Enterprise License", amount: 1499, status: "completed", date: "Feb 13, 2026", trend: [800, 1100, 950, 1200, 1350, 1499] },
  { id: "ORD-7888", customerId: "cust-4", customerName: "Alex Thompson", customerEmail: "alex@dev.com", customerInitials: "AT", productId: "prod-4", productName: "Single License", amount: 79, status: "pending", date: "Feb 13, 2026", trend: [40, 55, 45, 60, 70, 79] },
  { id: "ORD-7887", customerId: "cust-5", customerName: "Maria Santos", customerEmail: "maria@agency.co", customerInitials: "MS", productId: "prod-1", productName: "Pro Dashboard License", amount: 299, status: "completed", date: "Feb 12, 2026", trend: [200, 240, 180, 260, 290, 299] },
  { id: "ORD-7886", customerId: "cust-6", customerName: "David Kim", customerEmail: "david@tech.io", customerInitials: "DK", productId: "prod-2", productName: "Team Plan Upgrade", amount: 599, status: "cancelled", date: "Feb 12, 2026", trend: [500, 480, 420, 350, 300, 250] },
  { id: "ORD-7885", customerId: "cust-7", customerName: "Lisa Park", customerEmail: "lisa@design.co", customerInitials: "LP", productId: "prod-1", productName: "Pro Dashboard License", amount: 299, status: "completed", date: "Feb 11, 2026", trend: [150, 200, 250, 270, 285, 299] },
  { id: "ORD-7884", customerId: "cust-8", customerName: "Ryan Mitchell", customerEmail: "ryan@startup.io", customerInitials: "RM", productId: "prod-3", productName: "Enterprise License", amount: 1499, status: "completed", date: "Feb 11, 2026", trend: [900, 1000, 1150, 1300, 1420, 1499] },
  { id: "ORD-7883", customerId: "cust-9", customerName: "Nina Patel", customerEmail: "nina@corp.com", customerInitials: "NP", productId: "prod-4", productName: "Single License", amount: 79, status: "processing", date: "Feb 10, 2026", trend: [30, 45, 50, 60, 65, 79] },
  { id: "ORD-7882", customerId: "cust-10", customerName: "Tom Bradley", customerEmail: "tom@agency.io", customerInitials: "TB", productId: "prod-2", productName: "Team Plan Upgrade", amount: 599, status: "pending", date: "Feb 10, 2026", trend: [300, 380, 420, 480, 530, 599] },
  { id: "ORD-7881", customerId: "cust-11", customerName: "Anna Kowalski", customerEmail: "anna@dev.co", customerInitials: "AK", productId: "prod-1", productName: "Pro Dashboard License", amount: 299, status: "completed", date: "Feb 9, 2026", trend: [180, 200, 230, 255, 275, 299] },
  { id: "ORD-7880", customerId: "cust-12", customerName: "Chris Lee", customerEmail: "chris@tech.com", customerInitials: "CL", productId: "prod-5", productName: "Starter Plan", amount: 49, status: "completed", date: "Feb 9, 2026", trend: [20, 28, 35, 40, 45, 49] },
  { id: "ORD-7879", customerId: "cust-1", customerName: "Emma Wilson", customerEmail: "emma@example.com", customerInitials: "EW", productId: "prod-2", productName: "Team Plan Upgrade", amount: 599, status: "completed", date: "Feb 8, 2026", trend: [350, 420, 480, 520, 570, 599] },
  { id: "ORD-7878", customerId: "cust-13", customerName: "Jake Rivera", customerEmail: "jake@freelance.io", customerInitials: "JR", productId: "prod-4", productName: "Single License", amount: 79, status: "cancelled", date: "Feb 8, 2026", trend: [70, 65, 55, 45, 35, 30] },
  { id: "ORD-7877", customerId: "cust-14", customerName: "Mia Zhang", customerEmail: "mia@studio.co", customerInitials: "MZ", productId: "prod-3", productName: "Enterprise License", amount: 1499, status: "processing", date: "Feb 7, 2026", trend: [700, 900, 1050, 1200, 1350, 1499] },
  { id: "ORD-7876", customerId: "cust-15", customerName: "Daniel Olsen", customerEmail: "dan@build.io", customerInitials: "DO", productId: "prod-1", productName: "Pro Dashboard License", amount: 299, status: "completed", date: "Feb 7, 2026", trend: [100, 150, 200, 240, 270, 299] },
  { id: "ORD-7875", customerId: "cust-3", customerName: "Sofia Garcia", customerEmail: "sofia@startup.co", customerInitials: "SG", productId: "prod-5", productName: "Starter Plan", amount: 49, status: "pending", date: "Feb 6, 2026", trend: [15, 22, 30, 35, 42, 49] },
  { id: "ORD-7874", customerId: "cust-16", customerName: "Kai Tanaka", customerEmail: "kai@app.dev", customerInitials: "KT", productId: "prod-2", productName: "Team Plan Upgrade", amount: 599, status: "completed", date: "Feb 6, 2026", trend: [280, 380, 450, 500, 560, 599] },
  { id: "ORD-7873", customerId: "cust-17", customerName: "Olivia Brown", customerEmail: "olivia@co.uk", customerInitials: "OB", productId: "prod-1", productName: "Pro Dashboard License", amount: 299, status: "completed", date: "Feb 5, 2026", trend: [160, 190, 220, 250, 275, 299] },
  { id: "ORD-7872", customerId: "cust-18", customerName: "Liam Murphy", customerEmail: "liam@ops.com", customerInitials: "LM", productId: "prod-4", productName: "Single License", amount: 79, status: "completed", date: "Feb 5, 2026", trend: [35, 45, 55, 62, 70, 79] },
];

let nextId = 7892;

export interface OrderFilters {
  status?: OrderStatus;
  search?: string;
  page?: number;
  perPage?: number;
}

export function getOrders(filters?: OrderFilters) {
  let result = [...orders];

  if (filters?.status) {
    result = result.filter((o) => o.status === filters.status);
  }

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (o) =>
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.productName.toLowerCase().includes(q)
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

export function getOrderIds() {
  return orders.map((o) => o.id);
}

export function getOrderById(id: string) {
  return orders.find((o) => o.id === id);
}

export function createOrder(data: Omit<Order, "id">) {
  const order: Order = { ...data, id: `ORD-${nextId++}` };
  orders = [order, ...orders];
  return order;
}

export function updateOrder(id: string, data: Partial<Order>) {
  const index = orders.findIndex((o) => o.id === id);
  if (index === -1) return null;
  orders[index] = { ...orders[index], ...data, id };
  return orders[index];
}

export function deleteOrder(id: string) {
  const before = orders.length;
  orders = orders.filter((o) => o.id !== id);
  return orders.length < before;
}

export function getRecentOrders(count = 6) {
  return orders.slice(0, count);
}
