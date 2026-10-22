"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface AvatarProps {
  initials: string;
  src?: string;
  alt?: string;
  className?: string;
}

export function Avatar({ initials, src, alt = "", className }: AvatarProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => setFailed(false), [src]);

  if (src && !failed) {
    return (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onError={() => setFailed(true)}
        className={cn(
          "h-9 w-9 shrink-0 rounded-full bg-slate-100 object-cover",
          className,
        )}
      />
    );
  }

  return (
    <span
      aria-hidden
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700",
        className,
      )}
    >
      {initials}
    </span>
  );
}
