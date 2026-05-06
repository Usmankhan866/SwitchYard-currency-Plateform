// ---------------------------------------------------------------------------
// Kanban board mock data & CRUD helpers
// ---------------------------------------------------------------------------

export type KanbanPriority = "low" | "medium" | "high";

export interface KanbanTask {
  id: string;
  title: string;
  description?: string;
  priority: KanbanPriority;
  assignee?: string;
  assigneeInitials?: string;
  labels?: string[];
  dueDate?: string;
}

export interface KanbanColumn {
  id: string;
  title: string;
  tasks: KanbanTask[];
}

// ---------------------------------------------------------------------------
// Seed data
// ---------------------------------------------------------------------------

const columns: KanbanColumn[] = [
  {
    id: "backlog",
    title: "Backlog",
    tasks: [
      {
        id: "task-1",
        title: "Design new onboarding flow",
        description:
          "Create wireframes and high-fidelity mockups for the updated user onboarding experience targeting a 20% improvement in activation rate.",
        priority: "high",
        assignee: "Sarah Chen",
        assigneeInitials: "SC",
        labels: ["design", "ux"],
        dueDate: "2026-03-05",
      },
      {
        id: "task-2",
        title: "Evaluate third-party analytics providers",
        description:
          "Compare Mixpanel, Amplitude, and PostHog for our product analytics needs. Prepare a recommendation document.",
        priority: "medium",
        assignee: "James Wilson",
        assigneeInitials: "JW",
        labels: ["research"],
      },
      {
        id: "task-3",
        title: "Add multi-language support to email templates",
        description:
          "Implement i18n for transactional emails — at minimum English, Spanish, and French.",
        priority: "low",
        labels: ["i18n"],
        dueDate: "2026-04-01",
      },
      {
        id: "task-4",
        title: "Audit API rate-limiting configuration",
        description:
          "Review current rate limits across all public endpoints and adjust for the upcoming enterprise tier launch.",
        priority: "medium",
        assignee: "Priya Patel",
        assigneeInitials: "PP",
        labels: ["backend", "security"],
      },
    ],
  },
  {
    id: "in-progress",
    title: "In Progress",
    tasks: [
      {
        id: "task-5",
        title: "Implement Stripe subscription webhooks",
        description:
          "Handle subscription.created, updated, and deleted events to keep billing status in sync.",
        priority: "high",
        assignee: "Alex Rivera",
        assigneeInitials: "AR",
        labels: ["backend", "billing"],
        dueDate: "2026-02-25",
      },
      {
        id: "task-6",
        title: "Build dashboard activity feed component",
        description:
          "Real-time feed showing team activity — deployments, comments, and status changes.",
        priority: "medium",
        assignee: "Sarah Chen",
        assigneeInitials: "SC",
        labels: ["frontend"],
      },
      {
        id: "task-7",
        title: "Migrate user avatars to CDN",
        description:
          "Move avatar storage from local disk to Cloudflare R2 with automatic resizing.",
        priority: "low",
        assignee: "James Wilson",
        assigneeInitials: "JW",
        labels: ["infra"],
        dueDate: "2026-03-10",
      },
    ],
  },
  {
    id: "in-review",
    title: "In Review",
    tasks: [
      {
        id: "task-8",
        title: "Add role-based access control to team settings",
        description:
          "Restrict settings pages based on user roles (owner, admin, member). Includes middleware and UI guards.",
        priority: "high",
        assignee: "Priya Patel",
        assigneeInitials: "PP",
        labels: ["security", "frontend"],
        dueDate: "2026-02-20",
      },
      {
        id: "task-9",
        title: "Optimize SQL queries for the reports page",
        description:
          "Several queries on the monthly report exceed 500ms. Add proper indexes and refactor N+1 patterns.",
        priority: "medium",
        assignee: "Alex Rivera",
        assigneeInitials: "AR",
        labels: ["backend", "performance"],
      },
    ],
  },
  {
    id: "done",
    title: "Done",
    tasks: [
      {
        id: "task-10",
        title: "Set up CI/CD pipeline with GitHub Actions",
        description:
          "Automated lint, test, build, and deploy steps for staging and production environments.",
        priority: "medium",
        assignee: "James Wilson",
        assigneeInitials: "JW",
        labels: ["devops"],
      },
      {
        id: "task-11",
        title: "Implement dark mode theme toggle",
        description:
          "System/light/dark mode support using next-themes with smooth transitions.",
        priority: "low",
        assignee: "Sarah Chen",
        assigneeInitials: "SC",
        labels: ["frontend", "ux"],
      },
      {
        id: "task-12",
        title: "Create API documentation with OpenAPI spec",
        description:
          "Write Swagger/OpenAPI 3.1 spec for all public endpoints and publish to docs site.",
        priority: "high",
        assignee: "Priya Patel",
        assigneeInitials: "PP",
        labels: ["docs"],
        dueDate: "2026-02-15",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Auto-increment counter for new task IDs
// ---------------------------------------------------------------------------

let nextId = 13;

// ---------------------------------------------------------------------------
// Read
// ---------------------------------------------------------------------------

export function getKanbanColumns(): KanbanColumn[] {
  return columns.map((col) => ({ ...col, tasks: [...col.tasks] }));
}

// ---------------------------------------------------------------------------
// Move / reorder
// ---------------------------------------------------------------------------

export function moveTask(
  taskId: string,
  fromColumnId: string,
  toColumnId: string,
  newIndex: number,
): void {
  const fromCol = columns.find((c) => c.id === fromColumnId);
  const toCol = columns.find((c) => c.id === toColumnId);
  if (!fromCol || !toCol) return;

  const taskIndex = fromCol.tasks.findIndex((t) => t.id === taskId);
  if (taskIndex === -1) return;

  const [task] = fromCol.tasks.splice(taskIndex, 1);
  toCol.tasks.splice(newIndex, 0, task);
}

// ---------------------------------------------------------------------------
// Create
// ---------------------------------------------------------------------------

export function addTask(
  columnId: string,
  task: Omit<KanbanTask, "id">,
): KanbanTask | undefined {
  const col = columns.find((c) => c.id === columnId);
  if (!col) return undefined;

  const newTask: KanbanTask = { ...task, id: `task-${nextId++}` };
  col.tasks.push(newTask);
  return newTask;
}

// ---------------------------------------------------------------------------
// Delete
// ---------------------------------------------------------------------------

export function deleteTask(columnId: string, taskId: string): boolean {
  const col = columns.find((c) => c.id === columnId);
  if (!col) return false;

  const idx = col.tasks.findIndex((t) => t.id === taskId);
  if (idx === -1) return false;

  col.tasks.splice(idx, 1);
  return true;
}

// ---------------------------------------------------------------------------
// Update
// ---------------------------------------------------------------------------

export function updateTask(
  columnId: string,
  taskId: string,
  updates: Partial<Omit<KanbanTask, "id">>,
): KanbanTask | undefined {
  const col = columns.find((c) => c.id === columnId);
  if (!col) return undefined;

  const task = col.tasks.find((t) => t.id === taskId);
  if (!task) return undefined;

  Object.assign(task, updates);
  return { ...task };
}
