export interface DocsNavItem {
  title: string;
  href: string;
}

export interface DocsNavGroup {
  title: string;
  items: DocsNavItem[];
}

export const docsNavigation: DocsNavGroup[] = [
  {
    title: "Getting Started",
    items: [
      { title: "Introduction", href: "/docs" },
      { title: "Installation", href: "/docs/getting-started" },
      { title: "Folder Structure", href: "/docs/folder-structure" },
    ],
  },
  {
    title: "Customization",
    items: [
      { title: "Theming", href: "/docs/theming" },
      { title: "Adding Pages", href: "/docs/adding-pages" },
      { title: "Components", href: "/docs/components" },
      { title: "Charts", href: "/docs/charts" },
      { title: "Internationalization", href: "/docs/i18n" },
    ],
  },
  {
    title: "Features",
    items: [
      { title: "E-commerce", href: "/docs/ecommerce" },
      { title: "Form Wizard", href: "/docs/form-wizard" },
      { title: "Rich Text Editor", href: "/docs/rich-text-editor" },
    ],
  },
  {
    title: "Development",
    items: [
      { title: "Deploy to Production", href: "/docs/deployment" },
      { title: "Changelog", href: "/docs/changelog" },
    ],
  },
];
