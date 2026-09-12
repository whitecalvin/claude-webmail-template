import { cn } from "./utils";

export function Divider({ orientation = "horizontal", className }: { orientation?: "horizontal" | "vertical"; className?: string }) {
  return <span role="separator" aria-orientation={orientation} className={cn("shrink-0 bg-(--border-app)", orientation === "horizontal" ? "block h-px w-full" : "inline-block h-full w-px", className)} />;
}
