"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  // Navigation
  Home, ArrowLeft, ArrowRight, ArrowUp, ArrowDown,
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
  Menu, Search, ExternalLink, Link, Navigation,
  // Actions
  Plus, Minus, X, Check, Edit, Edit2, Edit3,
  Trash, Trash2, Copy, Download, Upload, Save,
  RefreshCw, RotateCw, RotateCcw, Undo, Redo,
  ZoomIn, ZoomOut, Maximize, Minimize, Move,
  // Communication
  Mail, MessageSquare, MessageCircle, Phone, PhoneCall,
  Send, Bell, BellOff, AtSign, Inbox, Reply,
  // Files
  File, FileText, FilePlus, FileMinus, Folder, FolderOpen,
  Archive, Paperclip, FileCode, FileImage,
  // Media
  Image, Camera, Video, Music, Play, Pause, Square,
  Volume, Volume1, Volume2, VolumeX, Mic, MicOff,
  // Users
  User, Users, UserPlus, UserMinus, UserCheck, UserX, Contact,
  // Commerce
  ShoppingCart, ShoppingBag, CreditCard, DollarSign, Wallet,
  Receipt, Gift, Tag, Percent, Package,
  // UI
  Layout, Grid, List, Table, Columns, Sidebar, PanelLeft,
  PanelRight, LayoutDashboard, Layers, Sliders, Settings,
  // Charts
  BarChart, BarChart2, BarChart3, PieChart, LineChart,
  TrendingUp, TrendingDown, Activity,
  // Weather
  Sun, Moon, Cloud, CloudRain, Snowflake, Wind, Thermometer,
  CloudSun, Umbrella, Droplets,
  // Devices
  Monitor, Smartphone, Tablet, Laptop, Wifi, WifiOff,
  Bluetooth, Battery, BatteryCharging, Cpu, HardDrive,
  // Security
  Lock, Unlock, Shield, ShieldCheck, Key, Eye, EyeOff, Fingerprint,
  // General
  Heart, Star, Bookmark, Flag, Clock, Calendar, Map, Globe,
  Zap, Flame, Coffee, Award, Target, Lightbulb, Compass,
  Smile, Frown, AlertCircle, AlertTriangle, Info, HelpCircle,
  CheckCircle, XCircle, MapPin, Hash, Code, Terminal,
  type LucideIcon,
} from "lucide-react";
import { PageBreadcrumb } from "@/components/dashboard/breadcrumb";
import { Input } from "@dashboardpack/core/components/ui/input";
import { Card, CardContent } from "@dashboardpack/core/components/ui/card";

const icons: { name: string; icon: LucideIcon }[] = [
  // Navigation
  { name: "Home", icon: Home },
  { name: "ArrowLeft", icon: ArrowLeft },
  { name: "ArrowRight", icon: ArrowRight },
  { name: "ArrowUp", icon: ArrowUp },
  { name: "ArrowDown", icon: ArrowDown },
  { name: "ChevronDown", icon: ChevronDown },
  { name: "ChevronUp", icon: ChevronUp },
  { name: "ChevronLeft", icon: ChevronLeft },
  { name: "ChevronRight", icon: ChevronRight },
  { name: "Menu", icon: Menu },
  { name: "Search", icon: Search },
  { name: "ExternalLink", icon: ExternalLink },
  { name: "Link", icon: Link },
  { name: "Navigation", icon: Navigation },
  // Actions
  { name: "Plus", icon: Plus },
  { name: "Minus", icon: Minus },
  { name: "X", icon: X },
  { name: "Check", icon: Check },
  { name: "Edit", icon: Edit },
  { name: "Edit2", icon: Edit2 },
  { name: "Edit3", icon: Edit3 },
  { name: "Trash", icon: Trash },
  { name: "Trash2", icon: Trash2 },
  { name: "Copy", icon: Copy },
  { name: "Download", icon: Download },
  { name: "Upload", icon: Upload },
  { name: "Save", icon: Save },
  { name: "RefreshCw", icon: RefreshCw },
  { name: "RotateCw", icon: RotateCw },
  { name: "RotateCcw", icon: RotateCcw },
  { name: "Undo", icon: Undo },
  { name: "Redo", icon: Redo },
  { name: "ZoomIn", icon: ZoomIn },
  { name: "ZoomOut", icon: ZoomOut },
  { name: "Maximize", icon: Maximize },
  { name: "Minimize", icon: Minimize },
  { name: "Move", icon: Move },
  // Communication
  { name: "Mail", icon: Mail },
  { name: "MessageSquare", icon: MessageSquare },
  { name: "MessageCircle", icon: MessageCircle },
  { name: "Phone", icon: Phone },
  { name: "PhoneCall", icon: PhoneCall },
  { name: "Send", icon: Send },
  { name: "Bell", icon: Bell },
  { name: "BellOff", icon: BellOff },
  { name: "AtSign", icon: AtSign },
  { name: "Inbox", icon: Inbox },
  { name: "Reply", icon: Reply },
  // Files
  { name: "File", icon: File },
  { name: "FileText", icon: FileText },
  { name: "FilePlus", icon: FilePlus },
  { name: "FileMinus", icon: FileMinus },
  { name: "Folder", icon: Folder },
  { name: "FolderOpen", icon: FolderOpen },
  { name: "Archive", icon: Archive },
  { name: "Paperclip", icon: Paperclip },
  { name: "FileCode", icon: FileCode },
  { name: "FileImage", icon: FileImage },
  // Media
  { name: "Image", icon: Image },
  { name: "Camera", icon: Camera },
  { name: "Video", icon: Video },
  { name: "Music", icon: Music },
  { name: "Play", icon: Play },
  { name: "Pause", icon: Pause },
  { name: "Square", icon: Square },
  { name: "Volume", icon: Volume },
  { name: "Volume1", icon: Volume1 },
  { name: "Volume2", icon: Volume2 },
  { name: "VolumeX", icon: VolumeX },
  { name: "Mic", icon: Mic },
  { name: "MicOff", icon: MicOff },
  // Users
  { name: "User", icon: User },
  { name: "Users", icon: Users },
  { name: "UserPlus", icon: UserPlus },
  { name: "UserMinus", icon: UserMinus },
  { name: "UserCheck", icon: UserCheck },
  { name: "UserX", icon: UserX },
  { name: "Contact", icon: Contact },
  // Commerce
  { name: "ShoppingCart", icon: ShoppingCart },
  { name: "ShoppingBag", icon: ShoppingBag },
  { name: "CreditCard", icon: CreditCard },
  { name: "DollarSign", icon: DollarSign },
  { name: "Wallet", icon: Wallet },
  { name: "Receipt", icon: Receipt },
  { name: "Gift", icon: Gift },
  { name: "Tag", icon: Tag },
  { name: "Percent", icon: Percent },
  { name: "Package", icon: Package },
  // UI
  { name: "Layout", icon: Layout },
  { name: "Grid", icon: Grid },
  { name: "List", icon: List },
  { name: "Table", icon: Table },
  { name: "Columns", icon: Columns },
  { name: "Sidebar", icon: Sidebar },
  { name: "PanelLeft", icon: PanelLeft },
  { name: "PanelRight", icon: PanelRight },
  { name: "LayoutDashboard", icon: LayoutDashboard },
  { name: "Layers", icon: Layers },
  { name: "Sliders", icon: Sliders },
  { name: "Settings", icon: Settings },
  // Charts
  { name: "BarChart", icon: BarChart },
  { name: "BarChart2", icon: BarChart2 },
  { name: "BarChart3", icon: BarChart3 },
  { name: "PieChart", icon: PieChart },
  { name: "LineChart", icon: LineChart },
  { name: "TrendingUp", icon: TrendingUp },
  { name: "TrendingDown", icon: TrendingDown },
  { name: "Activity", icon: Activity },
  // Weather
  { name: "Sun", icon: Sun },
  { name: "Moon", icon: Moon },
  { name: "Cloud", icon: Cloud },
  { name: "CloudRain", icon: CloudRain },
  { name: "Snowflake", icon: Snowflake },
  { name: "Wind", icon: Wind },
  { name: "Thermometer", icon: Thermometer },
  { name: "CloudSun", icon: CloudSun },
  { name: "Umbrella", icon: Umbrella },
  { name: "Droplets", icon: Droplets },
  // Devices
  { name: "Monitor", icon: Monitor },
  { name: "Smartphone", icon: Smartphone },
  { name: "Tablet", icon: Tablet },
  { name: "Laptop", icon: Laptop },
  { name: "Wifi", icon: Wifi },
  { name: "WifiOff", icon: WifiOff },
  { name: "Bluetooth", icon: Bluetooth },
  { name: "Battery", icon: Battery },
  { name: "BatteryCharging", icon: BatteryCharging },
  { name: "Cpu", icon: Cpu },
  { name: "HardDrive", icon: HardDrive },
  // Security
  { name: "Lock", icon: Lock },
  { name: "Unlock", icon: Unlock },
  { name: "Shield", icon: Shield },
  { name: "ShieldCheck", icon: ShieldCheck },
  { name: "Key", icon: Key },
  { name: "Eye", icon: Eye },
  { name: "EyeOff", icon: EyeOff },
  { name: "Fingerprint", icon: Fingerprint },
  // General
  { name: "Heart", icon: Heart },
  { name: "Star", icon: Star },
  { name: "Bookmark", icon: Bookmark },
  { name: "Flag", icon: Flag },
  { name: "Clock", icon: Clock },
  { name: "Calendar", icon: Calendar },
  { name: "Map", icon: Map },
  { name: "Globe", icon: Globe },
  { name: "Zap", icon: Zap },
  { name: "Flame", icon: Flame },
  { name: "Coffee", icon: Coffee },
  { name: "Award", icon: Award },
  { name: "Target", icon: Target },
  { name: "Lightbulb", icon: Lightbulb },
  { name: "Compass", icon: Compass },
  { name: "Smile", icon: Smile },
  { name: "Frown", icon: Frown },
  { name: "AlertCircle", icon: AlertCircle },
  { name: "AlertTriangle", icon: AlertTriangle },
  { name: "Info", icon: Info },
  { name: "HelpCircle", icon: HelpCircle },
  { name: "CheckCircle", icon: CheckCircle },
  { name: "XCircle", icon: XCircle },
  { name: "MapPin", icon: MapPin },
  { name: "Hash", icon: Hash },
  { name: "Code", icon: Code },
  { name: "Terminal", icon: Terminal },
];

export default function IconsPage() {
  const [query, setQuery] = useState<string>("");

  const filtered = query
    ? icons.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      )
    : icons;

  return (
    <>
      <PageBreadcrumb
        title="Icons"
        items={[{ label: "Elements" }, { label: "Icons" }]}
      />

      <Card>
        <CardContent className="pt-6">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Input
              placeholder="Search icons..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="sm:max-w-xs"
            />
            <p className="text-sm text-muted-foreground">
              Showing {filtered.length} of {icons.length} icons
            </p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {filtered.map(({ name, icon: Icon }) => (
              <button
                key={name}
                className="border rounded-lg p-3 flex flex-col items-center gap-2 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => {
                  navigator.clipboard.writeText(name);
                  toast.success("Copied: " + name);
                }}
                title={name}
              >
                <Icon className="h-6 w-6" />
                <span className="text-xs text-muted-foreground truncate w-full text-center">
                  {name}
                </span>
              </button>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="py-12 text-center text-sm text-muted-foreground">
              No icons found for &ldquo;{query}&rdquo;
            </p>
          )}
        </CardContent>
      </Card>
    </>
  );
}
