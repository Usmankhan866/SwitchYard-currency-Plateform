"use client";

import { useState } from "react";
import {
  FolderOpen,
  File,
  Upload,
  Grid3x3,
  List,
  ChevronRight,
  Search,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@dashboardpack/core/components/ui/card";
import { Badge } from "@dashboardpack/core/components/ui/badge";
import { PageBreadcrumb } from "@/components/dashboard/breadcrumb";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const folderTree = [
  { name: "My Drive", isParent: true },
  { name: "Documents", files: 24 },
  { name: "Images", files: 156 },
  { name: "Projects", files: 12 },
  { name: "Downloads", files: 48 },
];

const folderGrid = [
  { name: "Project Assets", files: 128, size: "2.4 GB" },
  { name: "Marketing Materials", files: 64, size: "1.2 GB" },
  { name: "Client Deliverables", files: 32, size: "890 MB" },
  { name: "Archives", files: 96, size: "3.1 GB" },
];

const recentFiles = [
  {
    name: "quarterly-report.pdf",
    type: "pdf",
    size: "2.4 MB",
    modified: "Jan 15",
    sharedWith: ["JD", "KL", "MR"],
  },
  {
    name: "design-mockup.fig",
    type: "fig",
    size: "14 MB",
    modified: "Jan 14",
    sharedWith: ["AB", "CD"],
  },
  {
    name: "budget-2026.xlsx",
    type: "xlsx",
    size: "1.2 MB",
    modified: "Jan 13",
    sharedWith: ["TE"],
  },
  {
    name: "meeting-notes.docx",
    type: "docx",
    size: "420 KB",
    modified: "Jan 12",
    sharedWith: ["PQ", "RS"],
  },
  {
    name: "logo-final.svg",
    type: "svg",
    size: "89 KB",
    modified: "Jan 10",
    sharedWith: ["UV"],
  },
];

const fileTypeColors: Record<string, string> = {
  pdf: "text-[#dc2626]",
  fig: "text-primary",
  xlsx: "text-[#2ca87f]",
  docx: "text-primary",
  svg: "text-[#e58a00]",
};

const avatarColors = [
  "bg-primary",
  "bg-[#2ca87f]",
  "bg-[#e58a00]",
  "bg-[#dc2626]",
  "bg-purple-500",
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function FileManagerPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());

  function toggleFileSelection(name: string) {
    setSelectedFiles((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  }

  return (
    <div>
      <PageBreadcrumb
        title="File Manager"
        items={[{ label: "Application" }, { label: "File Manager" }]}
      />

      <div className="grid grid-cols-12 gap-6">
        {/* Left Sidebar */}
        <div className="col-span-3">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-semibold">Storage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Storage Usage */}
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Used</span>
                  <span className="font-medium">6.4 GB / 15 GB</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: "43%" }}
                  />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  8.6 GB remaining
                </p>
              </div>

              {/* Folder Tree */}
              <div className="mt-2 space-y-1">
                {folderTree.map((item) =>
                  item.isParent ? (
                    <div
                      key={item.name}
                      className="flex items-center gap-2 rounded-md px-2 py-2 text-sm font-semibold text-foreground"
                    >
                      <FolderOpen
                        size={16}
                        className="text-primary"
                      />
                      {item.name}
                    </div>
                  ) : (
                    <button
                      key={item.name}
                      className="flex w-full items-center justify-between rounded-md px-2 py-1.5 pl-6 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <div className="flex items-center gap-2">
                        <FolderOpen size={14} className="text-[#e58a00]" />
                        {item.name}
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {item.files}
                      </Badge>
                    </button>
                  )
                )}
              </div>

              {/* Upgrade Button */}
              <button className="mt-4 w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90">
                Upgrade Storage
              </button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="col-span-9 space-y-6">
          <Card>
            <CardHeader className="pb-4">
              {/* Header bar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <span>My Drive</span>
                  <ChevronRight size={14} />
                  <span className="font-medium text-foreground">Documents</span>
                </div>
                <div className="flex items-center gap-2">
                  {/* View mode toggle */}
                  <div className="flex items-center rounded-md border bg-muted/30 p-0.5">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`rounded p-1.5 transition-colors ${
                        viewMode === "grid"
                          ? "bg-primary text-white shadow-sm"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                      aria-label="Grid view"
                    >
                      <Grid3x3 size={16} />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`rounded p-1.5 transition-colors ${
                        viewMode === "list"
                          ? "bg-primary text-white shadow-sm"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                      aria-label="List view"
                    >
                      <List size={16} />
                    </button>
                  </div>
                  <button className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-90">
                    <Upload size={14} />
                    Upload
                  </button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Folder Grid */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-foreground">
                  Folders
                </h3>
                <div className="grid grid-cols-4 gap-3">
                  {folderGrid.map((folder) => (
                    <button
                      key={folder.name}
                      className="group rounded-xl border border-border p-4 text-left transition-all hover:border-primary/40 hover:shadow-md"
                    >
                      <FolderOpen
                        size={32}
                        className="mb-2 text-[#e58a00]"
                      />
                      <p className="truncate text-sm font-medium text-foreground">
                        {folder.name}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {folder.files} files
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {folder.size}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Files */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground">
                    Recent Files
                  </h3>
                  {selectedFiles.size > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {selectedFiles.size} selected
                    </span>
                  )}
                </div>

                {viewMode === "grid" ? (
                  /* Grid view */
                  <div className="grid grid-cols-4 gap-3">
                    {recentFiles.map((file) => {
                      const isSelected = selectedFiles.has(file.name);
                      return (
                        <button
                          key={file.name}
                          onClick={() => toggleFileSelection(file.name)}
                          className={`group rounded-xl border p-4 text-left transition-all ${
                            isSelected
                              ? "border-primary bg-primary/5 shadow-sm"
                              : "border-border hover:border-primary/40 hover:shadow-md"
                          }`}
                        >
                          <File
                            size={28}
                            className={`mb-2 ${fileTypeColors[file.type] ?? "text-muted-foreground"}`}
                          />
                          <p className="truncate text-xs font-medium text-foreground">
                            {file.name}
                          </p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {file.size}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {file.modified}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  /* List view */
                  <div className="overflow-hidden rounded-lg border border-border">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border bg-muted/50">
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                            Name
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                            Size
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                            Modified
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                            Shared With
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {recentFiles.map((file) => {
                          const isSelected = selectedFiles.has(file.name);
                          return (
                            <tr
                              key={file.name}
                              onClick={() => toggleFileSelection(file.name)}
                              className={`cursor-pointer transition-colors ${
                                isSelected
                                  ? "bg-primary/5"
                                  : "hover:bg-muted/30"
                              }`}
                            >
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <File
                                    size={16}
                                    className={
                                      fileTypeColors[file.type] ??
                                      "text-muted-foreground"
                                    }
                                  />
                                  <span
                                    className={`font-medium ${isSelected ? "text-primary" : "text-foreground"}`}
                                  >
                                    {file.name}
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-muted-foreground">
                                {file.size}
                              </td>
                              <td className="px-4 py-3 text-muted-foreground">
                                {file.modified}
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex -space-x-2">
                                  {file.sharedWith.map((initials, i) => (
                                    <div
                                      key={initials}
                                      className={`flex h-7 w-7 items-center justify-center rounded-full border-2 border-card text-xs font-medium text-white ${
                                        avatarColors[i % avatarColors.length]
                                      }`}
                                      title={initials}
                                    >
                                      {initials}
                                    </div>
                                  ))}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
