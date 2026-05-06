export type FileType = "folder" | "document" | "spreadsheet" | "image" | "pdf" | "code" | "archive" | "video";
export type FileView = "grid" | "list";

export interface FileItem {
  id: string;
  name: string;
  type: FileType;
  size: number; // bytes
  modified: string; // ISO
  parentId: string | null;
  starred: boolean;
  shared: boolean;
  sharedWith?: string[];
  color?: string; // folder color
}

// ── Helpers ──

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function getFileExtension(name: string): string {
  const parts = name.split(".");
  return parts.length > 1 ? parts.pop()!.toLowerCase() : "";
}

export function getFileTypeFromName(name: string): FileType {
  const ext = getFileExtension(name);
  const map: Record<string, FileType> = {
    pdf: "pdf",
    doc: "document", docx: "document", txt: "document", md: "document",
    xls: "spreadsheet", xlsx: "spreadsheet", csv: "spreadsheet",
    png: "image", jpg: "image", jpeg: "image", gif: "image", svg: "image", webp: "image", avif: "image",
    ts: "code", tsx: "code", js: "code", jsx: "code", css: "code", html: "code", json: "code", py: "code",
    zip: "archive", tar: "archive", gz: "archive", rar: "archive",
    mp4: "video", mov: "video", avi: "video", webm: "video",
  };
  return map[ext] || "document";
}

// ── Mock Data ──

let files: FileItem[] = [
  // Root folders
  { id: "folder-1", name: "Documents", type: "folder", size: 0, modified: "2026-02-22T10:00:00.000Z", parentId: null, starred: true, shared: false, color: "chart-1" },
  { id: "folder-2", name: "Images", type: "folder", size: 0, modified: "2026-02-21T14:00:00.000Z", parentId: null, starred: false, shared: false, color: "chart-2" },
  { id: "folder-3", name: "Projects", type: "folder", size: 0, modified: "2026-02-20T09:00:00.000Z", parentId: null, starred: true, shared: true, sharedWith: ["Sarah Chen", "Marcus Johnson"], color: "chart-3" },
  { id: "folder-4", name: "Reports", type: "folder", size: 0, modified: "2026-02-19T16:00:00.000Z", parentId: null, starred: false, shared: false, color: "chart-4" },
  { id: "folder-5", name: "Archive", type: "folder", size: 0, modified: "2026-02-15T10:00:00.000Z", parentId: null, starred: false, shared: false },

  // Documents folder contents
  { id: "file-1", name: "Project Proposal.pdf", type: "pdf", size: 2457600, modified: "2026-02-22T09:30:00.000Z", parentId: "folder-1", starred: true, shared: true, sharedWith: ["Priya Sharma"] },
  { id: "file-2", name: "Meeting Notes.docx", type: "document", size: 89400, modified: "2026-02-21T15:20:00.000Z", parentId: "folder-1", starred: false, shared: false },
  { id: "file-3", name: "API Documentation.md", type: "document", size: 34200, modified: "2026-02-21T11:00:00.000Z", parentId: "folder-1", starred: false, shared: true, sharedWith: ["Alex Rivera", "Marcus Johnson"] },
  { id: "file-4", name: "Budget 2026.xlsx", type: "spreadsheet", size: 156800, modified: "2026-02-20T14:00:00.000Z", parentId: "folder-1", starred: false, shared: false },
  { id: "file-5", name: "Onboarding Guide.pdf", type: "pdf", size: 5242880, modified: "2026-02-18T10:00:00.000Z", parentId: "folder-1", starred: false, shared: true, sharedWith: ["Emma Taylor"] },

  // Images folder contents
  { id: "file-6", name: "Dashboard Screenshot.png", type: "image", size: 1843200, modified: "2026-02-22T08:00:00.000Z", parentId: "folder-2", starred: false, shared: false },
  { id: "file-7", name: "Logo Design.svg", type: "image", size: 24576, modified: "2026-02-21T09:30:00.000Z", parentId: "folder-2", starred: true, shared: true, sharedWith: ["Sarah Chen"] },
  { id: "file-8", name: "Team Photo.jpg", type: "image", size: 3686400, modified: "2026-02-19T12:00:00.000Z", parentId: "folder-2", starred: false, shared: false },
  { id: "file-9", name: "Icon Set.zip", type: "archive", size: 8912896, modified: "2026-02-18T16:00:00.000Z", parentId: "folder-2", starred: false, shared: true, sharedWith: ["Sarah Chen", "Emma Taylor"] },

  // Projects folder contents
  { id: "file-10", name: "apex-dashboard.zip", type: "archive", size: 15728640, modified: "2026-02-22T07:00:00.000Z", parentId: "folder-3", starred: false, shared: true, sharedWith: ["Marcus Johnson"] },
  { id: "file-11", name: "package.json", type: "code", size: 2048, modified: "2026-02-21T18:00:00.000Z", parentId: "folder-3", starred: false, shared: false },
  { id: "file-12", name: "README.md", type: "document", size: 8192, modified: "2026-02-21T17:30:00.000Z", parentId: "folder-3", starred: false, shared: true, sharedWith: ["Sarah Chen", "Marcus Johnson"] },
  { id: "file-13", name: "components.tsx", type: "code", size: 45056, modified: "2026-02-20T16:00:00.000Z", parentId: "folder-3", starred: true, shared: false },
  { id: "file-14", name: "demo-video.mp4", type: "video", size: 52428800, modified: "2026-02-19T10:00:00.000Z", parentId: "folder-3", starred: false, shared: true, sharedWith: ["Priya Sharma"] },

  // Reports folder contents
  { id: "file-15", name: "Q4 Revenue Report.pdf", type: "pdf", size: 3145728, modified: "2026-02-19T14:00:00.000Z", parentId: "folder-4", starred: true, shared: true, sharedWith: ["Priya Sharma", "Liam Murphy"] },
  { id: "file-16", name: "User Analytics.xlsx", type: "spreadsheet", size: 524288, modified: "2026-02-18T11:00:00.000Z", parentId: "folder-4", starred: false, shared: false },
  { id: "file-17", name: "Performance Metrics.csv", type: "spreadsheet", size: 102400, modified: "2026-02-17T09:00:00.000Z", parentId: "folder-4", starred: false, shared: true, sharedWith: ["David Park"] },

  // Archive folder contents
  { id: "file-18", name: "Old Designs.zip", type: "archive", size: 25165824, modified: "2026-02-15T10:00:00.000Z", parentId: "folder-5", starred: false, shared: false },
  { id: "file-19", name: "Legacy Code.tar.gz", type: "archive", size: 10485760, modified: "2026-02-10T08:00:00.000Z", parentId: "folder-5", starred: false, shared: false },

  // Root-level files
  { id: "file-20", name: "Quick Notes.txt", type: "document", size: 4096, modified: "2026-02-22T12:00:00.000Z", parentId: null, starred: false, shared: false },
  { id: "file-21", name: "Deployment Checklist.md", type: "document", size: 6144, modified: "2026-02-21T08:00:00.000Z", parentId: null, starred: true, shared: true, sharedWith: ["David Park", "Liam Murphy"] },
];

let nextFileId = 100;

// ── CRUD Functions ──

export function getFiles(parentId: string | null, search?: string): FileItem[] {
  let result = files.filter((f) => f.parentId === parentId);

  if (search) {
    const q = search.toLowerCase();
    result = files.filter((f) => f.name.toLowerCase().includes(q));
  }

  // Sort: folders first, then by modified desc
  return result.sort((a, b) => {
    if (a.type === "folder" && b.type !== "folder") return -1;
    if (a.type !== "folder" && b.type === "folder") return 1;
    return new Date(b.modified).getTime() - new Date(a.modified).getTime();
  });
}

export function getFile(id: string): FileItem | undefined {
  return files.find((f) => f.id === id);
}

export function getStarredFiles(): FileItem[] {
  return files
    .filter((f) => f.starred)
    .sort((a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime());
}

export function getRecentFiles(limit = 10): FileItem[] {
  return files
    .filter((f) => f.type !== "folder")
    .sort((a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime())
    .slice(0, limit);
}

export function getSharedFiles(): FileItem[] {
  return files
    .filter((f) => f.shared)
    .sort((a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime());
}

export function getStorageUsed(): { used: number; total: number } {
  const used = files.reduce((acc, f) => acc + f.size, 0);
  return { used, total: 10 * 1024 * 1024 * 1024 }; // 10 GB total
}

export function toggleStar(id: string): void {
  files = files.map((f) => (f.id === id ? { ...f, starred: !f.starred } : f));
}

export function renameFile(id: string, name: string): void {
  files = files.map((f) => (f.id === id ? { ...f, name, modified: new Date().toISOString() } : f));
}

export function deleteFile(id: string): void {
  // Also delete children if it's a folder
  const file = files.find((f) => f.id === id);
  if (!file) return;
  if (file.type === "folder") {
    files = files.filter((f) => f.id !== id && f.parentId !== id);
  } else {
    files = files.filter((f) => f.id !== id);
  }
}

export function createFolder(name: string, parentId: string | null): FileItem {
  const newFolder: FileItem = {
    id: `folder-${nextFileId++}`,
    name,
    type: "folder",
    size: 0,
    modified: new Date().toISOString(),
    parentId,
    starred: false,
    shared: false,
  };
  files = [newFolder, ...files];
  return newFolder;
}

export function uploadFile(name: string, size: number, parentId: string | null): FileItem {
  const newFile: FileItem = {
    id: `file-${nextFileId++}`,
    name,
    type: getFileTypeFromName(name),
    size,
    modified: new Date().toISOString(),
    parentId,
    starred: false,
    shared: false,
  };
  files = [newFile, ...files];
  return newFile;
}

export function getBreadcrumbPath(fileId: string | null): FileItem[] {
  const path: FileItem[] = [];
  let currentId = fileId;
  while (currentId) {
    const file = files.find((f) => f.id === currentId);
    if (!file) break;
    path.unshift(file);
    currentId = file.parentId;
  }
  return path;
}
