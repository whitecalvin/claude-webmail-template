import { forwardRef, useId, type TextareaHTMLAttributes } from "react";
import { cn } from "./utils";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, hint, error, id, className, disabled, rows = 4, ...props },
  ref,
) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;
  const descriptionId = hint || error ? `${textareaId}-description` : undefined;

  return (
    <label htmlFor={textareaId} className="grid min-w-0 gap-1.5 text-sm">
      {label ? <span className="font-medium text-foreground">{label}</span> : null}
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        disabled={disabled}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={descriptionId}
        className={cn(
          "min-h-24 w-full resize-y rounded-(--radius-app) border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-[border-color,box-shadow,background-color] placeholder:text-(--text-muted) focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/15 disabled:cursor-not-allowed disabled:bg-(--surface-muted) disabled:opacity-60",
          error ? "border-(--status-danger)" : "border-(--border-app)",
          className,
        )}
        {...props}
      />
      {error || hint ? (
        <span id={descriptionId} className={cn("text-xs", error ? "text-(--status-danger)" : "text-(--text-muted)")}>
          {error ?? hint}
        </span>
      ) : null}
    </label>
  );
});
