"use client";

import { useState, useMemo, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  ArrowLeft,
  Reply,
  Forward,
  Trash2,
  Paperclip,
  Star,
  Send,
  FileText,
  AlertTriangle,
  Inbox,
  Archive,
  SquareCheck,
  Edit,
  Tag,
  Mail,
  MailOpen,
} from "lucide-react";

import { PageBreadcrumb } from "@/components/dashboard/breadcrumb";
import { Card, CardContent, CardHeader } from "@dashboardpack/core/components/ui/card";
import { Badge } from "@dashboardpack/core/components/ui/badge";
import { Button } from "@dashboardpack/core/components/ui/button";
import { Input } from "@dashboardpack/core/components/ui/input";
import { Textarea } from "@dashboardpack/core/components/ui/textarea";
import { Checkbox } from "@dashboardpack/core/components/ui/checkbox";
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

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Folder = "inbox" | "sent" | "drafts" | "spam" | "trash" | "archive";
type Label = "personal" | "work" | "social";

interface Email {
  id: number;
  sender: string;
  senderEmail: string;
  subject: string;
  preview: string;
  body: string;
  date: string;
  unread: boolean;
  starred: boolean;
  attachment: boolean;
  folder: Folder;
  label?: Label;
}

// ---------------------------------------------------------------------------
// Initial email data (15 emails)
// ---------------------------------------------------------------------------

const initialEmails: Email[] = [
  {
    id: 1,
    sender: "Sarah Johnson",
    senderEmail: "sarah.johnson@company.com",
    subject: "Q1 Marketing Report",
    preview: "Please review the attached Q1 marketing report before our...",
    body: "Hi team, please review the attached Q1 marketing report before our meeting on Friday. The numbers look promising with a 23% increase in lead generation. Let me know if you have any questions or need additional data points.",
    date: "Today",
    unread: true,
    starred: false,
    attachment: true,
    folder: "inbox",
    label: "work",
  },
  {
    id: 2,
    sender: "GitHub",
    senderEmail: "notifications@github.com",
    subject: "Pull Request #247 merged",
    preview: "Your PR has been successfully merged into main branch...",
    body: "Your pull request #247 'Add user authentication middleware' has been successfully merged into the main branch. All 14 checks passed and the deployment to staging is in progress. Great work on the clean implementation!",
    date: "Today",
    unread: false,
    starred: true,
    attachment: false,
    folder: "inbox",
    label: "work",
  },
  {
    id: 3,
    sender: "David Chen",
    senderEmail: "david.chen@company.com",
    subject: "Project Update - Sprint 14",
    preview: "Hi team, here's the latest status on our Q1 deliverables...",
    body: "Hi team, here's the latest status on our Q1 deliverables. We've completed 8 out of 12 story points this sprint. The remaining items are on track for completion by end of week. Please update your task statuses in Jira before tomorrow's standup.",
    date: "Today",
    unread: true,
    starred: false,
    attachment: true,
    folder: "inbox",
    label: "work",
  },
  {
    id: 4,
    sender: "Stripe",
    senderEmail: "receipts@stripe.com",
    subject: "Payment Received - $2,499.00",
    preview: "$2,499.00 from Acme Corp has been deposited to your account...",
    body: "A payment of $2,499.00 from Acme Corp has been successfully deposited to your account ending in 4242. The funds will be available in your bank account within 2 business days. Transaction ID: txn_3MqB2R2eZvKYlo2C.",
    date: "Yesterday",
    unread: false,
    starred: false,
    attachment: false,
    folder: "inbox",
    label: "work",
  },
  {
    id: 5,
    sender: "Emily Rodriguez",
    senderEmail: "emily.rodriguez@company.com",
    subject: "Meeting Reschedule",
    preview: "Can we move tomorrow's standup to 10am instead of 9am?...",
    body: "Hey, can we move tomorrow's standup to 10am instead of 9am? I have a dentist appointment in the morning and won't make it back in time. I've already checked with the rest of the team and they're fine with the change.",
    date: "Yesterday",
    unread: false,
    starred: true,
    attachment: false,
    folder: "inbox",
    label: "personal",
  },
  {
    id: 6,
    sender: "AWS",
    senderEmail: "no-reply@aws.amazon.com",
    subject: "Billing Alert - Cost Threshold",
    preview: "Your estimated charges for this month have exceeded $500...",
    body: "Your estimated charges for this billing period have exceeded your $500 threshold. Current estimated charges: $523.47. The primary cost drivers are EC2 instances (65%) and S3 storage (20%). Review your usage in the AWS Cost Explorer for details.",
    date: "Jan 15",
    unread: false,
    starred: false,
    attachment: false,
    folder: "inbox",
  },
  {
    id: 7,
    sender: "Mike Brown",
    senderEmail: "mike.brown@designstudio.com",
    subject: "Design Review - Dashboard v2",
    preview: "The new mockups are ready for review. Please take a look...",
    body: "The new dashboard v2 mockups are ready for your review. I've uploaded them to Figma and shared access with the team. Key changes include the new sidebar navigation, updated color palette, and responsive layouts for tablet views.",
    date: "Jan 14",
    unread: true,
    starred: false,
    attachment: false,
    folder: "inbox",
    label: "work",
  },
  {
    id: 8,
    sender: "Newsletter",
    senderEmail: "digest@technews.io",
    subject: "Weekly Tech Digest",
    preview: "Top stories this week: AI breakthroughs, market updates...",
    body: "This week's top stories: OpenAI announces GPT-5 with improved reasoning capabilities, Apple's new M4 chip benchmarks reveal 40% performance gains, and the EU's AI Act enters enforcement phase. Plus, five developer tools you should try this month.",
    date: "Jan 13",
    unread: false,
    starred: false,
    attachment: false,
    folder: "inbox",
    label: "social",
  },
  {
    id: 9,
    sender: "Lisa Park",
    senderEmail: "lisa.park@company.com",
    subject: "Weekend Hiking Trip",
    preview: "Anyone interested in joining a hiking trip this Saturday?...",
    body: "Hey everyone! I'm organizing a hiking trip to Mount Tamalpais this Saturday. We'll meet at the trailhead at 8am. The trail is moderate difficulty, about 6 miles round trip. Bring water, snacks, and sunscreen. Let me know if you're in!",
    date: "Jan 12",
    unread: true,
    starred: false,
    attachment: false,
    folder: "inbox",
    label: "social",
  },
  {
    id: 10,
    sender: "Jira",
    senderEmail: "jira@company.atlassian.net",
    subject: "PROJ-892 assigned to you",
    preview: "A new issue has been assigned to you: Implement OAuth2...",
    body: "A new issue has been assigned to you: PROJ-892 'Implement OAuth2 refresh token rotation'. Priority: High. Sprint: Sprint 15. Due date: Feb 1. Please review the requirements in the ticket description and reach out to the security team if you have questions.",
    date: "Jan 11",
    unread: false,
    starred: false,
    attachment: false,
    folder: "inbox",
    label: "work",
  },
  {
    id: 11,
    sender: "You",
    senderEmail: "me@company.com",
    subject: "Re: Project Proposal",
    preview: "Thanks for the proposal. I've reviewed the timeline and...",
    body: "Thanks for the proposal. I've reviewed the timeline and budget breakdown. Everything looks good to me. Let's schedule a kickoff meeting for next Monday to align on deliverables and milestones. I'll send a calendar invite shortly.",
    date: "Today",
    unread: false,
    starred: false,
    attachment: false,
    folder: "sent",
    label: "work",
  },
  {
    id: 12,
    sender: "You",
    senderEmail: "me@company.com",
    subject: "Re: Weekend Plans",
    preview: "Count me in for Saturday! I'll bring the snacks...",
    body: "Count me in for Saturday! I'll bring the snacks and extra water bottles. Should we carpool from the office parking lot? I can fit 3 more people in my car. See you there!",
    date: "Yesterday",
    unread: false,
    starred: false,
    attachment: false,
    folder: "sent",
    label: "personal",
  },
  {
    id: 13,
    sender: "You",
    senderEmail: "me@company.com",
    subject: "Blog Post Draft - React Performance",
    preview: "Working on a draft about React performance optimization...",
    body: "Working on a draft about React performance optimization techniques including memo, useMemo, useCallback, and the new React compiler. Still need to add code examples and benchmarks.",
    date: "Jan 15",
    unread: false,
    starred: false,
    attachment: false,
    folder: "drafts",
  },
  {
    id: 14,
    sender: "You",
    senderEmail: "me@company.com",
    subject: "Vacation Request Email",
    preview: "Hi Manager, I'd like to request PTO for Feb 10-14...",
    body: "Hi Manager, I'd like to request PTO for February 10-14. I've ensured my sprint items will be completed before then and have arranged coverage with David for any urgent issues. Please let me know if this works.",
    date: "Jan 14",
    unread: false,
    starred: true,
    attachment: false,
    folder: "drafts",
    label: "personal",
  },
  {
    id: 15,
    sender: "Win A Prize",
    senderEmail: "lucky-winner@totallylegit.xyz",
    subject: "Congratulations! You've Won $1,000,000!",
    preview: "Click here to claim your prize immediately before it...",
    body: "Dear Lucky Winner, you have been selected to receive $1,000,000. To claim your prize, simply send us your bank account details and social security number. This is a limited time offer that expires in 24 hours!",
    date: "Jan 10",
    unread: true,
    starred: false,
    attachment: false,
    folder: "spam",
  },
];

// ---------------------------------------------------------------------------
// Sidebar config
// ---------------------------------------------------------------------------

const folderConfig: { icon: typeof Inbox; key: string; folder?: Folder }[] = [
  { icon: Inbox, key: "Inbox", folder: "inbox" },
  { icon: Star, key: "Starred" },
  { icon: Send, key: "Sent", folder: "sent" },
  { icon: FileText, key: "Drafts", folder: "drafts" },
  { icon: AlertTriangle, key: "Spam", folder: "spam" },
  { icon: Trash2, key: "Trash", folder: "trash" },
  { icon: Archive, key: "Archive", folder: "archive" },
];

const labelConfig: { label: Label; display: string; color: string }[] = [
  { label: "personal", display: "Personal", color: "#4680ff" },
  { label: "work", display: "Work", color: "#2ca87f" },
  { label: "social", display: "Social", color: "#e58a00" },
];

// ---------------------------------------------------------------------------
// Form schemas
// ---------------------------------------------------------------------------

const composeSchema = z.object({
  to: z.string().email("Enter a valid email address"),
  subject: z.string().min(1, "Subject is required"),
  body: z.string().min(1, "Message body is required"),
});

type ComposeFormValues = z.infer<typeof composeSchema>;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function EmailPage() {
  // Core state
  const [emails, setEmails] = useState<Email[]>(initialEmails);
  const [activeFolder, setActiveFolder] = useState("Inbox");
  const [activeLabel, setActiveLabel] = useState<Label | null>(null);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // Dialog state
  const [composeOpen, setComposeOpen] = useState(false);
  const [replyOpen, setReplyOpen] = useState(false);
  const [forwardOpen, setForwardOpen] = useState(false);

  // Next ID for new emails
  const [nextId, setNextId] = useState(16);

  // ---------------------------------------------------------------------------
  // Computed values
  // ---------------------------------------------------------------------------

  const folderCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const email of emails) {
      // Count unread for inbox, total for drafts
      if (email.folder === "inbox" && email.unread) {
        counts["Inbox"] = (counts["Inbox"] || 0) + 1;
      }
      if (email.folder === "drafts") {
        counts["Drafts"] = (counts["Drafts"] || 0) + 1;
      }
      if (email.folder === "spam") {
        counts["Spam"] = (counts["Spam"] || 0) + 1;
      }
    }
    return counts;
  }, [emails]);

  const filteredEmails = useMemo(() => {
    // If a label filter is active, show all emails with that label
    if (activeLabel) {
      return emails.filter((e) => e.label === activeLabel);
    }
    // Starred: show all starred emails across folders
    if (activeFolder === "Starred") {
      return emails.filter((e) => e.starred);
    }
    // Map folder name to folder value
    const folderMap: Record<string, Folder> = {
      Inbox: "inbox",
      Sent: "sent",
      Drafts: "drafts",
      Spam: "spam",
      Trash: "trash",
      Archive: "archive",
    };
    const folder = folderMap[activeFolder];
    if (folder) {
      return emails.filter((e) => e.folder === folder);
    }
    return emails;
  }, [emails, activeFolder, activeLabel]);

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  const toggleStar = useCallback((id: number) => {
    setEmails((prev) =>
      prev.map((e) => (e.id === id ? { ...e, starred: !e.starred } : e))
    );
  }, []);

  const openEmail = useCallback(
    (email: Email) => {
      // Mark as read
      setEmails((prev) =>
        prev.map((e) => (e.id === email.id ? { ...e, unread: false } : e))
      );
      setSelectedEmail({ ...email, unread: false });
    },
    []
  );

  const toggleSelectId = useCallback((id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelectedIds((prev) => {
      const visibleIds = filteredEmails.map((e) => e.id);
      const allSelected = visibleIds.every((id) => prev.has(id));
      if (allSelected) {
        return new Set();
      }
      return new Set(visibleIds);
    });
  }, [filteredEmails]);

  const archiveSelected = useCallback(() => {
    const count = selectedIds.size;
    if (count === 0) return;
    setEmails((prev) =>
      prev.map((e) =>
        selectedIds.has(e.id) ? { ...e, folder: "archive" as Folder } : e
      )
    );
    toast.success(`Archived ${count} email${count > 1 ? "s" : ""}`);
    setSelectedIds(new Set());
  }, [selectedIds]);

  const deleteSelected = useCallback(() => {
    const count = selectedIds.size;
    if (count === 0) return;
    setEmails((prev) =>
      prev.map((e) =>
        selectedIds.has(e.id) ? { ...e, folder: "trash" as Folder } : e
      )
    );
    toast.success(`Moved ${count} email${count > 1 ? "s" : ""} to trash`);
    setSelectedIds(new Set());
  }, [selectedIds]);

  const deleteEmail = useCallback(
    (id: number) => {
      setEmails((prev) =>
        prev.map((e) => (e.id === id ? { ...e, folder: "trash" as Folder } : e))
      );
      toast.success("Moved to trash");
      setSelectedEmail(null);
    },
    []
  );

  const handleFolderClick = useCallback((key: string) => {
    setActiveFolder(key);
    setActiveLabel(null);
    setSelectedEmail(null);
    setSelectedIds(new Set());
  }, []);

  const handleLabelClick = useCallback((label: Label) => {
    setActiveLabel((prev) => (prev === label ? null : label));
    setActiveFolder("");
    setSelectedEmail(null);
    setSelectedIds(new Set());
  }, []);

  // ---------------------------------------------------------------------------
  // Compose form
  // ---------------------------------------------------------------------------

  const composeForm = useForm<ComposeFormValues>({
    resolver: zodResolver(composeSchema),
    defaultValues: { to: "", subject: "", body: "" },
  });

  const onComposeSend = useCallback(
    (values: ComposeFormValues) => {
      const newEmail: Email = {
        id: nextId,
        sender: "You",
        senderEmail: "me@company.com",
        subject: values.subject,
        preview: values.body.slice(0, 60) + "...",
        body: values.body,
        date: "Today",
        unread: false,
        starred: false,
        attachment: false,
        folder: "sent",
      };
      setEmails((prev) => [newEmail, ...prev]);
      setNextId((n) => n + 1);
      toast.success("Email sent");
      setComposeOpen(false);
      composeForm.reset();
    },
    [nextId, composeForm]
  );

  // ---------------------------------------------------------------------------
  // Reply form
  // ---------------------------------------------------------------------------

  const replyForm = useForm<ComposeFormValues>({
    resolver: zodResolver(composeSchema),
    defaultValues: { to: "", subject: "", body: "" },
  });

  const openReply = useCallback(() => {
    if (!selectedEmail) return;
    replyForm.reset({
      to: selectedEmail.senderEmail,
      subject: `Re: ${selectedEmail.subject}`,
      body: "",
    });
    setReplyOpen(true);
  }, [selectedEmail, replyForm]);

  const onReplySend = useCallback(
    (values: ComposeFormValues) => {
      const newEmail: Email = {
        id: nextId,
        sender: "You",
        senderEmail: "me@company.com",
        subject: values.subject,
        preview: values.body.slice(0, 60) + "...",
        body: values.body,
        date: "Today",
        unread: false,
        starred: false,
        attachment: false,
        folder: "sent",
      };
      setEmails((prev) => [newEmail, ...prev]);
      setNextId((n) => n + 1);
      toast.success("Reply sent");
      setReplyOpen(false);
      replyForm.reset();
    },
    [nextId, replyForm]
  );

  // ---------------------------------------------------------------------------
  // Forward form
  // ---------------------------------------------------------------------------

  const forwardForm = useForm<ComposeFormValues>({
    resolver: zodResolver(composeSchema),
    defaultValues: { to: "", subject: "", body: "" },
  });

  const openForward = useCallback(() => {
    if (!selectedEmail) return;
    forwardForm.reset({
      to: "",
      subject: `Fwd: ${selectedEmail.subject}`,
      body: `\n\n---------- Forwarded message ----------\nFrom: ${selectedEmail.sender} <${selectedEmail.senderEmail}>\nDate: ${selectedEmail.date}\nSubject: ${selectedEmail.subject}\n\n${selectedEmail.body}`,
    });
    setForwardOpen(true);
  }, [selectedEmail, forwardForm]);

  const onForwardSend = useCallback(
    (values: ComposeFormValues) => {
      const newEmail: Email = {
        id: nextId,
        sender: "You",
        senderEmail: "me@company.com",
        subject: values.subject,
        preview: values.body.slice(0, 60) + "...",
        body: values.body,
        date: "Today",
        unread: false,
        starred: false,
        attachment: false,
        folder: "sent",
      };
      setEmails((prev) => [newEmail, ...prev]);
      setNextId((n) => n + 1);
      toast.success("Email forwarded");
      setForwardOpen(false);
      forwardForm.reset();
    },
    [nextId, forwardForm]
  );

  // ---------------------------------------------------------------------------
  // Check if all visible are selected
  // ---------------------------------------------------------------------------

  const allVisibleSelected = useMemo(() => {
    if (filteredEmails.length === 0) return false;
    return filteredEmails.every((e) => selectedIds.has(e.id));
  }, [filteredEmails, selectedIds]);

  // ---------------------------------------------------------------------------
  // Render helpers
  // ---------------------------------------------------------------------------

  const activeSidebarLabel = activeLabel
    ? labelConfig.find((l) => l.label === activeLabel)?.display ?? ""
    : "";

  const headerTitle = activeLabel ? activeSidebarLabel : activeFolder;

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <>
      <PageBreadcrumb
        title="Email"
        items={[{ label: "Application" }, { label: "Email" }]}
      />

      <div className="grid grid-cols-12 gap-6">
        {/* ----------------------------------------------------------------- */}
        {/* Left sidebar */}
        {/* ----------------------------------------------------------------- */}
        <div className="col-span-12 md:col-span-3">
          <Card>
            <CardContent className="p-4">
              {/* Compose button */}
              <button
                onClick={() => {
                  composeForm.reset();
                  setComposeOpen(true);
                }}
                className="mb-4 w-full rounded-lg py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 flex items-center justify-center gap-2"
                style={{ backgroundColor: "#4680ff" }}
              >
                <Edit className="h-4 w-4" />
                Compose
              </button>

              {/* Folders */}
              <nav className="space-y-0.5">
                {folderConfig.map(({ icon: Icon, key }) => {
                  const isActive = !activeLabel && activeFolder === key;
                  const count = folderCounts[key];
                  return (
                    <button
                      key={key}
                      onClick={() => handleFolderClick(key)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                        isActive
                          ? "font-medium text-white"
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      }`}
                      style={isActive ? { backgroundColor: "#4680ff" } : {}}
                    >
                      <span className="flex items-center gap-2.5">
                        <Icon className="h-4 w-4" />
                        {key}
                      </span>
                      {count != null && count > 0 && (
                        <Badge
                          variant={isActive ? "outline" : "default"}
                          className={
                            isActive
                              ? "border-white/50 bg-white/20 text-white"
                              : ""
                          }
                        >
                          {count}
                        </Badge>
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* Labels */}
              <div className="mt-6">
                <div className="mb-2 flex items-center gap-2 px-3">
                  <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Labels
                  </p>
                </div>
                <div className="space-y-0.5">
                  {labelConfig.map(({ label, display, color }) => {
                    const isActive = activeLabel === label;
                    return (
                      <button
                        key={label}
                        onClick={() => handleLabelClick(label)}
                        className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                          isActive
                            ? "font-medium text-white"
                            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                        }`}
                        style={isActive ? { backgroundColor: color } : {}}
                      >
                        <span
                          className={`h-2.5 w-2.5 rounded-full shrink-0 ${
                            isActive ? "border border-white/50" : ""
                          }`}
                          style={{ backgroundColor: isActive ? "#fff" : color }}
                        />
                        {display}
                      </button>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Right panel — email list or detail */}
        {/* ----------------------------------------------------------------- */}
        <div className="col-span-12 md:col-span-9">
          <Card>
            {selectedEmail ? (
              /* ----- Email Detail View ----- */
              <>
                <CardHeader className="border-b border-border pb-4">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setSelectedEmail(null)}
                      className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back to {headerTitle || "list"}
                    </button>
                    <button
                      onClick={() => toggleStar(selectedEmail.id)}
                      className="shrink-0"
                    >
                      <Star
                        className={`h-5 w-5 transition-colors ${
                          emails.find((e) => e.id === selectedEmail.id)?.starred
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground hover:text-yellow-400"
                        }`}
                      />
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {/* Subject */}
                  <h2 className="mb-4 text-xl font-semibold text-foreground">
                    {selectedEmail.subject}
                  </h2>

                  {/* Sender info */}
                  <div className="mb-6 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                        {selectedEmail.sender.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {selectedEmail.sender}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {selectedEmail.senderEmail}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {selectedEmail.date}
                    </span>
                  </div>

                  {/* Attachment badge */}
                  {selectedEmail.attachment && (
                    <div className="mb-4 flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1.5"
                      >
                        <Paperclip className="h-3 w-3" />
                        Attachment
                      </Badge>
                    </div>
                  )}

                  {/* Body */}
                  <div className="mb-8 rounded-lg bg-muted/30 p-4 text-sm leading-relaxed text-foreground">
                    {selectedEmail.body}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={openReply}
                      className="gap-1.5"
                    >
                      <Reply className="h-3.5 w-3.5" />
                      Reply
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={openForward}
                      className="gap-1.5"
                    >
                      <Forward className="h-3.5 w-3.5" />
                      Forward
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteEmail(selectedEmail.id)}
                      className="gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </>
            ) : (
              /* ----- Email List View ----- */
              <>
                {/* Toolbar */}
                <CardHeader className="border-b border-border pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={allVisibleSelected && filteredEmails.length > 0}
                        onCheckedChange={toggleSelectAll}
                        aria-label="Select all emails"
                      />
                      <h2 className="text-base font-semibold text-foreground">
                        {headerTitle}
                      </h2>
                      {selectedIds.size > 0 && (
                        <span className="text-xs text-muted-foreground">
                          ({selectedIds.size} selected)
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={archiveSelected}
                        disabled={selectedIds.size === 0}
                        className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-muted-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                        title="Archive"
                      >
                        <Archive className="h-3.5 w-3.5" />
                        Archive
                      </button>
                      <button
                        onClick={deleteSelected}
                        disabled={selectedIds.size === 0}
                        className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-destructive hover:text-destructive disabled:cursor-not-allowed disabled:opacity-40"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-0">
                  {filteredEmails.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                      <MailOpen className="mb-3 h-10 w-10" />
                      <p className="text-sm">No emails in this folder</p>
                    </div>
                  ) : (
                    <ul className="divide-y divide-border">
                      {filteredEmails.map((email) => (
                        <li
                          key={email.id}
                          onClick={() => openEmail(email)}
                          className={`flex cursor-pointer items-center gap-3 px-5 py-3.5 transition-colors hover:bg-muted/30 ${
                            email.unread
                              ? "border-l-2"
                              : "border-l-2 border-transparent"
                          }`}
                          style={
                            email.unread
                              ? { borderLeftColor: "#4680ff" }
                              : {}
                          }
                        >
                          {/* Checkbox */}
                          <div onClick={(e) => e.stopPropagation()}>
                            <Checkbox
                              checked={selectedIds.has(email.id)}
                              onCheckedChange={() => toggleSelectId(email.id)}
                              aria-label={`Select email from ${email.sender}`}
                            />
                          </div>

                          {/* Star */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleStar(email.id);
                            }}
                            className="shrink-0"
                          >
                            <Star
                              className={`h-4 w-4 transition-colors ${
                                email.starred
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-muted-foreground hover:text-yellow-400"
                              }`}
                            />
                          </button>

                          {/* Sender */}
                          <span
                            className={`w-36 shrink-0 truncate text-sm ${
                              email.unread
                                ? "font-semibold text-foreground"
                                : "text-muted-foreground"
                            }`}
                          >
                            {email.sender}
                          </span>

                          {/* Subject + preview */}
                          <div className="min-w-0 flex-1">
                            <span
                              className={`text-sm ${
                                email.unread
                                  ? "font-semibold text-foreground"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {email.subject}
                              <span className="ml-1.5 font-normal text-muted-foreground/70">
                                — {email.preview}
                              </span>
                            </span>
                          </div>

                          {/* Label dot */}
                          {email.label && (
                            <span
                              className="h-2 w-2 shrink-0 rounded-full"
                              style={{
                                backgroundColor:
                                  labelConfig.find(
                                    (l) => l.label === email.label
                                  )?.color ?? "#888",
                              }}
                              title={email.label}
                            />
                          )}

                          {/* Attachment icon */}
                          {email.attachment && (
                            <Paperclip className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                          )}

                          {/* Date */}
                          <span className="shrink-0 text-xs text-muted-foreground">
                            {email.date}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </>
            )}
          </Card>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Compose Dialog */}
      {/* ------------------------------------------------------------------- */}
      <Dialog open={composeOpen} onOpenChange={setComposeOpen}>
        <DialogContent className="sm:max-w-lg" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>New Email</DialogTitle>
          </DialogHeader>
          <Form {...composeForm}>
            <form
              onSubmit={composeForm.handleSubmit(onComposeSend)}
              className="space-y-4"
            >
              <FormField
                control={composeForm.control}
                name="to"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>To</FormLabel>
                    <FormControl>
                      <Input placeholder="recipient@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={composeForm.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input placeholder="Email subject" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={composeForm.control}
                name="body"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write your message..."
                        rows={6}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setComposeOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="gap-1.5">
                  <Send className="h-3.5 w-3.5" />
                  Send
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* ------------------------------------------------------------------- */}
      {/* Reply Dialog */}
      {/* ------------------------------------------------------------------- */}
      <Dialog open={replyOpen} onOpenChange={setReplyOpen}>
        <DialogContent className="sm:max-w-lg" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Reply</DialogTitle>
          </DialogHeader>
          <Form {...replyForm}>
            <form
              onSubmit={replyForm.handleSubmit(onReplySend)}
              className="space-y-4"
            >
              <FormField
                control={replyForm.control}
                name="to"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>To</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly className="bg-muted/50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={replyForm.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly className="bg-muted/50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={replyForm.control}
                name="body"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write your reply..."
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Quoted original message */}
              {selectedEmail && (
                <div className="rounded-lg border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
                  <p className="mb-1 font-medium">
                    On {selectedEmail.date}, {selectedEmail.sender} wrote:
                  </p>
                  <p className="italic">{selectedEmail.body}</p>
                </div>
              )}
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setReplyOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="gap-1.5">
                  <Send className="h-3.5 w-3.5" />
                  Send Reply
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* ------------------------------------------------------------------- */}
      {/* Forward Dialog */}
      {/* ------------------------------------------------------------------- */}
      <Dialog open={forwardOpen} onOpenChange={setForwardOpen}>
        <DialogContent className="sm:max-w-lg" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Forward</DialogTitle>
          </DialogHeader>
          <Form {...forwardForm}>
            <form
              onSubmit={forwardForm.handleSubmit(onForwardSend)}
              className="space-y-4"
            >
              <FormField
                control={forwardForm.control}
                name="to"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>To</FormLabel>
                    <FormControl>
                      <Input placeholder="recipient@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={forwardForm.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={forwardForm.control}
                name="body"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea rows={8} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setForwardOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="gap-1.5">
                  <Send className="h-3.5 w-3.5" />
                  Forward
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
