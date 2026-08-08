"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * High-contrast QR from backend-provided payload only.
 * Never invents or hashes secrets client-side.
 */
export function QrDisplay({
  value,
  label = "Scan at venue",
  className,
  size = 200,
}: {
  value: string;
  label?: string;
  className?: string;
  size?: number;
}) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(
    value ? null : "No code available"
  );

  useEffect(() => {
    let cancelled = false;
    if (!value) {
      queueMicrotask(() => {
        if (!cancelled) {
          setDataUrl(null);
          setError("No code available");
        }
      });
      return () => {
        cancelled = true;
      };
    }
    QRCode.toDataURL(value, {
      errorCorrectionLevel: "M",
      margin: 2,
      width: size,
    })
      .then((url) => {
        if (!cancelled) {
          setError(null);
          setDataUrl(url);
        }
      })
      .catch(() => {
        if (!cancelled) setError("Could not render code");
      });
    return () => {
      cancelled = true;
    };
  }, [value, size]);

  return (
    <figure
      className={cn(
        "mx-auto flex w-fit flex-col items-center gap-3 rounded-2xl border-2 border-foreground/90 bg-white p-4 text-slate-900 shadow-sm",
        className
      )}
    >
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : dataUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- data URL QR
        <img
          src={dataUrl}
          alt={label}
          width={size}
          height={size}
          className="h-auto w-full max-w-[220px]"
        />
      ) : (
        <Skeleton className="h-[200px] w-[200px] rounded-lg" />
      )}
      <figcaption className="text-center text-xs font-medium text-slate-700">
        {label}
      </figcaption>
    </figure>
  );
}
