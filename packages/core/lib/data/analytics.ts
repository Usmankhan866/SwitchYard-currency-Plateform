import type { StatCard, RevenueDataPoint, TrafficSource, Goal, Activity } from "./types";

export const statsData: StatCard[] = [
  {
    title: "Total Revenue",
    value: "$48,295",
    change: 12.5,
    changeLabel: "vs last month",
    iconType: "revenue",
    sparkline: [28, 32, 25, 35, 30, 38, 42, 36, 45, 40, 48, 52],
  },
  {
    title: "Active Users",
    value: "2,847",
    change: 8.2,
    changeLabel: "vs last month",
    iconType: "users",
    sparkline: [18, 22, 20, 25, 23, 28, 24, 30, 27, 32, 29, 34],
  },
  {
    title: "Total Orders",
    value: "1,432",
    change: -3.1,
    changeLabel: "vs last month",
    iconType: "orders",
    sparkline: [22, 25, 28, 24, 20, 23, 18, 21, 19, 17, 20, 18],
  },
  {
    title: "Page Views",
    value: "284K",
    change: 24.7,
    changeLabel: "vs last month",
    iconType: "views",
    sparkline: [120, 135, 128, 145, 160, 155, 170, 185, 195, 210, 230, 250],
  },
];

export const revenueData: RevenueDataPoint[] = [
  { month: "Jan", revenue: 18400, orders: 245, profit: 6200 },
  { month: "Feb", revenue: 22100, orders: 312, profit: 8100 },
  { month: "Mar", revenue: 19800, orders: 278, profit: 7200 },
  { month: "Apr", revenue: 28300, orders: 389, profit: 11400 },
  { month: "May", revenue: 32100, orders: 421, profit: 13200 },
  { month: "Jun", revenue: 29500, orders: 385, profit: 11800 },
  { month: "Jul", revenue: 35800, orders: 467, profit: 15600 },
  { month: "Aug", revenue: 38200, orders: 498, profit: 16800 },
  { month: "Sep", revenue: 41500, orders: 534, profit: 18200 },
  { month: "Oct", revenue: 39800, orders: 512, profit: 17100 },
  { month: "Nov", revenue: 44200, orders: 578, profit: 19800 },
  { month: "Dec", revenue: 48295, orders: 612, profit: 22100 },
];

export const trafficData: TrafficSource[] = [
  { name: "Direct", value: 35, color: "var(--chart-1)" },
  { name: "Organic", value: 28, color: "var(--chart-2)" },
  { name: "Referral", value: 22, color: "var(--chart-3)" },
  { name: "Social", value: 15, color: "var(--chart-5)" },
];

export const goalsData: Goal[] = [
  { label: "Monthly Revenue", current: 48295, target: 55000, color: "bg-chart-1" },
  { label: "New Customers", current: 847, target: 1000, color: "bg-chart-2" },
  { label: "Conversion Rate", current: 3.8, target: 5.0, color: "bg-chart-3" },
];

export const activitiesData: Activity[] = [
  {
    id: "act-1",
    iconType: "order",
    title: "New order placed",
    description: "Emma Wilson purchased Pro Dashboard License",
    time: "2 min ago",
  },
  {
    id: "act-2",
    iconType: "customer",
    title: "New customer registered",
    description: "James Chen created an account",
    time: "15 min ago",
  },
  {
    id: "act-3",
    iconType: "review",
    title: "5-star review received",
    description: '"Amazing template, exactly what I needed!"',
    time: "1 hour ago",
  },
  {
    id: "act-4",
    iconType: "payment",
    title: "Payment received",
    description: "$1,499 from Sofia Garcia",
    time: "2 hours ago",
  },
  {
    id: "act-5",
    iconType: "support",
    title: "Support ticket resolved",
    description: "Ticket #4521 marked as resolved",
    time: "3 hours ago",
  },
  {
    id: "act-6",
    iconType: "order",
    title: "New order placed",
    description: "Alex Thompson purchased Single License",
    time: "5 hours ago",
  },
];
