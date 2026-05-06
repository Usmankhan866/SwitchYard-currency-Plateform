export type OrderStatus = "completed" | "processing" | "pending" | "cancelled";
export type ProductStatus = "active" | "draft" | "archived";
export type InvoiceStatus = "paid" | "pending" | "overdue";
export type NotificationType = "order" | "customer" | "system" | "payment";

export interface Customer {
  id: string;
  name: string;
  email: string;
  initials: string;
  avatar?: string;
  joinDate: string;
  totalSpent: number;
  ordersCount: number;
  status: "active" | "inactive";
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  status: ProductStatus;
  image?: string;
  createdAt: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerInitials: string;
  productId: string;
  productName: string;
  amount: number;
  status: OrderStatus;
  date: string;
  trend?: number[];
}

export interface Invoice {
  id: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  status: InvoiceStatus;
  issuedDate: string;
  dueDate: string;
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  type: NotificationType;
  read: boolean;
  time: string;
}

export interface Activity {
  id: string;
  iconType: "order" | "customer" | "review" | "payment" | "support";
  title: string;
  description: string;
  time: string;
}

export interface StatCard {
  title: string;
  value: string;
  change: number;
  changeLabel: string;
  iconType: "revenue" | "users" | "orders" | "views";
  sparkline: number[];
}

export interface RevenueDataPoint {
  month: string;
  revenue: number;
  orders: number;
  profit: number;
}

export interface TrafficSource {
  name: string;
  value: number;
  color: string;
}

export interface Goal {
  label: string;
  current: number;
  target: number;
  color: string;
}

// ── User management types ──

export type UserRole = "admin" | "editor" | "viewer" | "moderator";
export type UserStatus = "active" | "inactive" | "suspended";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  initials: string;
  role: UserRole;
  status: UserStatus;
  department: string;
  joinDate: string;
  lastActive: string;
  permissions: string[];
}

// ── Charts showcase types ──

export interface SkillDataPoint {
  subject: string;
  current: number;
  previous: number;
  fullMark: number;
}

export interface RadialBarDataPoint {
  name: string;
  value: number;
  fill: string;
}

export interface TreemapDataPoint {
  name: string;
  size: number;
  fill: string;
  [key: string]: string | number;
}

export interface ScatterDataPoint {
  x: number;
  y: number;
  z: number;
}

export interface ComboDataPoint {
  month: string;
  revenue: number;
  orders: number;
  growth: number;
}
