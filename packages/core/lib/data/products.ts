import type { Product, ProductStatus } from "./types";

let products: Product[] = [
  { id: "prod-1", name: "Pro Dashboard License", description: "Full-featured admin dashboard template with all components and pages.", price: 299, category: "Templates", stock: 999, status: "active", createdAt: "Jan 15, 2026" },
  { id: "prod-2", name: "Team Plan Upgrade", description: "Upgrade to team plan with shared access and collaboration features.", price: 599, category: "Plans", stock: 999, status: "active", createdAt: "Jan 10, 2026" },
  { id: "prod-3", name: "Enterprise License", description: "Enterprise-grade license with priority support and custom branding.", price: 1499, category: "Licenses", stock: 999, status: "active", createdAt: "Dec 20, 2025" },
  { id: "prod-4", name: "Single License", description: "Single-use license for personal or single-client projects.", price: 79, category: "Licenses", stock: 999, status: "active", createdAt: "Dec 15, 2025" },
  { id: "prod-5", name: "Starter Plan", description: "Affordable starter plan with essential dashboard components.", price: 49, category: "Plans", stock: 999, status: "active", createdAt: "Nov 28, 2025" },
  { id: "prod-6", name: "UI Component Pack", description: "50+ pre-built UI components for rapid prototyping.", price: 149, category: "Templates", stock: 999, status: "active", createdAt: "Nov 15, 2025" },
  { id: "prod-7", name: "E-commerce Module", description: "Add-on module with product catalog, cart, and checkout components.", price: 199, category: "Modules", stock: 999, status: "active", createdAt: "Oct 30, 2025" },
  { id: "prod-8", name: "Analytics Dashboard", description: "Specialized analytics dashboard with advanced chart components.", price: 249, category: "Templates", stock: 999, status: "active", createdAt: "Oct 15, 2025" },
  { id: "prod-9", name: "CRM Module", description: "Customer relationship management module with pipeline and contacts.", price: 349, category: "Modules", stock: 999, status: "draft", createdAt: "Sep 25, 2025" },
  { id: "prod-10", name: "Email Template Pack", description: "20+ responsive email templates for transactional and marketing emails.", price: 99, category: "Templates", stock: 999, status: "active", createdAt: "Sep 10, 2025" },
  { id: "prod-11", name: "Landing Page Builder", description: "Drag-and-drop landing page builder with pre-designed sections.", price: 179, category: "Templates", stock: 999, status: "draft", createdAt: "Aug 20, 2025" },
  { id: "prod-12", name: "Auth Module", description: "Complete authentication module with login, register, and social auth.", price: 129, category: "Modules", stock: 999, status: "active", createdAt: "Aug 5, 2025" },
  { id: "prod-13", name: "Chat Widget", description: "Real-time chat widget component with message history.", price: 89, category: "Modules", stock: 999, status: "archived", createdAt: "Jul 15, 2025" },
  { id: "prod-14", name: "Legacy Dashboard v1", description: "Original dashboard template (Bootstrap 4 based).", price: 39, category: "Templates", stock: 999, status: "archived", createdAt: "Mar 1, 2025" },
  { id: "prod-15", name: "Notification System", description: "Push notification system with real-time updates and preferences.", price: 159, category: "Modules", stock: 999, status: "active", createdAt: "Jul 1, 2025" },
];

let nextNum = 16;

export interface ProductFilters {
  status?: ProductStatus;
  category?: string;
  search?: string;
  page?: number;
  perPage?: number;
}

export function getProducts(filters?: ProductFilters) {
  let result = [...products];

  if (filters?.status) {
    result = result.filter((p) => p.status === filters.status);
  }

  if (filters?.category) {
    result = result.filter((p) => p.category === filters.category);
  }

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }

  const total = result.length;
  const page = filters?.page ?? 1;
  const perPage = filters?.perPage ?? 10;
  const start = (page - 1) * perPage;

  return {
    data: result.slice(start, start + perPage),
    total,
    page,
    perPage,
    totalPages: Math.ceil(total / perPage),
  };
}

export function getProductIds() {
  return products.map((p) => p.id);
}

export function getProductById(id: string) {
  return products.find((p) => p.id === id);
}

export function createProduct(data: Omit<Product, "id">) {
  const product: Product = { ...data, id: `prod-${nextNum++}` };
  products = [product, ...products];
  return product;
}

export function updateProduct(id: string, data: Partial<Product>) {
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return null;
  products[index] = { ...products[index], ...data, id };
  return products[index];
}

export function deleteProduct(id: string) {
  const before = products.length;
  products = products.filter((p) => p.id !== id);
  return products.length < before;
}

export function getProductCategories() {
  return [...new Set(products.map((p) => p.category))];
}
