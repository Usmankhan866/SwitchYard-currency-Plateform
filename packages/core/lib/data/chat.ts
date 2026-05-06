export type ContactStatus = "online" | "away" | "offline";
export type MessageStatus = "sent" | "delivered" | "read";
export type ConversationType = "dm" | "group";

export interface ChatContact {
  id: string;
  name: string;
  initials: string;
  status: ContactStatus;
  role: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  timestamp: string;
  status: MessageStatus;
}

export interface ChatConversation {
  id: string;
  type: ConversationType;
  name: string;
  participants: string[];
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

// ── Contacts ──

const contacts: ChatContact[] = [
  { id: "contact-1", name: "Sarah Chen", initials: "SC", status: "online", role: "Lead Designer" },
  { id: "contact-2", name: "Marcus Johnson", initials: "MJ", status: "online", role: "Frontend Dev" },
  { id: "contact-3", name: "Priya Sharma", initials: "PS", status: "away", role: "Product Manager" },
  { id: "contact-4", name: "Alex Rivera", initials: "AR", status: "online", role: "Backend Dev" },
  { id: "contact-5", name: "Emma Taylor", initials: "ET", status: "offline", role: "QA Engineer" },
  { id: "contact-6", name: "David Park", initials: "DP", status: "away", role: "DevOps" },
  { id: "contact-7", name: "Olivia Brown", initials: "OB", status: "offline", role: "Data Analyst" },
  { id: "contact-8", name: "Liam Murphy", initials: "LM", status: "offline", role: "Tech Lead" },
];

// ── Fixed timestamps (anchored to Feb 22 2026 to avoid SSR hydration mismatch) ──

// ── Messages ──

let nextMessageId = 200;

function msg(
  conversationId: string,
  senderId: string,
  text: string,
  timestamp: string,
  status: MessageStatus = "read"
): ChatMessage {
  return { id: `msg-${nextMessageId++}`, conversationId, senderId, text, timestamp, status };
}

let messages: ChatMessage[] = [
  // Sarah Chen (DM) — conv-1   (yesterday = Feb 21)
  msg("conv-1", "contact-1", "Hey! Did you get a chance to look at the new design mockups?", "2026-02-21T09:15:00.000Z"),
  msg("conv-1", "me", "Yes, they look fantastic! I especially like the dashboard layout.", "2026-02-21T09:22:00.000Z"),
  msg("conv-1", "contact-1", "Thanks! I spent a lot of time on the data visualization section.", "2026-02-21T09:25:00.000Z"),
  msg("conv-1", "me", "It shows. The chart colors work really well with the dark theme.", "2026-02-21T09:30:00.000Z"),
  msg("conv-1", "contact-1", "That was the trickiest part. OKLCh makes it easier though.", "2026-02-21T09:35:00.000Z"),
  msg("conv-1", "me", "Agreed. Should we schedule a review with the team?", "2026-02-21T10:00:00.000Z"),
  msg("conv-1", "contact-1", "Good idea. How about tomorrow afternoon?", "2026-02-21T10:05:00.000Z"),
  msg("conv-1", "me", "Works for me. I'll send out the invite.", "2026-02-21T10:10:00.000Z"),
  msg("conv-1", "contact-1", "Hey, are you available for a quick sync today?", "2026-02-22T11:00:00.000Z"),
  msg("conv-1", "me", "Sure! Let me wrap up this PR first. Give me 20 minutes?", "2026-02-22T11:30:00.000Z"),
  msg("conv-1", "contact-1", "Perfect, no rush. Just ping me when you're ready.", "2026-02-22T12:00:00.000Z", "read"),
  msg("conv-1", "contact-1", "Also, I updated the component library with the new button variants.", "2026-02-22T13:00:00.000Z", "delivered"),

  // Marcus Johnson (DM) — conv-2   (2 days ago = Feb 20)
  msg("conv-2", "contact-2", "The TanStack Table migration is done!", "2026-02-20T14:00:00.000Z"),
  msg("conv-2", "me", "Nice work! How's the bundle size looking?", "2026-02-20T14:10:00.000Z"),
  msg("conv-2", "contact-2", "About 15kb gzipped. The row selection alone was worth it.", "2026-02-20T14:15:00.000Z"),
  msg("conv-2", "me", "Agreed. The faceted filters are a game changer for products.", "2026-02-20T14:20:00.000Z"),
  msg("conv-2", "contact-2", "Yeah, customers page was the simplest migration. Orders had the most changes.", "2026-02-20T14:30:00.000Z"),
  msg("conv-2", "me", "I noticed. The bulk actions work great though.", "2026-02-20T14:35:00.000Z"),
  msg("conv-2", "contact-2", "Did you push the latest changes?", "2026-02-22T09:00:00.000Z"),
  msg("conv-2", "me", "Yep, all merged to main. Build is green.", "2026-02-22T09:30:00.000Z"),
  msg("conv-2", "contact-2", "Awesome. I'll start on the virtual scroll next.", "2026-02-22T10:00:00.000Z", "read"),

  // Priya Sharma (DM) — conv-3   (3 days ago = Feb 19)
  msg("conv-3", "contact-3", "The product roadmap has been updated.", "2026-02-19T11:00:00.000Z"),
  msg("conv-3", "me", "Great, I'll take a look. Any big changes?", "2026-02-19T11:15:00.000Z"),
  msg("conv-3", "contact-3", "We moved the chat app up to Phase 4. It tested well in user interviews.", "2026-02-19T11:20:00.000Z"),
  msg("conv-3", "me", "Makes sense. Chat is the #1 differentiator in premium dashboards.", "2026-02-19T11:25:00.000Z"),
  msg("conv-3", "contact-3", "Exactly. Can you start on it this sprint?", "2026-02-19T11:30:00.000Z"),
  msg("conv-3", "me", "Already planned. Should have it done in a couple days.", "2026-02-19T11:35:00.000Z"),
  msg("conv-3", "contact-3", "Perfect. Let me know if you need any design assets.", "2026-02-19T11:40:00.000Z"),
  msg("conv-3", "me", "Will do. Thanks Priya!", "2026-02-19T11:45:00.000Z"),

  // Alex Rivera (DM) — conv-4   (yesterday = Feb 21)
  msg("conv-4", "contact-4", "Hey, the API endpoints for the notification system are ready.", "2026-02-21T15:00:00.000Z"),
  msg("conv-4", "me", "Sweet! I'll wire them up to the bell icon in the header.", "2026-02-21T15:10:00.000Z"),
  msg("conv-4", "contact-4", "Cool. I added mark-as-read and mark-all endpoints too.", "2026-02-21T15:15:00.000Z"),
  msg("conv-4", "me", "Perfect. That's exactly what the popover needs.", "2026-02-21T15:20:00.000Z"),
  msg("conv-4", "contact-4", "Let me know if you need anything else.", "2026-02-21T15:25:00.000Z"),
  msg("conv-4", "me", "Will do!", "2026-02-21T15:30:00.000Z"),

  // Design Team (Group) — conv-5   (2 days ago = Feb 20)
  msg("conv-5", "contact-1", "Team, I've uploaded the new icon set to Figma.", "2026-02-20T10:00:00.000Z"),
  msg("conv-5", "contact-3", "Looks great! Are these the Lucide replacements?", "2026-02-20T10:10:00.000Z"),
  msg("conv-5", "contact-1", "Yes, they're all consistent with the 24px grid now.", "2026-02-20T10:15:00.000Z"),
  msg("conv-5", "me", "Nice work Sarah. The sidebar icons look much cleaner.", "2026-02-20T10:20:00.000Z"),
  msg("conv-5", "contact-5", "I'll add these to the visual regression tests.", "2026-02-20T10:30:00.000Z"),
  msg("conv-5", "contact-1", "Thanks Emma! Make sure to test dark mode variants too.", "2026-02-20T10:35:00.000Z"),
  msg("conv-5", "me", "Should we update the docs component catalog as well?", "2026-02-20T10:40:00.000Z"),
  msg("conv-5", "contact-3", "Yes, let's add it to the next sprint.", "2026-02-20T10:45:00.000Z"),
  msg("conv-5", "contact-1", "I can handle that. Will open a PR by EOD.", "2026-02-20T10:50:00.000Z"),

  // Sprint Planning (Group) — conv-6   (4 days ago = Feb 18)
  msg("conv-6", "contact-8", "Sprint 14 planning — let's prioritize.", "2026-02-18T09:00:00.000Z"),
  msg("conv-6", "contact-2", "I'd like to tackle the virtual scroll for tables.", "2026-02-18T09:10:00.000Z"),
  msg("conv-6", "contact-4", "API work for the file manager is almost scoped.", "2026-02-18T09:15:00.000Z"),
  msg("conv-6", "contact-6", "CI pipeline improvements are ready to go.", "2026-02-18T09:20:00.000Z"),
  msg("conv-6", "me", "Chat app is my main focus. Should be 3-4 story points.", "2026-02-18T09:25:00.000Z"),
  msg("conv-6", "contact-8", "Good. Let's aim for 40 points this sprint.", "2026-02-18T09:30:00.000Z"),
  msg("conv-6", "contact-2", "Sounds doable. I'll update the board.", "2026-02-18T09:35:00.000Z"),
  msg("conv-6", "contact-8", "Great. Let's reconvene Thursday for standup.", "2026-02-18T09:40:00.000Z"),
];

// ── Conversations ──

let conversations: ChatConversation[] = [
  {
    id: "conv-1",
    type: "dm",
    name: "Sarah Chen",
    participants: ["contact-1"],
    lastMessage: "Also, I updated the component library with the new button variants.",
    lastMessageTime: "2026-02-22T13:00:00.000Z",
    unreadCount: 2,
  },
  {
    id: "conv-2",
    type: "dm",
    name: "Marcus Johnson",
    participants: ["contact-2"],
    lastMessage: "Awesome. I'll start on the virtual scroll next.",
    lastMessageTime: "2026-02-22T10:00:00.000Z",
    unreadCount: 0,
  },
  {
    id: "conv-3",
    type: "dm",
    name: "Priya Sharma",
    participants: ["contact-3"],
    lastMessage: "Will do. Thanks Priya!",
    lastMessageTime: "2026-02-19T11:45:00.000Z",
    unreadCount: 0,
  },
  {
    id: "conv-4",
    type: "dm",
    name: "Alex Rivera",
    participants: ["contact-4"],
    lastMessage: "Will do!",
    lastMessageTime: "2026-02-21T15:30:00.000Z",
    unreadCount: 0,
  },
  {
    id: "conv-5",
    type: "group",
    name: "Design Team",
    participants: ["contact-1", "contact-3", "contact-5"],
    lastMessage: "I can handle that. Will open a PR by EOD.",
    lastMessageTime: "2026-02-20T10:50:00.000Z",
    unreadCount: 0,
  },
  {
    id: "conv-6",
    type: "group",
    name: "Sprint Planning",
    participants: ["contact-2", "contact-4", "contact-6", "contact-8"],
    lastMessage: "Great. Let's reconvene Thursday for standup.",
    lastMessageTime: "2026-02-18T09:40:00.000Z",
    unreadCount: 0,
  },
];

// ── Auto-reply pool ──

const autoReplies = [
  "That makes sense, let me look into it.",
  "Great idea! I'll add it to the backlog.",
  "Can we sync on this tomorrow morning?",
  "I just pushed a fix for that. Can you pull and test?",
  "Sounds good to me! Let's go with that approach.",
  "I'll have an update by end of day.",
  "Good point. I hadn't considered that edge case.",
  "Let me check with the team and get back to you.",
  "Done! Check the latest commit.",
  "I'm working on it now. Should be ready in an hour.",
  "Thanks for the heads up!",
  "Can you share the Figma link?",
  "I think we should discuss this in the next standup.",
  "That's exactly what I was thinking.",
  "Let me review the PR and I'll leave comments.",
];

// ── CRUD Functions ──

export function getContacts(): ChatContact[] {
  return [...contacts];
}

export function getContact(id: string): ChatContact | undefined {
  return contacts.find((c) => c.id === id);
}

export function getConversations(): ChatConversation[] {
  return [...conversations].sort(
    (a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
  );
}

export function getConversation(id: string): ChatConversation | undefined {
  return conversations.find((c) => c.id === id);
}

export function getMessages(conversationId: string): ChatMessage[] {
  return messages
    .filter((m) => m.conversationId === conversationId)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}

export function addMessage(conversationId: string, text: string): ChatMessage {
  const newMsg: ChatMessage = {
    id: `msg-${nextMessageId++}`,
    conversationId,
    senderId: "me",
    text,
    timestamp: new Date().toISOString(),
    status: "sent",
  };
  messages = [...messages, newMsg];

  conversations = conversations.map((c) =>
    c.id === conversationId
      ? { ...c, lastMessage: text, lastMessageTime: newMsg.timestamp }
      : c
  );

  return newMsg;
}

export function addReplyMessage(
  conversationId: string,
  senderId: string,
  text: string
): ChatMessage {
  const newMsg: ChatMessage = {
    id: `msg-${nextMessageId++}`,
    conversationId,
    senderId,
    text,
    timestamp: new Date().toISOString(),
    status: "read",
  };
  messages = [...messages, newMsg];

  conversations = conversations.map((c) =>
    c.id === conversationId
      ? { ...c, lastMessage: text, lastMessageTime: newMsg.timestamp }
      : c
  );

  return newMsg;
}

export function markConversationRead(conversationId: string): void {
  conversations = conversations.map((c) =>
    c.id === conversationId ? { ...c, unreadCount: 0 } : c
  );
}

export function getAutoReply(): string {
  return autoReplies[Math.floor(Math.random() * autoReplies.length)];
}
