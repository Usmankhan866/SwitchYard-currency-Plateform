import type { Notification } from "./types";

let notifications: Notification[] = [
  { id: "notif-1", title: "New order received", description: "Emma Wilson placed order ORD-7891 for $299.00", type: "order", read: false, time: "2 min ago" },
  { id: "notif-2", title: "Payment processed", description: "Payment of $1,499.00 from Sofia Garcia confirmed", type: "payment", read: false, time: "15 min ago" },
  { id: "notif-3", title: "New customer signup", description: "James Chen created an account", type: "customer", read: false, time: "1 hour ago" },
  { id: "notif-4", title: "Order shipped", description: "ORD-7889 has been shipped to Sofia Garcia", type: "order", read: true, time: "2 hours ago" },
  { id: "notif-5", title: "System update", description: "Dashboard v2.1 has been deployed successfully", type: "system", read: true, time: "3 hours ago" },
  { id: "notif-6", title: "Payment failed", description: "Payment attempt for ORD-7888 from Alex Thompson failed", type: "payment", read: false, time: "4 hours ago" },
  { id: "notif-7", title: "New review", description: 'Maria Santos left a 5-star review: "Excellent product!"', type: "customer", read: true, time: "5 hours ago" },
  { id: "notif-8", title: "Subscription renewed", description: "Team Plan for James Chen renewed for another month", type: "payment", read: true, time: "6 hours ago" },
  { id: "notif-9", title: "Server maintenance", description: "Scheduled maintenance window: Feb 20, 2:00 AM - 4:00 AM UTC", type: "system", read: true, time: "1 day ago" },
  { id: "notif-10", title: "New order received", description: "David Kim placed order ORD-7886 for $599.00", type: "order", read: true, time: "2 days ago" },
  { id: "notif-11", title: "Bulk export complete", description: "Your customer data export is ready for download", type: "system", read: true, time: "2 days ago" },
  { id: "notif-12", title: "Refund processed", description: "Refund of $599.00 issued for ORD-7886", type: "payment", read: true, time: "3 days ago" },
];

export function getNotifications(filter?: "all" | "unread" | "read") {
  if (filter === "unread") return notifications.filter((n) => !n.read);
  if (filter === "read") return notifications.filter((n) => n.read);
  return [...notifications];
}

export function getUnreadCount() {
  return notifications.filter((n) => !n.read).length;
}

export function markAsRead(id: string) {
  const index = notifications.findIndex((n) => n.id === id);
  if (index === -1) return;
  notifications[index] = { ...notifications[index], read: true };
}

export function markAllAsRead() {
  notifications = notifications.map((n) => ({ ...n, read: true }));
}
