export type EventColor = "primary" | "success" | "warning" | "destructive";

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD format
  time?: string; // HH:MM format
  endTime?: string;
  color: EventColor;
  description?: string;
}

let events: CalendarEvent[] = [
  // January 2026 (previous month)
  { id: "evt-1", title: "Q1 Planning Kickoff", date: "2026-01-28", time: "10:00", endTime: "11:30", color: "primary", description: "Quarterly planning session with all team leads" },
  { id: "evt-2", title: "Infrastructure Review", date: "2026-01-30", time: "14:00", endTime: "15:00", color: "warning", description: "Review cloud costs and scaling strategy" },

  // February 2026 (current month)
  { id: "evt-3", title: "Team Standup", date: "2026-02-02", time: "09:00", endTime: "09:15", color: "primary", description: "Daily sync with the engineering team" },
  { id: "evt-4", title: "Sprint Review", date: "2026-02-04", time: "15:00", endTime: "16:00", color: "success", description: "Demo completed work from Sprint 14" },
  { id: "evt-5", title: "Client Call — Acme Corp", date: "2026-02-06", time: "11:00", endTime: "12:00", color: "warning", description: "Monthly progress update with Acme stakeholders" },
  { id: "evt-6", title: "Design Review", date: "2026-02-06", time: "14:00", endTime: "15:00", color: "primary", description: "Review new dashboard mockups with the design team" },
  { id: "evt-7", title: "Product Launch", date: "2026-02-10", time: "09:00", endTime: "17:00", color: "destructive", description: "Launch day for v2.0 — all hands on deck" },
  { id: "evt-8", title: "Lunch & Learn", date: "2026-02-12", time: "12:00", endTime: "13:00", color: "success", description: "Tech talk: Migrating to React 19 Server Components" },
  { id: "evt-9", title: "Budget Meeting", date: "2026-02-13", time: "10:00", endTime: "11:00", color: "warning", description: "Q1 budget allocation review with finance" },
  { id: "evt-10", title: "1:1 with Manager", date: "2026-02-14", time: "16:00", endTime: "16:30", color: "primary", description: "Bi-weekly check-in and career development discussion" },
  { id: "evt-11", title: "Team Standup", date: "2026-02-17", time: "09:00", endTime: "09:15", color: "primary", description: "Daily sync with the engineering team" },
  { id: "evt-12", title: "Sprint Planning", date: "2026-02-18", time: "10:00", endTime: "12:00", color: "success", description: "Plan Sprint 15 backlog and estimate stories" },
  { id: "evt-13", title: "Stakeholder Demo", date: "2026-02-18", time: "15:00", endTime: "16:00", color: "warning", description: "Present new analytics features to stakeholders" },
  { id: "evt-14", title: "Security Audit", date: "2026-02-20", time: "09:00", endTime: "17:00", color: "destructive", description: "Annual security audit with external consultants" },
  { id: "evt-15", title: "UX Workshop", date: "2026-02-22", time: "13:00", endTime: "15:00", color: "success", description: "Collaborative workshop on improving user onboarding" },
  { id: "evt-16", title: "Client Call — Globex", date: "2026-02-24", time: "10:00", endTime: "11:00", color: "warning", description: "Kickoff meeting with new client Globex Industries" },
  { id: "evt-17", title: "Code Freeze", date: "2026-02-26", time: "18:00", color: "destructive", description: "No deployments until post-release validation" },
  { id: "evt-18", title: "Team Retrospective", date: "2026-02-27", time: "15:00", endTime: "16:00", color: "primary", description: "Sprint 15 retro — what went well, what to improve" },

  // March 2026 (next month)
  { id: "evt-19", title: "Q1 Review", date: "2026-03-02", time: "10:00", endTime: "12:00", color: "success", description: "Quarterly business review with leadership" },
  { id: "evt-20", title: "Conference Travel", date: "2026-03-05", time: "08:00", color: "warning", description: "Travel day for React Summit 2026" },
];

let nextId = 21;

export function getCalendarEvents(): CalendarEvent[] {
  return [...events];
}

export function addCalendarEvent(
  event: Omit<CalendarEvent, "id">
): CalendarEvent {
  const newEvent: CalendarEvent = {
    ...event,
    id: `evt-${nextId++}`,
  };
  events = [...events, newEvent];
  return newEvent;
}

export function deleteCalendarEvent(id: string): boolean {
  const length = events.length;
  events = events.filter((e) => e.id !== id);
  return events.length < length;
}

export function getEventsForDate(date: string): CalendarEvent[] {
  return events
    .filter((e) => e.date === date)
    .sort((a, b) => (a.time ?? "").localeCompare(b.time ?? ""));
}
