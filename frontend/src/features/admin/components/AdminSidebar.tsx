import { ADMIN_PAGES, type AdminPageKey } from './adminPages';

interface AdminSidebarProps {
  page: AdminPageKey;
  onSelect: (page: AdminPageKey) => void;
}

/** Left navigation of the admin workspace. */
export function AdminSidebar({ page, onSelect }: AdminSidebarProps) {
  return (
    <aside className="admin-side">
      <div className="admin-brand">
        ESSI ADMIN
        <br />
        <small className="admin-muted">Employer Management</small>
      </div>
      <nav className="admin-nav" aria-label="Admin sections">
        {ADMIN_PAGES.map((p) => (
          <button key={p.key} type="button" className={page === p.key ? 'active' : ''} aria-current={page === p.key ? 'page' : undefined} onClick={() => onSelect(p.key)}>
            {p.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
