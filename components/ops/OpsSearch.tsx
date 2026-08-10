"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/states/StatusBadge";
import { opsStatusTone } from "@/lib/frontend/ops/format";

type SearchResult = {
  cases: Array<{
    id: string;
    case_number?: string;
    summary?: string;
    status?: string;
    vertical?: string;
  }>;
  approvals: Array<{
    id: string;
    title?: string;
    status?: string;
    vertical?: string;
    subject_type?: string;
  }>;
  exceptions: Array<{
    id: string;
    title?: string;
    status?: string;
    severity?: string;
    vertical?: string;
  }>;
};

/**
 * Scoped ops search — RBAC enforced by /api/ops/admin?view=search.
 * Structure inspired by 21st command palette (keyboard + categories); GCE warm chrome.
 */
export function OpsSearch({ enabled = true }: { enabled?: boolean }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [result, setResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!enabled) return;
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [enabled]);

  const runSearch = useCallback((query: string) => {
    if (query.trim().length < 2) {
      setResult(null);
      return;
    }
    startTransition(async () => {
      setError(null);
      const res = await fetch(
        `/api/ops/admin?view=search&q=${encodeURIComponent(query.trim())}`
      );
      if (!res.ok) {
        setError("Search unavailable for your role or query.");
        setResult(null);
        return;
      }
      const json = await res.json();
      setResult(json.data ?? json);
    });
  }, []);

  useEffect(() => {
    const t = setTimeout(() => runSearch(q), 280);
    return () => clearTimeout(t);
  }, [q, runSearch]);

  if (!enabled) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Search className="h-4 w-4" aria-hidden />
          <span className="hidden sm:inline">Search</span>
          <kbd className="hidden rounded border border-border px-1.5 text-[10px] text-muted-foreground md:inline">
            ⌘K
          </kbd>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg gap-0 p-0">
        <DialogHeader className="border-b border-border px-4 py-3 text-left">
          <DialogTitle>Operational search</DialogTitle>
          <DialogDescription>
            Scoped to authorized cases, approvals, and exceptions. No KYC or bank
            dump.
          </DialogDescription>
        </DialogHeader>
        <div className="px-4 py-3">
          <Input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search case number, title, subject…"
            aria-label="Operational search query"
          />
        </div>
        <div className="max-h-80 overflow-y-auto px-2 pb-4">
          {pending ? (
            <p className="px-2 py-2 text-xs text-muted-foreground">Searching…</p>
          ) : null}
          {error ? (
            <p className="px-2 py-2 text-xs text-destructive" role="alert">
              {error}
            </p>
          ) : null}
          {result ? (
            <div className="space-y-4 px-2">
              <ResultGroup
                label="Cases"
                empty={result.cases.length === 0}
                onPick={() => setOpen(false)}
              >
                {result.cases.map((c) => (
                  <ResultLink
                    key={c.id}
                    href={`/ops/cases/${c.id}`}
                    title={c.case_number ?? c.id.slice(0, 8)}
                    meta={c.summary}
                    status={c.status}
                    onPick={() => setOpen(false)}
                  />
                ))}
              </ResultGroup>
              <ResultGroup
                label="Approvals"
                empty={result.approvals.length === 0}
                onPick={() => setOpen(false)}
              >
                {result.approvals.map((a) => (
                  <ResultLink
                    key={a.id}
                    href="/ops/approvals"
                    title={a.title ?? a.id.slice(0, 8)}
                    meta={`${a.vertical ?? ""} · ${a.subject_type ?? ""}`}
                    status={a.status}
                    onPick={() => setOpen(false)}
                  />
                ))}
              </ResultGroup>
              <ResultGroup
                label="Exceptions"
                empty={result.exceptions.length === 0}
                onPick={() => setOpen(false)}
              >
                {result.exceptions.map((e) => (
                  <ResultLink
                    key={e.id}
                    href="/ops/exceptions"
                    title={e.title ?? e.id.slice(0, 8)}
                    meta={`${e.vertical ?? ""} · ${e.severity ?? ""}`}
                    status={e.status}
                    onPick={() => setOpen(false)}
                  />
                ))}
              </ResultGroup>
            </div>
          ) : (
            <p className="px-2 py-2 text-xs text-muted-foreground">
              Type at least 2 characters. Results respect your role scope.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ResultGroup({
  label,
  empty,
  children,
}: {
  label: string;
  empty: boolean;
  children: React.ReactNode;
  onPick?: () => void;
}) {
  return (
    <div>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      {empty ? (
        <p className="text-xs text-muted-foreground">No matches</p>
      ) : (
        <ul className="space-y-1">{children}</ul>
      )}
    </div>
  );
}

function ResultLink({
  href,
  title,
  meta,
  status,
  onPick,
}: {
  href: string;
  title: string;
  meta?: string;
  status?: string;
  onPick: () => void;
}) {
  return (
    <li>
      <Link
        href={href}
        onClick={onPick}
        className="flex items-start justify-between gap-2 rounded-md px-2 py-2 text-sm hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span className="min-w-0">
          <span className="block font-medium">{title}</span>
          {meta ? (
            <span className="block truncate text-xs text-muted-foreground">
              {meta}
            </span>
          ) : null}
        </span>
        {status ? (
          <StatusBadge label={status} tone={opsStatusTone(status)} />
        ) : null}
      </Link>
    </li>
  );
}
