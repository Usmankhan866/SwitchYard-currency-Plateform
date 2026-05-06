"use client";

import { useState, useCallback } from "react";
import { Search, Plus, Filter, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
} from "@dashboardpack/core/components/ui/card";
import { Badge } from "@dashboardpack/core/components/ui/badge";
import { cn } from "@dashboardpack/core/lib/utils";
import { PageBreadcrumb } from "@/components/dashboard/breadcrumb";

// ---------------------------------------------------------------------------
// Types & Data
// ---------------------------------------------------------------------------

type Priority = "High" | "Medium" | "Low";

interface TaskCard {
  title: string;
  priority: Priority;
  due: string;
  assignees: string[];
  progress?: number;
  done?: boolean;
}

interface Column {
  id: string;
  label: string;
  headerBg: string;
  tasks: TaskCard[];
}

const priorityBorderColor: Record<Priority, string> = {
  High: "border-l-[#dc2626]",
  Medium: "border-l-[#e58a00]",
  Low: "border-l-[#2ca87f]",
};

const priorityBadgeVariant: Record<
  Priority,
  "destructive" | "warning" | "success"
> = {
  High: "destructive",
  Medium: "warning",
  Low: "success",
};

const avatarColors = [
  "bg-primary",
  "bg-[#2ca87f]",
  "bg-[#e58a00]",
  "bg-purple-500",
  "bg-[#dc2626]",
];

const initialColumns: Column[] = [
  {
    id: "todo",
    label: "To Do",
    headerBg: "bg-muted/60",
    tasks: [
      {
        title: "Redesign landing page",
        priority: "High",
        due: "Jan 20",
        assignees: ["JD", "KL", "AS"],
      },
      {
        title: "Update user documentation",
        priority: "Medium",
        due: "Jan 22",
        assignees: ["MR"],
      },
      {
        title: "Fix navigation bug",
        priority: "High",
        due: "Jan 18",
        assignees: ["AB"],
      },
      {
        title: "Create API endpoints",
        priority: "Low",
        due: "Jan 25",
        assignees: ["CD", "EF"],
      },
    ],
  },
  {
    id: "inprogress",
    label: "In Progress",
    headerBg: "bg-primary/5",
    tasks: [
      {
        title: "Dashboard analytics",
        priority: "High",
        due: "Jan 15",
        assignees: ["GH", "IJ", "AS"],
        progress: 65,
      },
      {
        title: "Mobile responsive",
        priority: "Medium",
        due: "Jan 19",
        assignees: ["MN", "OP"],
        progress: 40,
      },
      {
        title: "Payment integration",
        priority: "High",
        due: "Jan 16",
        assignees: ["QR"],
        progress: 80,
      },
    ],
  },
  {
    id: "review",
    label: "Review",
    headerBg: "bg-[#e58a00]/5",
    tasks: [
      {
        title: "Email template",
        priority: "Medium",
        due: "Jan 14",
        assignees: ["ST", "AS"],
      },
      {
        title: "User authentication",
        priority: "High",
        due: "Jan 13",
        assignees: ["WX"],
      },
    ],
  },
  {
    id: "done",
    label: "Done",
    headerBg: "bg-[#2ca87f]/5",
    tasks: [
      {
        title: "Database migration",
        priority: "Medium",
        due: "Jan 10",
        assignees: ["YZ", "AA"],
        done: true,
      },
      {
        title: "Setup CI/CD",
        priority: "Low",
        due: "Jan 8",
        assignees: ["BB"],
        done: true,
      },
      {
        title: "Design system",
        priority: "High",
        due: "Jan 5",
        assignees: ["CC", "DD", "EE"],
        done: true,
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function TaskBoardPage() {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState<"all" | "my">("all");
  const [addingTo, setAddingTo] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);

  // ---- Search + filter ----
  const getFilteredTasks = useCallback(
    (tasks: TaskCard[]) => {
      return tasks.filter((t) => {
        const matchesSearch =
          !searchQuery ||
          t.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter =
          filterTab === "all" || t.assignees.includes("AS");
        return matchesSearch && matchesFilter;
      });
    },
    [searchQuery, filterTab],
  );

  // ---- Add task ----
  const handleAddTask = useCallback(
    (columnId: string, title: string) => {
      if (!title.trim()) return;
      const today = new Date();
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const due = `${monthNames[today.getMonth()]} ${String(today.getDate()).padStart(2, "0")}`;
      setColumns((prev) =>
        prev.map((col) => {
          if (col.id !== columnId) return col;
          return {
            ...col,
            tasks: [
              ...col.tasks,
              {
                title: title.trim(),
                priority: "Medium" as Priority,
                due,
                assignees: ["AS"],
                done: col.id === "done",
              },
            ],
          };
        }),
      );
      setAddingTo(null);
      setNewTaskTitle("");
    },
    [],
  );

  // ---- Delete task ----
  const handleDeleteTask = useCallback(
    (columnId: string, taskIndex: number) => {
      setColumns((prev) =>
        prev.map((col) => {
          if (col.id !== columnId) return col;
          return {
            ...col,
            tasks: col.tasks.filter((_, i) => i !== taskIndex),
          };
        }),
      );
    },
    [],
  );

  // ---- Drag and drop ----
  const handleDragStart = useCallback(
    (e: React.DragEvent, fromCol: string, taskIndex: number) => {
      e.dataTransfer.setData(
        "text/plain",
        JSON.stringify({ fromCol, taskIndex }),
      );
      e.dataTransfer.effectAllowed = "move";
    },
    [],
  );

  const handleDrop = useCallback(
    (targetColId: string, e: React.DragEvent) => {
      e.preventDefault();
      setDragOverCol(null);
      try {
        const { fromCol, taskIndex } = JSON.parse(
          e.dataTransfer.getData("text/plain"),
        );
        if (fromCol === targetColId) return;
        setColumns((prev) => {
          const newCols = prev.map((c) => ({ ...c, tasks: [...c.tasks] }));
          const srcCol = newCols.find((c) => c.id === fromCol);
          const dstCol = newCols.find((c) => c.id === targetColId);
          if (!srcCol || !dstCol) return prev;
          const [task] = srcCol.tasks.splice(taskIndex, 1);
          if (targetColId === "done") task.done = true;
          if (fromCol === "done" && targetColId !== "done") task.done = false;
          dstCol.tasks.push(task);
          return newCols;
        });
      } catch {
        // ignore invalid drag data
      }
    },
    [],
  );

  // ---- Header "Add Task" button -> adds to "todo" column ----
  const handleHeaderAddTask = useCallback(() => {
    setAddingTo("todo");
    setNewTaskTitle("");
  }, []);

  return (
    <div>
      <PageBreadcrumb
        title="Task Board"
        items={[{ label: "Application" }, { label: "Task Board" }]}
      />

      {/* Header Card */}
      <Card className="mb-6">
        <CardContent className="py-4">
          <div className="flex items-center gap-3">
            <div className="relative max-w-xs flex-1">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-border bg-background py-2 pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilterTab("all")}
                className={cn(
                  "rounded-lg px-3 py-2 text-xs font-medium transition-colors",
                  filterTab === "all"
                    ? "bg-primary text-white"
                    : "text-muted-foreground hover:bg-muted",
                )}
              >
                All
              </button>
              <button
                onClick={() => setFilterTab("my")}
                className={cn(
                  "rounded-lg px-3 py-2 text-xs font-medium transition-colors",
                  filterTab === "my"
                    ? "bg-primary text-white"
                    : "text-muted-foreground hover:bg-muted",
                )}
              >
                My Tasks
              </button>
            </div>

            <div className="ml-auto">
              <button
                onClick={handleHeaderAddTask}
                className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                <Plus size={14} />
                Add Task
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Kanban Board */}
      <div className="grid grid-cols-4 gap-4">
        {columns.map((column) => {
          const filteredTasks = getFilteredTasks(column.tasks);
          return (
            <div key={column.id} className="flex flex-col gap-3">
              {/* Column Header */}
              <div
                className={`flex items-center justify-between rounded-lg px-3 py-2.5 ${column.headerBg}`}
              >
                <span className="text-sm font-semibold text-foreground">
                  {column.label}
                </span>
                <Badge variant="secondary" className="text-xs">
                  {filteredTasks.length}
                </Badge>
              </div>

              {/* Drop Zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOverCol(column.id);
                }}
                onDragLeave={() => setDragOverCol(null)}
                onDrop={(e) => handleDrop(column.id, e)}
                className={cn(
                  "min-h-[200px] space-y-2 rounded-lg p-1 transition-colors",
                  dragOverCol === column.id &&
                    "bg-primary/[0.03] ring-2 ring-primary/20",
                )}
              >
                {/* Task Cards */}
                {filteredTasks.map((task, i) => {
                  // Find the real index in column.tasks for drag/delete operations
                  const realIndex = column.tasks.indexOf(task);
                  return (
                    <div
                      key={`${column.id}-${realIndex}`}
                      draggable
                      onDragStart={(e) =>
                        handleDragStart(e, column.id, realIndex)
                      }
                      className={cn(
                        "group relative cursor-grab rounded-lg border border-border border-l-[3px] bg-card p-3 shadow-sm active:cursor-grabbing",
                        priorityBorderColor[task.priority],
                      )}
                    >
                      {/* Delete button */}
                      <button
                        onClick={() => handleDeleteTask(column.id, realIndex)}
                        className="absolute right-2 top-2 hidden rounded p-0.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive group-hover:block"
                        aria-label="Delete task"
                      >
                        <X size={14} />
                      </button>

                      <p
                        className={cn(
                          "mb-2 pr-5 text-sm font-medium leading-snug",
                          task.done
                            ? "text-muted-foreground line-through"
                            : "text-foreground",
                        )}
                      >
                        {task.title}
                        {task.done && (
                          <span className="ml-1 text-[#2ca87f]">&#10003;</span>
                        )}
                      </p>

                      <div className="mb-2 flex items-center gap-2">
                        <Badge variant={priorityBadgeVariant[task.priority]}>
                          {task.priority}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Due {task.due}
                        </span>
                      </div>

                      {task.progress !== undefined && (
                        <div className="mb-2">
                          <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                            <span>Progress</span>
                            <span>{task.progress}%</span>
                          </div>
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-primary"
                              style={{ width: `${task.progress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex -space-x-2">
                          {task.assignees.map((initials, idx) => (
                            <div
                              key={`${initials}-${idx}`}
                              className={`flex h-6 w-6 items-center justify-center rounded-full border-2 border-card text-[10px] font-medium text-white ${
                                avatarColors[idx % avatarColors.length]
                              }`}
                              title={initials}
                            >
                              {initials}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add Task (inline form or button) */}
              {addingTo === column.id ? (
                <div className="rounded-lg border border-primary/30 bg-card p-2">
                  <input
                    autoFocus
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter")
                        handleAddTask(column.id, newTaskTitle);
                      if (e.key === "Escape") {
                        setAddingTo(null);
                        setNewTaskTitle("");
                      }
                    }}
                    placeholder="Task title..."
                    className="w-full rounded border border-border bg-background px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => handleAddTask(column.id, newTaskTitle)}
                      className="rounded bg-primary px-3 py-1 text-xs text-white"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => {
                        setAddingTo(null);
                        setNewTaskTitle("");
                      }}
                      className="rounded border border-border px-3 py-1 text-xs text-muted-foreground"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setAddingTo(column.id);
                    setNewTaskTitle("");
                  }}
                  className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-border py-2 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                >
                  <Plus size={14} />
                  Add Task
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
