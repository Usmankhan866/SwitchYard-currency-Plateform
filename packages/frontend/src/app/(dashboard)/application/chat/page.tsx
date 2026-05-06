"use client";

import { PageBreadcrumb } from "@/components/dashboard/breadcrumb";
import { Card, CardContent, CardHeader } from "@dashboardpack/core/components/ui/card";
import { Badge } from "@dashboardpack/core/components/ui/badge";
import { Send, Search } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";

interface Message {
  id: number;
  text: string;
  sent: boolean;
  timestamp: string;
}

interface ChatUser {
  id: number;
  name: string;
  initials: string;
  color: string;
  preview: string;
  time: string;
  online: boolean;
  unread: number;
}

const cannedResponses = [
  "Sounds great, let me look into that!",
  "Sure, I'll get back to you shortly.",
  "Thanks for letting me know!",
  "Got it, makes sense.",
  "Let me check and follow up.",
  "That works for me!",
  "I'll send it over in a bit.",
  "Good idea, let's do that.",
];

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

const initialUsers: ChatUser[] = [
  {
    id: 1,
    name: "John Doe",
    initials: "JD",
    color: "#4680ff",
    preview: "Perfect, looking forward to it! 🎉",
    time: "2m",
    online: true,
    unread: 0,
  },
  {
    id: 2,
    name: "Sarah Wilson",
    initials: "SW",
    color: "#2ca87f",
    preview: "See you at the meeting",
    time: "15m",
    online: true,
    unread: 0,
  },
  {
    id: 3,
    name: "Mike Chen",
    initials: "MC",
    color: "#6f42c1",
    preview: "No problem, happy to help",
    time: "1h",
    online: false,
    unread: 0,
  },
  {
    id: 4,
    name: "Emily Davis",
    initials: "ED",
    color: "#1abc9c",
    preview: "I'll review it tonight",
    time: "3h",
    online: true,
    unread: 0,
  },
  {
    id: 5,
    name: "Alex Kumar",
    initials: "AK",
    color: "#e58a00",
    preview: "Sure, sounds good!",
    time: "1d",
    online: false,
    unread: 0,
  },
  {
    id: 6,
    name: "Lisa Park",
    initials: "LP",
    color: "#dc2626",
    preview: "Updated the design",
    time: "2d",
    online: true,
    unread: 0,
  },
];

const initialConversations: Record<number, Message[]> = {
  1: [
    { id: 1, text: "Hey John! How's the project going?", sent: false, timestamp: "10:15 AM" },
    { id: 2, text: "Going great! Almost done with the dashboard.", sent: true, timestamp: "10:18 AM" },
    { id: 3, text: "That's awesome! Can you share a preview?", sent: false, timestamp: "10:20 AM" },
    { id: 4, text: "Sure! Let me send it over.", sent: true, timestamp: "10:22 AM" },
    { id: 5, text: "Perfect, looking forward to it! 🎉", sent: false, timestamp: "10:24 AM" },
  ],
  2: [
    { id: 1, text: "Hi Sarah, are we still on for the 3pm meeting?", sent: true, timestamp: "1:30 PM" },
    { id: 2, text: "Yes! I've prepared the slides already.", sent: false, timestamp: "1:35 PM" },
    { id: 3, text: "Great, I'll bring the quarterly numbers.", sent: true, timestamp: "1:40 PM" },
    { id: 4, text: "See you at the meeting", sent: false, timestamp: "1:45 PM" },
  ],
  3: [
    { id: 1, text: "Mike, could you send me the API docs?", sent: true, timestamp: "9:00 AM" },
    { id: 2, text: "Sure, sending them right now.", sent: false, timestamp: "9:10 AM" },
    { id: 3, text: "Got them, thanks!", sent: true, timestamp: "9:15 AM" },
    { id: 4, text: "No problem, happy to help", sent: false, timestamp: "9:20 AM" },
  ],
  4: [
    { id: 1, text: "Emily, the new component designs look amazing!", sent: true, timestamp: "4:00 PM" },
    { id: 2, text: "Thank you! Took a while to get the spacing right.", sent: false, timestamp: "4:10 PM" },
    { id: 3, text: "Can you also update the dark mode variant?", sent: true, timestamp: "4:15 PM" },
    { id: 4, text: "Sure thing. I'll review it tonight", sent: false, timestamp: "4:20 PM" },
    { id: 5, text: "No rush, take your time.", sent: true, timestamp: "4:22 PM" },
  ],
  5: [
    { id: 1, text: "Alex, have you deployed the staging build?", sent: true, timestamp: "11:00 AM" },
    { id: 2, text: "Just pushed it. Should be live in a few minutes.", sent: false, timestamp: "11:05 AM" },
    { id: 3, text: "Sure, sounds good!", sent: false, timestamp: "11:06 AM" },
  ],
  6: [
    { id: 1, text: "Lisa, the new icons look great on mobile.", sent: true, timestamp: "Yesterday" },
    { id: 2, text: "Thanks! I also tweaked the color palette.", sent: false, timestamp: "Yesterday" },
    { id: 3, text: "Can you share the Figma link?", sent: true, timestamp: "Yesterday" },
    { id: 4, text: "Updated the design", sent: false, timestamp: "Yesterday" },
  ],
};

let nextMessageId = 100;

export default function ChatPage() {
  const [activeUserId, setActiveUserId] = useState(1);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<ChatUser[]>(initialUsers);
  const [conversations, setConversations] = useState<Record<number, Message[]>>(initialConversations);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeUser = users.find((u) => u.id === activeUserId) ?? users[0];

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [conversations, activeUserId, isTyping, scrollToBottom]);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentMessages = conversations[activeUserId] ?? [];

  const handleSelectUser = (userId: number) => {
    setActiveUserId(userId);
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, unread: 0 } : u))
    );
  };

  const sendMessage = useCallback(() => {
    const text = messageInput.trim();
    if (!text) return;

    const now = new Date();
    const timestamp = formatTime(now);
    const msgId = nextMessageId++;

    const newMessage: Message = {
      id: msgId,
      text,
      sent: true,
      timestamp,
    };

    setConversations((prev) => ({
      ...prev,
      [activeUserId]: [...(prev[activeUserId] ?? []), newMessage],
    }));

    setUsers((prev) =>
      prev.map((u) =>
        u.id === activeUserId ? { ...u, preview: text, time: "now" } : u
      )
    );

    setMessageInput("");

    const replyUserId = activeUserId;

    // Simulate typing indicator then reply
    setTimeout(() => {
      setIsTyping(true);
    }, 600);

    setTimeout(() => {
      setIsTyping(false);
      const replyText = cannedResponses[Math.floor(Math.random() * cannedResponses.length)];
      const replyTimestamp = formatTime(new Date());
      const replyId = nextMessageId++;

      const replyMessage: Message = {
        id: replyId,
        text: replyText,
        sent: false,
        timestamp: replyTimestamp,
      };

      setConversations((prev) => ({
        ...prev,
        [replyUserId]: [...(prev[replyUserId] ?? []), replyMessage],
      }));

      setUsers((prev) =>
        prev.map((u) => {
          if (u.id === replyUserId) {
            return {
              ...u,
              preview: replyText,
              time: "now",
              unread: replyUserId !== activeUserId ? u.unread + 1 : u.unread,
            };
          }
          return u;
        })
      );
    }, 1800);
  }, [messageInput, activeUserId]);

  return (
    <>
      <PageBreadcrumb
        title="Chat"
        items={[{ label: "Application" }, { label: "Chat" }]}
      />

      <div className="grid grid-cols-12 gap-6">
        {/* Left sidebar — user list */}
        <div className="col-span-12 md:col-span-4">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search conversations..."
                  className="w-full rounded-lg border border-border bg-muted/30 py-2 pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ul>
                {filteredUsers.map((user) => (
                  <li key={user.id}>
                    <button
                      onClick={() => handleSelectUser(user.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/40 ${
                        activeUserId === user.id
                          ? "border-l-2 bg-primary/5"
                          : "border-l-2 border-transparent"
                      }`}
                      style={
                        activeUserId === user.id
                          ? { borderLeftColor: "#4680ff" }
                          : {}
                      }
                    >
                      {/* Avatar */}
                      <div className="relative flex-shrink-0">
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white"
                          style={{ backgroundColor: user.color }}
                        >
                          {user.initials}
                        </div>
                        {user.online && (
                          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-card bg-green-500" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-foreground truncate">
                            {user.name}
                          </p>
                          <span className="ml-2 flex items-center gap-1.5 flex-shrink-0">
                            {user.unread > 0 && (
                              <Badge variant="default" className="h-5 min-w-5 justify-center rounded-full px-1.5 text-xs">
                                {user.unread}
                              </Badge>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {user.time}
                            </span>
                          </span>
                        </div>
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                          {user.preview}
                        </p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Right — conversation */}
        <div className="col-span-12 md:col-span-8">
          <Card className="flex h-full flex-col">
            {/* Conversation header */}
            <CardHeader className="border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white"
                  style={{ backgroundColor: activeUser.color }}
                >
                  {activeUser.initials}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-foreground">
                      {activeUser.name}
                    </p>
                    {activeUser.online ? (
                      <Badge variant="success" className="text-xs py-0">
                        Online
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs py-0">
                        Offline
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Last seen 2 min ago
                  </p>
                </div>
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto py-6">
              <div className="flex flex-col gap-4">
                {currentMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sent ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[70%] ${msg.sent ? "text-right" : "text-left"}`}>
                      <div
                        className={`inline-block rounded-2xl px-4 py-2.5 text-sm ${
                          msg.sent
                            ? "rounded-br-sm text-white"
                            : "rounded-bl-sm bg-muted text-foreground"
                        }`}
                        style={msg.sent ? { backgroundColor: "#4680ff" } : {}}
                      >
                        {msg.text}
                      </div>
                      <p className="mt-1 text-[10px] text-muted-foreground">
                        {msg.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
                {isTyping && activeUserId === activeUser.id && (
                  <div className="flex justify-start">
                    <div className="max-w-[70%]">
                      <div className="inline-block rounded-2xl rounded-bl-sm bg-muted px-4 py-2.5 text-sm text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <span className="animate-bounce [animation-delay:0ms]">.</span>
                          <span className="animate-bounce [animation-delay:150ms]">.</span>
                          <span className="animate-bounce [animation-delay:300ms]">.</span>
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </CardContent>

            {/* Input */}
            <div className="border-t border-border p-4">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 rounded-lg border border-border bg-muted/30 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") sendMessage();
                  }}
                />
                <button
                  onClick={sendMessage}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "#4680ff" }}
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
