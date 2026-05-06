"use client";

import { useState, useMemo, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  format,
  addMonths,
  subMonths,
  addDays,
  startOfMonth,
  getDaysInMonth,
  getDay,
  isToday as isTodayFn,
  parseISO,
  isSameMonth,
} from "date-fns";
import { ChevronLeft, ChevronRight, Clock, Pencil, Trash2 } from "lucide-react";

import { PageBreadcrumb } from "@/components/dashboard/breadcrumb";
import { Card, CardContent, CardHeader } from "@dashboardpack/core/components/ui/card";
import { Badge } from "@dashboardpack/core/components/ui/badge";
import { Button } from "@dashboardpack/core/components/ui/button";
import { Input } from "@dashboardpack/core/components/ui/input";
import { Textarea } from "@dashboardpack/core/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@dashboardpack/core/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@dashboardpack/core/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@dashboardpack/core/components/ui/form";
import { ConfirmDialog } from "@dashboardpack/core/components/shared/confirm-dialog";

// ---------------------------------------------------------------------------
// Types & constants
// ---------------------------------------------------------------------------

interface CalendarEvent {
  id: string;
  date: string; // "YYYY-MM-DD"
  title: string;
  time: string;
  description: string;
  color: string;
  category: "team" | "milestone" | "client" | "launch" | "company";
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CATEGORY_COLORS: Record<CalendarEvent["category"], string> = {
  team: "#4680ff",
  milestone: "#2ca87f",
  client: "#e58a00",
  launch: "#dc2626",
  company: "#6f42c1",
};

const CATEGORY_LABELS: Record<CalendarEvent["category"], string> = {
  team: "Team Event",
  milestone: "Milestone",
  client: "Client",
  launch: "Launch",
  company: "Company",
};

// ---------------------------------------------------------------------------
// Generate events relative to today so the calendar always has data
// ---------------------------------------------------------------------------

const EVENT_TEMPLATES: { title: string; time: string; description: string; category: CalendarEvent["category"]; dayOffset: number }[] = [
  { title: "Team Standup", time: "9:00 AM", description: "Daily sync with the engineering team to review sprint progress.", category: "team", dayOffset: -5 },
  { title: "Sprint Review", time: "2:00 PM", description: "Demo completed features to stakeholders and gather feedback.", category: "milestone", dayOffset: -1 },
  { title: "Client Meeting", time: "11:00 AM", description: "Quarterly review with Acme Corp to discuss project roadmap.", category: "client", dayOffset: 2 },
  { title: "Product Launch", time: "10:00 AM", description: "Public release of v2.0 with new dashboard features.", category: "launch", dayOffset: 7 },
  { title: "Company All-Hands", time: "3:00 PM", description: "Monthly all-hands meeting with Q&A session.", category: "company", dayOffset: 12 },
  { title: "Design Workshop", time: "10:00 AM", description: "Collaborative session to refine the new component library.", category: "team", dayOffset: 18 },
  { title: "Beta Milestone", time: "12:00 PM", description: "Feature-freeze deadline for the beta release.", category: "milestone", dayOffset: 25 },
  { title: "Client Onboarding", time: "1:00 PM", description: "Kickoff session with new enterprise client.", category: "client", dayOffset: 35 },
  { title: "v2.1 Release", time: "9:00 AM", description: "Patch release with performance improvements and bug fixes.", category: "launch", dayOffset: 45 },
  { title: "Team Offsite", time: "8:00 AM", description: "Two-day team offsite for planning and team building.", category: "company", dayOffset: 55 },
];

function generateInitialEvents(): CalendarEvent[] {
  const today = new Date();
  return EVENT_TEMPLATES.map((tpl, i) => {
    const eventDate = addDays(today, tpl.dayOffset);
    return {
      id: `evt-${i + 1}`,
      date: format(eventDate, "yyyy-MM-dd"),
      title: tpl.title,
      time: tpl.time,
      description: tpl.description,
      color: CATEGORY_COLORS[tpl.category],
      category: tpl.category,
    };
  });
}

const INITIAL_EVENTS: CalendarEvent[] = generateInitialEvents();

// ---------------------------------------------------------------------------
// Zod schema for event form
// ---------------------------------------------------------------------------

const eventFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  time: z.string().min(1, "Time is required"),
  description: z.string().optional(),
  category: z.enum(["team", "milestone", "client", "launch", "company"]),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

// ---------------------------------------------------------------------------
// Helper: build calendar grid for a given month
// ---------------------------------------------------------------------------

function buildCalendarGrid(month: Date): (Date | null)[] {
  const first = startOfMonth(month);
  const startDay = getDay(first);
  const totalDays = getDaysInMonth(month);
  const cells: (Date | null)[] = [];

  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= totalDays; d++) {
    cells.push(new Date(month.getFullYear(), month.getMonth(), d));
  }
  while (cells.length % 7 !== 0) cells.push(null);

  return cells;
}

function dateToString(d: Date): string {
  return format(d, "yyyy-MM-dd");
}

// ---------------------------------------------------------------------------
// Event Form Dialog component
// ---------------------------------------------------------------------------

function EventFormDialog({
  mode,
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  dateLabel,
}: {
  mode: "add" | "edit";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: EventFormValues) => void;
  defaultValues?: Partial<EventFormValues>;
  dateLabel: string;
}) {
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    values: {
      title: defaultValues?.title ?? "",
      time: defaultValues?.time ?? "",
      description: defaultValues?.description ?? "",
      category: defaultValues?.category ?? "team",
    },
  });

  function handleSubmit(values: EventFormValues) {
    onSubmit(values);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add Event" : "Edit Event"}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">{dateLabel}</p>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Event title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 9:00 AM" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Optional description"
                      className="min-h-20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(
                        Object.entries(CATEGORY_LABELS) as [
                          CalendarEvent["category"],
                          string,
                        ][]
                      ).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          <span className="flex items-center gap-2">
                            <span
                              className="h-2 w-2 rounded-full"
                              style={{
                                backgroundColor: CATEGORY_COLORS[value],
                              }}
                            />
                            {label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {mode === "add" ? "Create Event" : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// View Event Dialog component
// ---------------------------------------------------------------------------

function ViewEventDialog({
  event,
  open,
  onOpenChange,
  onEdit,
  onDelete,
}: {
  event: CalendarEvent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  if (!event) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {/* Color bar */}
        <div
          className="absolute left-0 top-0 h-1.5 w-full rounded-t-lg"
          style={{ backgroundColor: event.color }}
        />

        <DialogHeader className="pt-2">
          <DialogTitle className="text-lg">{event.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>
              {format(parseISO(event.date), "MMMM d, yyyy")} · {event.time}
            </span>
          </div>

          {event.description && (
            <p className="text-sm text-foreground">{event.description}</p>
          )}

          <Badge
            className="border-0 text-xs font-medium"
            style={{
              backgroundColor: event.color + "20",
              color: event.color,
            }}
          >
            {CATEGORY_LABELS[event.category]}
          </Badge>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button
            variant="outline"
            onClick={onEdit}
          >
            <Pencil className="mr-1.5 h-3.5 w-3.5" />
            Edit
          </Button>
          <Button variant="destructive" onClick={onDelete}>
            <Trash2 className="mr-1.5 h-3.5 w-3.5" />
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// Main page component
// ---------------------------------------------------------------------------

let nextId = 11;

export default function CalendarPage() {
  // ---- State ----
  const [currentMonth, setCurrentMonth] = useState(() => startOfMonth(new Date()));
  const [events, setEvents] = useState<CalendarEvent[]>(INITIAL_EVENTS);

  // Dialog state
  const [viewEvent, setViewEvent] = useState<CalendarEvent | null>(null);
  const [addDate, setAddDate] = useState<string | null>(null);
  const [editEvent, setEditEvent] = useState<CalendarEvent | null>(null);
  const [deleteEvent, setDeleteEvent] = useState<CalendarEvent | null>(null);

  // ---- Derived data ----
  const monthLabel = format(currentMonth, "MMMM yyyy");
  const cells = useMemo(() => buildCalendarGrid(currentMonth), [currentMonth]);

  const rows = useMemo(() => {
    const r: (Date | null)[][] = [];
    for (let i = 0; i < cells.length; i += 7) {
      r.push(cells.slice(i, i + 7));
    }
    return r;
  }, [cells]);

  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    for (const evt of events) {
      (map[evt.date] ??= []).push(evt);
    }
    return map;
  }, [events]);

  const upcomingEvents = useMemo(
    () =>
      events
        .filter((e) => isSameMonth(parseISO(e.date), currentMonth))
        .sort((a, b) => a.date.localeCompare(b.date)),
    [events, currentMonth],
  );

  // ---- Handlers ----
  const goToPrev = useCallback(
    () => setCurrentMonth((m) => subMonths(m, 1)),
    [],
  );
  const goToNext = useCallback(
    () => setCurrentMonth((m) => addMonths(m, 1)),
    [],
  );
  const goToToday = useCallback(() => {
    const now = new Date();
    setCurrentMonth(new Date(now.getFullYear(), now.getMonth(), 1));
  }, []);

  const handleAddSubmit = useCallback(
    (values: EventFormValues) => {
      if (!addDate) return;
      const newEvent: CalendarEvent = {
        id: `evt-${nextId++}`,
        date: addDate,
        title: values.title,
        time: values.time,
        description: values.description ?? "",
        color: CATEGORY_COLORS[values.category],
        category: values.category,
      };
      setEvents((prev) => [...prev, newEvent]);
      setAddDate(null);
      toast.success("Event created");
    },
    [addDate],
  );

  const handleEditSubmit = useCallback(
    (values: EventFormValues) => {
      if (!editEvent) return;
      setEvents((prev) =>
        prev.map((e) =>
          e.id === editEvent.id
            ? {
                ...e,
                title: values.title,
                time: values.time,
                description: values.description ?? "",
                color: CATEGORY_COLORS[values.category],
                category: values.category,
              }
            : e,
        ),
      );
      setEditEvent(null);
      toast.success("Event updated");
    },
    [editEvent],
  );

  const handleDelete = useCallback(() => {
    if (!deleteEvent) return;
    setEvents((prev) => prev.filter((e) => e.id !== deleteEvent.id));
    setDeleteEvent(null);
    setViewEvent(null);
    toast.success("Event deleted");
  }, [deleteEvent]);

  // ---- Render ----
  return (
    <>
      <PageBreadcrumb
        title="Calendar"
        items={[{ label: "Application" }, { label: "Calendar" }]}
      />

      <div className="grid grid-cols-12 gap-6">
        {/* Calendar grid */}
        <div className="col-span-12 lg:col-span-8">
          <Card>
            {/* Month navigation */}
            <CardHeader className="border-b border-border pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={goToPrev}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                    aria-label="Previous month"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={goToNext}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                    aria-label="Next month"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  <h2 className="text-base font-semibold text-foreground">
                    {monthLabel}
                  </h2>
                </div>
                <button
                  onClick={goToToday}
                  className="rounded-lg px-4 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "#4680ff" }}
                >
                  Today
                </button>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {/* Weekday header */}
              <div className="grid grid-cols-7 border-b border-border">
                {WEEKDAYS.map((day) => (
                  <div
                    key={day}
                    className="py-2 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Day cells */}
              {rows.map((row, rowIdx) => (
                <div key={rowIdx} className="grid grid-cols-7">
                  {row.map((cellDate, colIdx) => {
                    const dateStr = cellDate ? dateToString(cellDate) : "";
                    const dayEvents = cellDate
                      ? eventsByDate[dateStr] ?? []
                      : [];
                    const today = cellDate ? isTodayFn(cellDate) : false;
                    const dayNum = cellDate ? cellDate.getDate() : null;

                    return (
                      <div
                        key={colIdx}
                        className={`min-h-20 border-b border-r border-border p-1.5 text-sm last:border-r-0 ${
                          !cellDate
                            ? "bg-muted/20"
                            : "cursor-pointer hover:bg-muted/30"
                        } ${today ? "bg-primary/10" : ""}`}
                        onClick={() => {
                          if (cellDate) setAddDate(dateStr);
                        }}
                      >
                        {cellDate && dayNum !== null && (
                          <>
                            <span
                              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                                today ? "text-white" : "text-foreground"
                              }`}
                              style={
                                today ? { backgroundColor: "#4680ff" } : {}
                              }
                            >
                              {dayNum}
                            </span>
                            {dayEvents.map((evt) => (
                              <div
                                key={evt.id}
                                className="mt-1 flex cursor-pointer items-center gap-1 rounded px-1 py-0.5 text-xs font-medium transition-opacity hover:opacity-80"
                                style={{
                                  backgroundColor: evt.color + "20",
                                  color: evt.color,
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setViewEvent(evt);
                                }}
                              >
                                <span
                                  className="h-1.5 w-1.5 shrink-0 rounded-full"
                                  style={{ backgroundColor: evt.color }}
                                />
                                <span className="truncate">{evt.title}</span>
                              </div>
                            ))}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Upcoming events sidebar */}
        <div className="col-span-12 lg:col-span-4">
          <Card>
            <CardHeader className="border-b border-border pb-4">
              <h2 className="text-base font-semibold text-foreground">
                Upcoming Events
              </h2>
            </CardHeader>
            <CardContent className="p-4">
              {upcomingEvents.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  No events this month.
                </p>
              ) : (
                <ul className="space-y-3">
                  {upcomingEvents.map((event) => (
                    <li
                      key={event.id}
                      className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/30"
                      onClick={() => setViewEvent(event)}
                    >
                      {/* Color accent */}
                      <div
                        className="mt-0.5 min-h-10 w-1 shrink-0 self-stretch rounded-full"
                        style={{ backgroundColor: event.color }}
                      />

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {event.title}
                        </p>
                        <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>
                            {format(parseISO(event.date), "MMM d")} ·{" "}
                            {event.time}
                          </span>
                        </div>
                      </div>

                      <Badge
                        className="shrink-0 border-0 text-xs font-medium"
                        style={{
                          backgroundColor: event.color + "20",
                          color: event.color,
                        }}
                      >
                        {format(parseISO(event.date), "MMM d")}
                      </Badge>
                    </li>
                  ))}
                </ul>
              )}

              {/* Legend */}
              <div className="mt-6 border-t border-border pt-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Event Types
                </p>
                <div className="space-y-2">
                  {(
                    Object.entries(CATEGORY_LABELS) as [
                      CalendarEvent["category"],
                      string,
                    ][]
                  ).map(([key, label]) => (
                    <div key={key} className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: CATEGORY_COLORS[key] }}
                      />
                      <span className="text-xs text-muted-foreground">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* View Event Dialog */}
      <ViewEventDialog
        event={viewEvent}
        open={viewEvent !== null}
        onOpenChange={(open) => !open && setViewEvent(null)}
        onEdit={() => {
          setEditEvent(viewEvent);
          setViewEvent(null);
        }}
        onDelete={() => {
          setDeleteEvent(viewEvent);
        }}
      />

      {/* Add Event Dialog */}
      <EventFormDialog
        mode="add"
        open={addDate !== null}
        onOpenChange={(open) => !open && setAddDate(null)}
        onSubmit={handleAddSubmit}
        dateLabel={
          addDate
            ? format(parseISO(addDate), "EEEE, MMMM d, yyyy")
            : ""
        }
      />

      {/* Edit Event Dialog */}
      <EventFormDialog
        mode="edit"
        open={editEvent !== null}
        onOpenChange={(open) => !open && setEditEvent(null)}
        onSubmit={handleEditSubmit}
        defaultValues={
          editEvent
            ? {
                title: editEvent.title,
                time: editEvent.time,
                description: editEvent.description,
                category: editEvent.category,
              }
            : undefined
        }
        dateLabel={
          editEvent
            ? format(parseISO(editEvent.date), "EEEE, MMMM d, yyyy")
            : ""
        }
      />

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        open={deleteEvent !== null}
        onOpenChange={(open) => !open && setDeleteEvent(null)}
        title="Delete Event"
        description={`Are you sure you want to delete "${deleteEvent?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </>
  );
}
