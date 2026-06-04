import {
  LayoutDashboard, BarChart3, ShoppingCart, Wallet, Bitcoin,
  FolderKanban, Activity, Users, Mail, FolderOpen, MessageSquare,
  Calendar, Bell, FileText, Image, UserCircle, BookOpen, Headphones,
  CreditCard, Receipt, Type, FormInput, Table, PieChart, Layers,
  Lock, AlertTriangle, ListChecks, FilePenLine, Smile, Globe,
  Package, Heart, ShoppingBag, ArrowLeftRight, TrendingUp, Shield, Target,
  Grid3X3, Briefcase, Map
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavItem = {
  title: string;
  href?: string;
  icon?: LucideIcon;
  badge?: string;
  children?: NavItem[];
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export const navGroups: NavGroup[] = [
  {
    label: "FX Tools",
    items: [
      {
        title: "Compare Rates",
        icon: ArrowLeftRight,
        href: "/fx-compare",
      },
      {
        title: "Vanilla Pricer",
        icon: TrendingUp,
        href: "/fx-pricer",
      },
      {
        title: "Barrier Pricer",
        icon: Shield,
        href: "/fx-tools/barrier-pricer",
      },
      {
        title: "TARF Simulator",
        icon: Target,
        href: "/fx-tools/tarf-simulator",
      },
      {
        title: "Sensitivity Matrix",
        icon: Grid3X3,
        href: "/fx-tools/sensitivity-matrix",
      },
      {
        title: "Client Positions",
        icon: Briefcase,
        href: "/fx-tools/client-positions",
      },
      {
        title: "Rate Path Planner",
        icon: Map,
        href: "/fx-tools/rate-path-planner",
      },
    ],
  },
  {
    label: "Navigation",
    items: [
      {
        title: "Dashboard",
        icon: LayoutDashboard,
        children: [
          { title: "Analytics", href: "/dashboard/analytics" },
          { title: "CRM", href: "/dashboard/crm" },
          { title: "eCommerce", href: "/dashboard/ecommerce" },
          { title: "Finance", href: "/dashboard/finance" },
          { title: "Crypto", href: "/dashboard/crypto" },
          { title: "Project", href: "/dashboard/project" },
          { title: "SaaS", href: "/dashboard/saas" },
          { title: "HR", href: "/dashboard/hr" },
          { title: "Marketing", href: "/dashboard/marketing" },
        ],
      },
    ],
  },
  {
    label: "Application",
    items: [
      { title: "Chat", icon: MessageSquare, href: "/application/chat" },
      { title: "Email", icon: Mail, href: "/application/email" },
      { title: "Calendar", icon: Calendar, href: "/application/calendar" },
      { title: "File Manager", icon: FolderOpen, href: "/application/file-manager" },
      { title: "Task Board", icon: FolderKanban, href: "/application/task-board" },
      { title: "Notifications", icon: Bell, href: "/application/notifications" },
      { title: "Gallery", icon: Image, href: "/application/gallery" },
      { title: "Users", icon: Users, href: "/application/users" },
      { title: "Invoices", icon: FileText, href: "/application/invoices" },
    ],
  },
  {
    label: "E-commerce",
    items: [
      { title: "Products", icon: Package, href: "/ecommerce/products" },
      { title: "Cart", icon: ShoppingCart, href: "/ecommerce/cart" },
      { title: "Orders", icon: Receipt, href: "/ecommerce/orders" },
      { title: "Wishlist", icon: Heart, href: "/ecommerce/wishlist" },
    ],
  },
  {
    label: "Elements",
    items: [
      { title: "Typography", icon: Type, href: "/elements/typography" },
      { title: "Components", icon: Layers, href: "/elements/components" },
      { title: "Icons", icon: Smile, href: "/elements/icons" },
    ],
  },
  {
    label: "Forms",
    items: [
      { title: "Form Elements", icon: FormInput, href: "/forms/form-elements" },
      { title: "Form Wizard", icon: ListChecks, href: "/forms/wizard" },
      { title: "Editor", icon: FilePenLine, href: "/forms/editor" },
    ],
  },
  {
    label: "Tables",
    items: [
      { title: "Data Tables", icon: Table, href: "/tables/data-tables" },
    ],
  },
  {
    label: "Charts & Maps",
    items: [
      { title: "Charts", icon: PieChart, href: "/charts/apex-charts" },
    ],
  },
  {
    label: "Other",
    items: [
      { title: "Sample Page", icon: BookOpen, href: "/other/sample-page" },
      { title: "Pricing", icon: CreditCard, href: "/other/pricing" },
      { title: "Landing Page", icon: Globe, href: "/landing" },
    ],
  },
  {
    label: "Auth Pages",
    items: [
      {
        title: "Authentication",
        icon: Lock,
        children: [
          { title: "Login V1", href: "/v1/login" },
          { title: "Login V2", href: "/v2/login" },
          { title: "Register V1", href: "/v1/register" },
          { title: "Register V2", href: "/v2/register" },
          { title: "Forgot Password V1", href: "/v1/forgot-password" },
          { title: "Forgot Password V2", href: "/v2/forgot-password" },
          { title: "Reset Password V1", href: "/v1/reset-password" },
          { title: "Reset Password V2", href: "/v2/reset-password" },
          { title: "Verify Email V1", href: "/v1/verify-email" },
          { title: "Verify Email V2", href: "/v2/verify-email" },
          { title: "Two Factor V1", href: "/v1/two-factor" },
          { title: "Two Factor V2", href: "/v2/two-factor" },
          { title: "Lock Screen V1", href: "/v1/lock-screen" },
          { title: "Lock Screen V2", href: "/v2/lock-screen" },
          { title: "Account Disabled V1", href: "/v1/account-disabled" },
          { title: "Account Disabled V2", href: "/v2/account-disabled" },
          { title: "Password Changed V1", href: "/v1/password-changed" },
          { title: "Password Changed V2", href: "/v2/password-changed" },
        ],
      },
    ],
  },
  {
    label: "Utility Pages",
    items: [
      {
        title: "Pages",
        icon: AlertTriangle,
        children: [
          { title: "Error 404", href: "/error-404" },
          { title: "Error 500", href: "/error-500" },
          { title: "Error 403", href: "/error-403" },
          { title: "Maintenance", href: "/maintenance" },
          { title: "Coming Soon", href: "/coming-soon" },
          { title: "Under Construction", href: "/under-construction" },
          { title: "Offline", href: "/offline" },
          { title: "Session Expired", href: "/session-expired" },
          { title: "Rate Limited", href: "/rate-limited" },
        ],
      },
    ],
  },
];

export const systemNav: NavItem[] = [
  { title: "Settings", icon: UserCircle, href: "/settings/profile" },
  { title: "Documentation", icon: BookOpen, href: "/docs" },
];
