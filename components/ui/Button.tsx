import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { LoaderCircle } from "lucide-react";
import { cn } from "./utils";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg" | "icon";

const VARIANT_STYLE: Record<ButtonVariant, string> = {
  primary: "bg-(--color-primary) text-white shadow-sm hover:brightness-105 active:brightness-95",
  secondary: "border border-(--border-app) bg-background text-foreground hover:bg-(--surface-muted)",
  ghost: "text-foreground hover:bg-black/5 dark:hover:bg-white/8",
  danger: "bg-(--status-danger) text-white shadow-sm hover:brightness-105 active:brightness-95",
};

const SIZE_STYLE: Record<ButtonSize, string> = {
  sm: "min-h-8 gap-1.5 px-3 py-1.5 text-xs",
  md: "min-h-10 gap-2 px-4 py-2 text-sm",
  lg: "min-h-11 gap-2 px-5 py-2.5 text-sm",
  icon: "size-10 p-0",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "secondary",
    size = "md",
    loading = false,
    leadingIcon,
    trailingIcon,
    disabled,
    className,
    children,
    type = "button",
    ...props
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-(--radius-app) font-semibold outline-none transition-[background-color,color,border-color,box-shadow,filter,transform] focus-visible:ring-2 focus-visible:ring-(--color-primary)/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-45",
        VARIANT_STYLE[variant],
        SIZE_STYLE[size],
        className,
      )}
      {...props}
    >
      {loading ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : leadingIcon}
      {children}
      {!loading ? trailingIcon : null}
    </button>
  );
});
