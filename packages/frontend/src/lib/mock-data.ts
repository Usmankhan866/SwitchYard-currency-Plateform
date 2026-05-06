// KPI data generator for DateRangeToggle
export type Range = "7d" | "30d" | "90d";

const rangeMultipliers: Record<Range, number> = {
  "7d": 1,
  "30d": 3.5,
  "90d": 10,
};

export interface KpiBaseline {
  label: string;
  value: number;
  total: number;
  color: string;
}

export function generateMockKpiData(baselines: KpiBaseline[], range: Range) {
  const mult = rangeMultipliers[range];
  return baselines.map((b) => ({
    ...b,
    value: Math.round(b.value * mult),
    total: Math.round(b.total * mult),
  }));
}

// --- eCommerce Orders (20 rows) ---

export type OrderStatus = "Completed" | "Processing" | "Failed";

export interface Order {
  id: string;
  code: string;
  date: string;
  budget: string;
  status: OrderStatus;
  stars: number;
}

export const ecommerceOrders: Order[] = [
  { id: "#467", code: "FLP-346", date: "Jan 2026", budget: "$450", status: "Completed", stars: 4 },
  { id: "#466", code: "FLP-345", date: "Jan 2026", budget: "$768", status: "Processing", stars: 3 },
  { id: "#465", code: "FLP-344", date: "Dec 2025", budget: "$298", status: "Completed", stars: 5 },
  { id: "#464", code: "FLP-343", date: "Dec 2025", budget: "$625", status: "Failed", stars: 2 },
  { id: "#463", code: "FLP-342", date: "Nov 2025", budget: "$475", status: "Completed", stars: 4 },
  { id: "#462", code: "FLP-341", date: "Nov 2025", budget: "$892", status: "Processing", stars: 3 },
  { id: "#461", code: "FLP-340", date: "Oct 2025", budget: "$340", status: "Completed", stars: 5 },
  { id: "#460", code: "FLP-339", date: "Oct 2025", budget: "$1,200", status: "Completed", stars: 4 },
  { id: "#459", code: "FLP-338", date: "Sep 2025", budget: "$560", status: "Failed", stars: 1 },
  { id: "#458", code: "FLP-337", date: "Sep 2025", budget: "$785", status: "Completed", stars: 4 },
  { id: "#457", code: "FLP-336", date: "Aug 2025", budget: "$420", status: "Processing", stars: 3 },
  { id: "#456", code: "FLP-335", date: "Aug 2025", budget: "$1,650", status: "Completed", stars: 5 },
  { id: "#455", code: "FLP-334", date: "Jul 2025", budget: "$380", status: "Failed", stars: 2 },
  { id: "#454", code: "FLP-333", date: "Jul 2025", budget: "$925", status: "Completed", stars: 4 },
  { id: "#453", code: "FLP-332", date: "Jun 2025", budget: "$710", status: "Processing", stars: 3 },
  { id: "#452", code: "FLP-331", date: "Jun 2025", budget: "$550", status: "Completed", stars: 4 },
  { id: "#451", code: "FLP-330", date: "May 2025", budget: "$1,100", status: "Completed", stars: 5 },
  { id: "#450", code: "FLP-329", date: "May 2025", budget: "$320", status: "Failed", stars: 2 },
  { id: "#449", code: "FLP-328", date: "Apr 2025", budget: "$680", status: "Processing", stars: 3 },
  { id: "#448", code: "FLP-327", date: "Apr 2025", budget: "$1,450", status: "Completed", stars: 5 },
];

// --- Mock Users (25 rows) ---

export type UserStatus = "Active" | "Disabled";

export interface MockUser {
  id: number;
  initials: string;
  color: string;
  name: string;
  email: string;
  position: string;
  office: string;
  age: number;
  startDate: string;
  status: UserStatus;
}

export const mockUsers: MockUser[] = [
  { id: 1, initials: "QF", color: "#4680ff", name: "Quinn Flynn", email: "quinn.flynn@example.com", position: "System Architect", office: "Edinburgh", age: 36, startDate: "2013-03-03", status: "Active" },
  { id: 2, initials: "GW", color: "#2ca87f", name: "Garrett Winters", email: "garrett.winters@example.com", position: "Accountant", office: "Tokyo", age: 43, startDate: "2011-07-25", status: "Active" },
  { id: 3, initials: "AC", color: "#7c4dff", name: "Ashton Cox", email: "ashton.cox@example.com", position: "Junior Developer", office: "San Francisco", age: 28, startDate: "2022-01-12", status: "Active" },
  { id: 4, initials: "CK", color: "#e58a00", name: "Cedric Kelly", email: "cedric.kelly@example.com", position: "Senior Developer", office: "Edinburgh", age: 32, startDate: "2012-03-29", status: "Disabled" },
  { id: 5, initials: "AS", color: "#e91e63", name: "Airi Satou", email: "airi.satou@example.com", position: "Accountant", office: "Tokyo", age: 33, startDate: "2008-11-28", status: "Active" },
  { id: 6, initials: "BW", color: "#4680ff", name: "Brielle Williamson", email: "brielle.williamson@example.com", position: "Integration Lead", office: "New York", age: 41, startDate: "2012-12-02", status: "Active" },
  { id: 7, initials: "HC", color: "#2ca87f", name: "Herrod Chandler", email: "herrod.chandler@example.com", position: "Sales Manager", office: "San Francisco", age: 39, startDate: "2019-08-06", status: "Disabled" },
  { id: 8, initials: "RD", color: "#7c4dff", name: "Rhona Davidson", email: "rhona.davidson@example.com", position: "System Designer", office: "Tokyo", age: 35, startDate: "2010-10-14", status: "Active" },
  { id: 9, initials: "CS", color: "#3ebfea", name: "Colleen Hurst", email: "colleen.hurst@example.com", position: "JavaScript Developer", office: "San Francisco", age: 39, startDate: "2009-09-15", status: "Active" },
  { id: 10, initials: "SB", color: "#e58a00", name: "Sonya Frost", email: "sonya.frost@example.com", position: "Software Engineer", office: "Edinburgh", age: 23, startDate: "2023-12-13", status: "Active" },
  { id: 11, initials: "JG", color: "#e91e63", name: "Jena Gaines", email: "jena.gaines@example.com", position: "Office Manager", office: "London", age: 30, startDate: "2008-12-19", status: "Active" },
  { id: 12, initials: "QV", color: "#4680ff", name: "Quinn Vance", email: "quinn.vance@example.com", position: "Support Lead", office: "Edinburgh", age: 31, startDate: "2011-12-12", status: "Disabled" },
  { id: 13, initials: "DJ", color: "#2ca87f", name: "Donna Jones", email: "donna.jones@example.com", position: "Marketing Lead", office: "New York", age: 37, startDate: "2010-06-25", status: "Active" },
  { id: 14, initials: "MF", color: "#7c4dff", name: "Michael Franco", email: "michael.franco@example.com", position: "DevOps Engineer", office: "San Francisco", age: 29, startDate: "2021-03-14", status: "Active" },
  { id: 15, initials: "TP", color: "#3ebfea", name: "Timothy Patel", email: "timothy.patel@example.com", position: "Data Analyst", office: "London", age: 34, startDate: "2017-08-22", status: "Active" },
  { id: 16, initials: "LR", color: "#e58a00", name: "Laura Reynolds", email: "laura.reynolds@example.com", position: "UX Designer", office: "New York", age: 27, startDate: "2022-05-01", status: "Active" },
  { id: 17, initials: "KN", color: "#e91e63", name: "Keith Novak", email: "keith.novak@example.com", position: "Backend Developer", office: "Edinburgh", age: 42, startDate: "2009-01-30", status: "Active" },
  { id: 18, initials: "RH", color: "#4680ff", name: "Rachel Harper", email: "rachel.harper@example.com", position: "Product Manager", office: "Tokyo", age: 38, startDate: "2014-11-10", status: "Active" },
  { id: 19, initials: "OL", color: "#2ca87f", name: "Oscar Liu", email: "oscar.liu@example.com", position: "QA Engineer", office: "San Francisco", age: 26, startDate: "2023-02-20", status: "Disabled" },
  { id: 20, initials: "ES", color: "#7c4dff", name: "Elena Santos", email: "elena.santos@example.com", position: "Frontend Developer", office: "London", age: 31, startDate: "2019-04-15", status: "Active" },
  { id: 21, initials: "NW", color: "#3ebfea", name: "Nathan Wells", email: "nathan.wells@example.com", position: "Database Admin", office: "Edinburgh", age: 45, startDate: "2007-09-01", status: "Active" },
  { id: 22, initials: "CP", color: "#e58a00", name: "Claire Palmer", email: "claire.palmer@example.com", position: "HR Coordinator", office: "New York", age: 33, startDate: "2016-07-18", status: "Active" },
  { id: 23, initials: "VK", color: "#e91e63", name: "Victor Kim", email: "victor.kim@example.com", position: "Security Analyst", office: "Tokyo", age: 36, startDate: "2018-10-05", status: "Active" },
  { id: 24, initials: "AM", color: "#4680ff", name: "Amy Mitchell", email: "amy.mitchell@example.com", position: "Technical Writer", office: "London", age: 29, startDate: "2021-11-22", status: "Disabled" },
  { id: 25, initials: "JT", color: "#2ca87f", name: "James Torres", email: "james.torres@example.com", position: "Cloud Engineer", office: "San Francisco", age: 40, startDate: "2013-06-30", status: "Active" },
];

// --- Mock Invoices (20 rows) ---

export type InvoiceStatus = "Paid" | "Pending" | "Overdue" | "On Hold";

export interface MockInvoice {
  id: string;
  initials: string;
  color: string;
  client: string;
  amount: number;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  notes: string;
}

export const mockInvoices: MockInvoice[] = [
  { id: "INV-001", initials: "SJ", color: "#4680ff", client: "Sarah Johnson", amount: 2999, issueDate: "2026-01-01", dueDate: "2026-01-31", status: "Paid", notes: "" },
  { id: "INV-002", initials: "MC", color: "#2ca87f", client: "Michael Chen", amount: 1499, issueDate: "2026-01-05", dueDate: "2026-02-04", status: "Paid", notes: "" },
  { id: "INV-003", initials: "EW", color: "#7c4dff", client: "Emma Wilson", amount: 499, issueDate: "2026-01-10", dueDate: "2026-02-09", status: "Pending", notes: "Awaiting client approval" },
  { id: "INV-004", initials: "AR", color: "#3ebfea", client: "Alex Rodriguez", amount: 3299, issueDate: "2026-01-12", dueDate: "2026-02-11", status: "Paid", notes: "" },
  { id: "INV-005", initials: "MG", color: "#dc2626", client: "Maria Garcia", amount: 899, issueDate: "2026-01-15", dueDate: "2026-02-14", status: "Overdue", notes: "Second reminder sent" },
  { id: "INV-006", initials: "DK", color: "#e58a00", client: "David Kim", amount: 1799, issueDate: "2026-01-18", dueDate: "2026-02-17", status: "On Hold", notes: "Scope change pending" },
  { id: "INV-007", initials: "LT", color: "#1abc9c", client: "Lisa Thompson", amount: 649, issueDate: "2026-01-20", dueDate: "2026-02-19", status: "Pending", notes: "" },
  { id: "INV-008", initials: "RB", color: "#4680ff", client: "Robert Brown", amount: 2150, issueDate: "2026-01-25", dueDate: "2026-02-24", status: "Paid", notes: "" },
  { id: "INV-009", initials: "JW", color: "#2ca87f", client: "Jennifer White", amount: 975, issueDate: "2026-02-01", dueDate: "2026-03-03", status: "Paid", notes: "" },
  { id: "INV-010", initials: "TM", color: "#7c4dff", client: "Thomas Martinez", amount: 4200, issueDate: "2026-02-05", dueDate: "2026-03-07", status: "Pending", notes: "" },
  { id: "INV-011", initials: "NL", color: "#e91e63", client: "Nancy Lee", amount: 1350, issueDate: "2026-02-10", dueDate: "2026-03-12", status: "Paid", notes: "" },
  { id: "INV-012", initials: "CH", color: "#3ebfea", client: "Christopher Hall", amount: 780, issueDate: "2026-02-15", dueDate: "2026-03-17", status: "Overdue", notes: "First reminder sent" },
  { id: "INV-013", initials: "PA", color: "#e58a00", client: "Patricia Adams", amount: 3650, issueDate: "2026-02-20", dueDate: "2026-03-22", status: "Paid", notes: "" },
  { id: "INV-014", initials: "DW", color: "#1abc9c", client: "Daniel Wright", amount: 525, issueDate: "2026-02-25", dueDate: "2026-03-27", status: "On Hold", notes: "Budget review" },
  { id: "INV-015", initials: "SK", color: "#4680ff", client: "Sandra King", amount: 1890, issueDate: "2026-03-01", dueDate: "2026-03-31", status: "Pending", notes: "" },
  { id: "INV-016", initials: "JC", color: "#2ca87f", client: "Jason Clark", amount: 2475, issueDate: "2026-03-05", dueDate: "2026-04-04", status: "Paid", notes: "" },
  { id: "INV-017", initials: "ML", color: "#7c4dff", client: "Michelle Lopez", amount: 1125, issueDate: "2026-03-10", dueDate: "2026-04-09", status: "Pending", notes: "" },
  { id: "INV-018", initials: "BJ", color: "#e91e63", client: "Brian Jackson", amount: 680, issueDate: "2026-03-15", dueDate: "2026-04-14", status: "Paid", notes: "" },
  { id: "INV-019", initials: "AR", color: "#3ebfea", client: "Angela Robinson", amount: 5100, issueDate: "2026-03-20", dueDate: "2026-04-19", status: "Pending", notes: "Large project milestone" },
  { id: "INV-020", initials: "KS", color: "#e58a00", client: "Kevin Scott", amount: 920, issueDate: "2026-03-25", dueDate: "2026-04-24", status: "On Hold", notes: "" },
];

// Helper: next invoice ID
export function nextInvoiceId(invoices: MockInvoice[]): string {
  const max = invoices.reduce((m, inv) => {
    const num = parseInt(inv.id.replace("INV-", ""), 10);
    return num > m ? num : m;
  }, 0);
  return `INV-${String(max + 1).padStart(3, "0")}`;
}

// Helper: next user ID
export function nextUserId(users: MockUser[]): number {
  return Math.max(...users.map((u) => u.id)) + 1;
}

// Helper: generate initials from name
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Helper: random avatar color
const avatarColors = ["#4680ff", "#2ca87f", "#7c4dff", "#3ebfea", "#e58a00", "#e91e63", "#1abc9c"];
export function randomAvatarColor(): string {
  return avatarColors[Math.floor(Math.random() * avatarColors.length)];
}
