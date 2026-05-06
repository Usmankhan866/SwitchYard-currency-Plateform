type PageBreadcrumbProps = {
  title: string;
  items: { label: string; href?: string }[];
};

export function PageBreadcrumb({ title, items }: PageBreadcrumbProps) {
  return (
    <div className="mb-6">
      <div className="page-header">
        <h5 className="mb-0 text-base font-semibold text-foreground">{title}</h5>
        <ul className="mt-2 flex items-center gap-1 text-sm">
          <li>
            <a
              href="/dashboard/analytics"
              className="text-muted-foreground hover:text-primary"
            >
              Home
            </a>
          </li>
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-1">
              <span className="text-muted-foreground/50">/</span>
              {item.href ? (
                <a
                  href={item.href}
                  className="text-muted-foreground hover:text-primary"
                >
                  {item.label}
                </a>
              ) : (
                <span className="text-muted-foreground">{item.label}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
