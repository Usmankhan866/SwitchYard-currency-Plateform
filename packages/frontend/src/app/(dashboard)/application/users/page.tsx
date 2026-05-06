"use client";

import { useState, useCallback } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Eye, Pencil, Trash2, Plus } from "lucide-react";

import { PageBreadcrumb } from "@/components/dashboard/breadcrumb";
import { Card, CardContent, CardHeader } from "@dashboardpack/core/components/ui/card";
import { Badge } from "@dashboardpack/core/components/ui/badge";
import { Button } from "@dashboardpack/core/components/ui/button";
import { Input } from "@dashboardpack/core/components/ui/input";
import { Checkbox } from "@dashboardpack/core/components/ui/checkbox";
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
import { DataTable, DataTableColumnHeader } from "@dashboardpack/core/components/shared/data-table";
import { ConfirmDialog } from "@dashboardpack/core/components/shared/confirm-dialog";
import {
  mockUsers,
  nextUserId,
  getInitials,
  randomAvatarColor,
  type MockUser,
} from "@/lib/mock-data";

// ---------------------------------------------------------------------------
// Zod schema
// ---------------------------------------------------------------------------

const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  position: z.string().optional().default(""),
  office: z.string().optional().default(""),
  age: z.coerce
    .number({ error: "Age must be a number" })
    .min(18, "Minimum age is 18")
    .max(99, "Maximum age is 99"),
  status: z.enum(["Active", "Disabled"]),
});

type UserFormValues = z.infer<typeof userSchema>;

// ---------------------------------------------------------------------------
// UserFormDialog
// ---------------------------------------------------------------------------

interface UserFormDialogProps {
  mode: "add" | "edit";
  user?: MockUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: UserFormValues) => void;
}

function UserFormDialog({ mode, user, open, onOpenChange, onSubmit }: UserFormDialogProps) {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      position: user?.position ?? "",
      office: user?.office ?? "",
      age: user?.age ?? 25,
      status: user?.status ?? "Active",
    },
  });

  // Reset form when dialog opens with new user
  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      if (isOpen) {
        form.reset({
          name: user?.name ?? "",
          email: user?.email ?? "",
          position: user?.position ?? "",
          office: user?.office ?? "",
          age: user?.age ?? 25,
          status: user?.status ?? "Active",
        });
      }
      onOpenChange(isOpen);
    },
    [form, user, onOpenChange]
  );

  const handleSubmit = (values: UserFormValues) => {
    onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-120">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Add User" : "Edit User"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Jane Smith" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="jane@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              {/* Position */}
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Developer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Office */}
              <FormField
                control={form.control}
                name="office"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Office</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Tokyo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Age */}
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input type="number" min={18} max={99} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Disabled">Disabled</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {mode === "add" ? "Add User" : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// ViewUserDialog
// ---------------------------------------------------------------------------

interface ViewUserDialogProps {
  user: MockUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (user: MockUser) => void;
}

function ViewUserDialog({ user, open, onOpenChange, onEdit }: ViewUserDialogProps) {
  if (!user) return null;

  const fields: { label: string; value: string | number }[] = [
    { label: "Email", value: user.email },
    { label: "Position", value: user.position },
    { label: "Office", value: user.office },
    { label: "Age", value: user.age },
    { label: "Start Date", value: user.startDate },
    { label: "Status", value: user.status },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-105">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>

        {/* Avatar + name */}
        <div className="flex flex-col items-center gap-3 py-2">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-full text-xl font-semibold text-white"
            style={{ backgroundColor: user.color }}
          >
            {user.initials}
          </div>
          <div className="text-center">
            <p className="text-base font-semibold text-foreground">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.position}</p>
          </div>
        </div>

        {/* Fields */}
        <div className="divide-y rounded-lg border">
          {fields.map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between px-4 py-2.5 text-sm">
              <span className="text-muted-foreground">{label}</span>
              {label === "Status" ? (
                <Badge variant={value === "Active" ? "success" : "destructive"}>
                  {value}
                </Badge>
              ) : (
                <span className="font-medium text-foreground">{value}</span>
              )}
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button
            onClick={() => {
              onOpenChange(false);
              onEdit(user);
            }}
          >
            <Pencil className="size-4" />
            Edit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

type DialogMode = null | "add" | "edit" | "view";

export default function UsersPage() {
  const [users, setUsers] = useState<MockUser[]>(mockUsers);
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [selectedUser, setSelectedUser] = useState<MockUser | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<MockUser | null>(null);
  const [bulkDeleteRows, setBulkDeleteRows] = useState<MockUser[] | null>(null);

  // ------------------------------------------------------------------
  // Handlers
  // ------------------------------------------------------------------

  const openAdd = () => {
    setSelectedUser(null);
    setDialogMode("add");
  };

  const openView = useCallback((user: MockUser) => {
    setSelectedUser(user);
    setDialogMode("view");
  }, []);

  const openEdit = useCallback((user: MockUser) => {
    setSelectedUser(user);
    setDialogMode("edit");
  }, []);

  const openDelete = useCallback((user: MockUser) => {
    setDeleteConfirm(user);
  }, []);

  const handleAddSubmit = (values: UserFormValues) => {
    const newUser: MockUser = {
      id: nextUserId(users),
      initials: getInitials(values.name),
      color: randomAvatarColor(),
      name: values.name,
      email: values.email,
      position: values.position ?? "",
      office: values.office ?? "",
      age: values.age,
      startDate: new Date().toISOString().split("T")[0],
      status: values.status,
    };
    setUsers((prev) => [newUser, ...prev]);
    toast.success(`User "${values.name}" added`);
  };

  const handleEditSubmit = (values: UserFormValues) => {
    if (!selectedUser) return;
    setUsers((prev) =>
      prev.map((u) =>
        u.id === selectedUser.id
          ? {
              ...u,
              name: values.name,
              email: values.email,
              position: values.position ?? "",
              office: values.office ?? "",
              age: values.age,
              status: values.status,
              initials: getInitials(values.name),
            }
          : u
      )
    );
    toast.success(`User "${values.name}" updated`);
  };

  const handleDelete = () => {
    if (!deleteConfirm) return;
    setUsers((prev) => prev.filter((u) => u.id !== deleteConfirm.id));
    toast.success(`User "${deleteConfirm.name}" deleted`);
    setDeleteConfirm(null);
  };

  const handleBulkDelete = () => {
    if (!bulkDeleteRows) return;
    const ids = new Set(bulkDeleteRows.map((u) => u.id));
    setUsers((prev) => prev.filter((u) => !ids.has(u.id)));
    toast.success(`${bulkDeleteRows.length} user${bulkDeleteRows.length !== 1 ? "s" : ""} deleted`);
    setBulkDeleteRows(null);
  };

  // ------------------------------------------------------------------
  // Column definitions
  // ------------------------------------------------------------------

  const columns: ColumnDef<MockUser>[] = [
    // Checkbox selection
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected()
              ? true
              : table.getIsSomePageRowsSelected()
              ? "indeterminate"
              : false
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          onClick={(e) => e.stopPropagation()}
        />
      ),
      enableSorting: false,
      enableHiding: false,
      meta: { className: "w-10" },
    },

    // User (avatar + name + email)
    {
      id: "user",
      accessorFn: (row) => row.name,
      header: ({ column }) => <DataTableColumnHeader column={column} title="User" />,
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
              style={{ backgroundColor: user.color }}
            >
              {user.initials}
            </div>
            <div>
              <p className="font-medium text-foreground">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
        );
      },
      meta: { mobileLabel: "User" },
    },

    // Position
    {
      accessorKey: "position",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Position" />,
      meta: { mobileLabel: "Position" },
    },

    // Office
    {
      accessorKey: "office",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Office" />,
      meta: { mobileLabel: "Office" },
    },

    // Age
    {
      accessorKey: "age",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Age" />,
      meta: { mobileLabel: "Age", className: "w-16" },
    },

    // Start Date
    {
      accessorKey: "startDate",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Start Date" />,
      meta: { mobileLabel: "Start Date" },
    },

    // Status
    {
      accessorKey: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge variant={status === "Active" ? "success" : "destructive"}>
            {status}
          </Badge>
        );
      },
      filterFn: (row, id, filterValues: string[]) => {
        if (!filterValues.length) return true;
        return filterValues.includes(row.getValue(id));
      },
      meta: { mobileLabel: "Status" },
    },

    // Actions
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-1">
            <button
              className="flex h-7 w-7 items-center justify-center rounded border text-muted-foreground hover:border-primary hover:text-primary transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                openView(user);
              }}
              aria-label="View user"
            >
              <Eye className="h-3.5 w-3.5" />
            </button>
            <button
              className="flex h-7 w-7 items-center justify-center rounded border text-muted-foreground hover:border-[#2ca87f] hover:text-[#2ca87f] transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                openEdit(user);
              }}
              aria-label="Edit user"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              className="flex h-7 w-7 items-center justify-center rounded border text-muted-foreground hover:border-[#dc2626] hover:text-[#dc2626] transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                openDelete(user);
              }}
              aria-label="Delete user"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
      meta: { className: "w-28" },
    },
  ];

  // ------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------

  return (
    <div>
      <PageBreadcrumb
        title="Users"
        items={[{ label: "Application" }, { label: "Users" }]}
      />

      <Card>
        <CardHeader className="flex-row flex-wrap items-center justify-between gap-2 space-y-0 pb-4">
          <h5 className="text-base font-semibold text-foreground">User List</h5>
          <Button onClick={openAdd} size="sm">
            <Plus className="size-4" />
            Add User
          </Button>
        </CardHeader>

        <CardContent>
          <DataTable
            columns={columns}
            data={users}
            searchPlaceholder="Search users..."
            enableRowSelection
            exportFilename="users"
            emptyMessage="No users found."
            facetedFilters={[
              {
                columnId: "status",
                title: "Status",
                options: [
                  { label: "Active", value: "Active" },
                  { label: "Disabled", value: "Disabled" },
                ],
              },
            ]}
            bulkActions={(selectedRows) => (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setBulkDeleteRows(selectedRows)}
              >
                <Trash2 className="size-4" />
                Delete ({selectedRows.length})
              </Button>
            )}
          />
        </CardContent>
      </Card>

      {/* Add User Dialog */}
      <UserFormDialog
        mode="add"
        open={dialogMode === "add"}
        onOpenChange={(open) => !open && setDialogMode(null)}
        onSubmit={handleAddSubmit}
      />

      {/* Edit User Dialog */}
      <UserFormDialog
        mode="edit"
        user={selectedUser}
        open={dialogMode === "edit"}
        onOpenChange={(open) => !open && setDialogMode(null)}
        onSubmit={handleEditSubmit}
      />

      {/* View User Dialog */}
      <ViewUserDialog
        user={selectedUser}
        open={dialogMode === "view"}
        onOpenChange={(open) => !open && setDialogMode(null)}
        onEdit={(user) => {
          setSelectedUser(user);
          setDialogMode("edit");
        }}
      />

      {/* Single Delete Confirm */}
      <ConfirmDialog
        open={deleteConfirm !== null}
        onOpenChange={(open) => !open && setDeleteConfirm(null)}
        title="Delete User"
        description={`Are you sure you want to delete "${deleteConfirm?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
      />

      {/* Bulk Delete Confirm */}
      <ConfirmDialog
        open={bulkDeleteRows !== null}
        onOpenChange={(open) => !open && setBulkDeleteRows(null)}
        title="Delete Selected Users"
        description={`Are you sure you want to delete ${bulkDeleteRows?.length ?? 0} selected user${(bulkDeleteRows?.length ?? 0) !== 1 ? "s" : ""}? This action cannot be undone.`}
        confirmLabel="Delete All"
        variant="destructive"
        onConfirm={handleBulkDelete}
      />
    </div>
  );
}
