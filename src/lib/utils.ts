import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function safeImageSrc(url: string | null | undefined, kind: "book" | "avatar" = "book") {
  const placeholder = kind === "avatar" ? "/placeholder-avatar.svg" : "/placeholder-book.svg";
  if (!url) return placeholder;
  // Allow only public assets and our uploaded files
  if (url.startsWith("/")) return url; // /uploads/... or other public assets
  if (url.startsWith("data:")) return url;
  // Everything else (http/https/unknown) -> fallback to placeholder to avoid Next/Image domain errors
  return placeholder;
}
