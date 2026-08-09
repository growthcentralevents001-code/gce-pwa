import Link from "next/link";
import { GCE_RADIUS, GCE_SURFACE } from "@/lib/frontend/design-language";
import { cn } from "@/lib/utils";

export type PartnerTableColumn<T> = {
  id: string;
  header: string;
  cell: (row: T) => React.ReactNode;
  hideOnMobile?: boolean;
};

/**
 * Responsive partner list/table hybrid.
 * Desktop: table. Mobile: stacked cards.
 */
export function PartnerDataTable<T extends { id: string }>({
  columns,
  rows,
  empty,
  mobileTitle,
  rowHref,
  className,
}: {
  columns: PartnerTableColumn<T>[];
  rows: T[];
  empty?: React.ReactNode;
  mobileTitle: (row: T) => string;
  rowHref?: (row: T) => string | undefined;
  className?: string;
}) {
  if (rows.length === 0) {
    return (
      <div className={cn(GCE_RADIUS.card, GCE_SURFACE.card, "p-6", className)}>
        {empty ?? (
          <p className="text-sm text-muted-foreground">No records to show.</p>
        )}
      </div>
    );
  }

  return (
    <div className={cn(className)}>
      <ul className="space-y-3 md:hidden">
        {rows.map((row) => {
          const href = rowHref?.(row);
          const content = (
            <div className={cn(GCE_RADIUS.card, GCE_SURFACE.card, "p-4")}>
              <p className="font-medium">{mobileTitle(row)}</p>
              <dl className="mt-3 space-y-2">
                {columns.map((col) => (
                  <div key={col.id} className="flex justify-between gap-3 text-sm">
                    <dt className="text-muted-foreground">{col.header}</dt>
                    <dd className="text-right">{col.cell(row)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          );
          return (
            <li key={row.id}>
              {href ? (
                <Link
                  href={href}
                  className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {content}
                </Link>
              ) : (
                content
              )}
            </li>
          );
        })}
      </ul>

      <div
        className={cn(
          "hidden overflow-x-auto md:block",
          GCE_RADIUS.card,
          GCE_SURFACE.card
        )}
      >
        <table className="w-full min-w-[36rem] text-left text-sm">
          <thead className="border-b border-border bg-muted/40">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.id}
                  scope="col"
                  className="px-4 py-3 font-medium text-muted-foreground"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const href = rowHref?.(row);
              return (
                <tr
                  key={row.id}
                  className="border-b border-border/70 last:border-0 hover:bg-muted/20"
                >
                  {columns.map((col, idx) => (
                    <td key={col.id} className="px-4 py-3 align-middle">
                      {idx === 0 && href ? (
                        <Link
                          href={href}
                          className="font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          {col.cell(row)}
                        </Link>
                      ) : (
                        col.cell(row)
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
