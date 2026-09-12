import type { ReactNode } from "react";
import { cn } from "./utils";

export function EmptyState({ icon, title, description, action, className }: { icon?: ReactNode; title: ReactNode; description?: ReactNode; action?: ReactNode; className?: string }) {
  return <div className={cn("flex min-h-48 flex-col items-center justify-center px-6 py-10 text-center", className)}>{icon ? <span className="mb-3 flex size-11 items-center justify-center rounded-full bg-(--surface-muted) text-(--text-muted)">{icon}</span> : null}<h2 className="font-semibold">{title}</h2>{description ? <p className="mt-1 max-w-md text-sm text-(--text-muted)">{description}</p> : null}{action ? <div className="mt-4">{action}</div> : null}</div>;
}
