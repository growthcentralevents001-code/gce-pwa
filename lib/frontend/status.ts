/**
 * Semantic status presentation — domain batches extend label maps later.
 */

export type StatusTone =
  | "success"
  | "warning"
  | "pending"
  | "error"
  | "neutral"
  | "inactive"
  | "info";

export const statusToneClasses: Record<
  StatusTone,
  { badge: string; dot: string; text: string }
> = {
  success: {
    badge: "border-success/30 bg-success/10 text-success",
    dot: "bg-success",
    text: "text-success",
  },
  warning: {
    badge: "border-warning/30 bg-warning/10 text-warning",
    dot: "bg-warning",
    text: "text-warning",
  },
  pending: {
    badge: "border-warning/30 bg-warning/10 text-warning",
    dot: "bg-warning",
    text: "text-warning",
  },
  error: {
    badge: "border-destructive/30 bg-destructive/10 text-destructive",
    dot: "bg-destructive",
    text: "text-destructive",
  },
  neutral: {
    badge: "border-border bg-muted text-muted-foreground",
    dot: "bg-muted-foreground",
    text: "text-muted-foreground",
  },
  inactive: {
    badge: "border-border bg-muted/60 text-muted-foreground",
    dot: "bg-muted-foreground/50",
    text: "text-muted-foreground",
  },
  info: {
    badge: "border-info/30 bg-info/10 text-info",
    dot: "bg-info",
    text: "text-info",
  },
};

/** Generic keyword → tone mapping for Batch 0; domain maps override later. */
export function toneFromStatusKeyword(raw: string): StatusTone {
  const s = raw.toLowerCase();
  if (/\b(inactive|disabled|archived|closed)\b/.test(s)) return "inactive";
  if (/\b(active|approved|success|completed|paid|settled)\b/.test(s))
    return "success";
  if (/\b(pending|queued|review|await|processing)\b/.test(s)) return "pending";
  if (/\b(warn|expir|risk|hold)\b/.test(s)) return "warning";
  if (/\b(error|failed|rejected|denied|suspended|revoked)\b/.test(s))
    return "error";
  if (/\b(info|draft|new)\b/.test(s)) return "info";
  return "neutral";
}
