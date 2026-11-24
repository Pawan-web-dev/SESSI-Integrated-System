import type { ReactNode } from 'react';

interface AdminTableProps {
  headers: string[];
  rows: ReactNode[][];
  /** text shown when there are no rows */
  empty: string;
  /** stable key per row (same length as rows) */
  rowKeys: string[];
}

/** Scrollable data table used by every admin view. */
export function AdminTable({ headers, rows, empty, rowKeys }: AdminTableProps) {
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            {headers.map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length ? (
            rows.map((cells, i) => (
              <tr key={rowKeys[i]}>
                {cells.map((c, j) => (
                  <td key={j}>{c}</td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={headers.length} className="admin-muted">
                {empty}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

/** Small coloured status label. */
export function StatusPill({ tone, children }: { tone?: 'pending' | 'rejected' | 'review'; children: ReactNode }) {
  return <span className={'admin-pill' + (tone ? ' ' + tone : '')}>{children}</span>;
}
