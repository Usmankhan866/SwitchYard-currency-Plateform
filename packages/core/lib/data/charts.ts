import type {
  SkillDataPoint,
  RadialBarDataPoint,
  TreemapDataPoint,
  ScatterDataPoint,
  ComboDataPoint,
} from "./types";

// ── Radar Chart: Team Skills Assessment ──

export const skillsData: SkillDataPoint[] = [
  { subject: "Frontend", current: 88, previous: 72, fullMark: 100 },
  { subject: "Backend", current: 75, previous: 68, fullMark: 100 },
  { subject: "Design", current: 82, previous: 78, fullMark: 100 },
  { subject: "DevOps", current: 65, previous: 52, fullMark: 100 },
  { subject: "Testing", current: 70, previous: 58, fullMark: 100 },
  { subject: "Security", current: 58, previous: 45, fullMark: 100 },
];

// ── Radial Bar Chart: Device Usage ──

export const deviceUsageData: RadialBarDataPoint[] = [
  { name: "Mobile", value: 42, fill: "var(--chart-1)" },
  { name: "Desktop", value: 35, fill: "var(--chart-2)" },
  { name: "Tablet", value: 15, fill: "var(--chart-3)" },
  { name: "Other", value: 8, fill: "var(--chart-4)" },
];

// ── Treemap: Budget Allocation ──

export const budgetData: TreemapDataPoint[] = [
  { name: "Engineering", size: 420000, fill: "var(--chart-1)" },
  { name: "Marketing", size: 280000, fill: "var(--chart-2)" },
  { name: "Sales", size: 240000, fill: "var(--chart-3)" },
  { name: "Operations", size: 180000, fill: "var(--chart-4)" },
  { name: "Design", size: 150000, fill: "var(--chart-5)" },
  { name: "Support", size: 120000, fill: "var(--chart-1)" },
  { name: "HR", size: 95000, fill: "var(--chart-2)" },
  { name: "Legal", size: 65000, fill: "var(--chart-3)" },
];

// ── Scatter Chart: Marketing Spend vs Revenue ──

export const q1ScatterData: ScatterDataPoint[] = [
  { x: 2400, y: 8200, z: 120 },
  { x: 4800, y: 14500, z: 200 },
  { x: 1800, y: 5800, z: 80 },
  { x: 6200, y: 21000, z: 280 },
  { x: 3500, y: 11200, z: 150 },
  { x: 5100, y: 16800, z: 220 },
  { x: 2900, y: 9400, z: 130 },
  { x: 7500, y: 24600, z: 340 },
  { x: 4200, y: 13800, z: 180 },
  { x: 1500, y: 4200, z: 60 },
  { x: 5800, y: 18900, z: 250 },
  { x: 3200, y: 10500, z: 140 },
];

export const q2ScatterData: ScatterDataPoint[] = [
  { x: 2800, y: 9800, z: 140 },
  { x: 5200, y: 17200, z: 230 },
  { x: 1600, y: 6200, z: 90 },
  { x: 6800, y: 23500, z: 310 },
  { x: 3800, y: 12800, z: 170 },
  { x: 4500, y: 15200, z: 200 },
  { x: 3100, y: 10800, z: 145 },
  { x: 7200, y: 25800, z: 360 },
  { x: 4900, y: 16100, z: 210 },
  { x: 2200, y: 7400, z: 100 },
  { x: 5600, y: 19400, z: 260 },
  { x: 3600, y: 12200, z: 160 },
];

// ── Composed Chart: Revenue + Orders + Growth ──

export const comboData: ComboDataPoint[] = [
  { month: "Jan", revenue: 42000, orders: 320, growth: 5.2 },
  { month: "Feb", revenue: 45000, orders: 340, growth: 7.1 },
  { month: "Mar", revenue: 48500, orders: 365, growth: 7.8 },
  { month: "Apr", revenue: 46000, orders: 350, growth: 3.1 },
  { month: "May", revenue: 52000, orders: 390, growth: 13.0 },
  { month: "Jun", revenue: 54800, orders: 410, growth: 5.4 },
  { month: "Jul", revenue: 51200, orders: 385, growth: -6.6 },
  { month: "Aug", revenue: 56500, orders: 420, growth: 10.4 },
  { month: "Sep", revenue: 59800, orders: 445, growth: 5.8 },
  { month: "Oct", revenue: 62400, orders: 460, growth: 4.3 },
  { month: "Nov", revenue: 68200, orders: 510, growth: 9.3 },
  { month: "Dec", revenue: 72500, orders: 540, growth: 6.3 },
];
