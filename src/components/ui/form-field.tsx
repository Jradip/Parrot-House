import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function FormField({ label, error, className, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  const id = props.id ?? props.name;
  return (
    <label htmlFor={id} className={cn("grid gap-2 text-sm font-bold text-main-text", className)}>
      {label}
      <input id={id} className="min-h-12 rounded-[var(--radius-sm)] border border-line bg-off-white px-4 font-normal outline-none transition focus:border-deep-forest" aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} {...props} />
      {error ? <span id={`${id}-error`} className="text-xs font-medium text-danger">{error}</span> : null}
    </label>
  );
}

export function TextAreaField({ label, error, className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; error?: string }) {
  const id = props.id ?? props.name;
  return (
    <label htmlFor={id} className={cn("grid gap-2 text-sm font-bold text-main-text", className)}>
      {label}
      <textarea id={id} className="min-h-32 resize-y rounded-[var(--radius-sm)] border border-line bg-off-white px-4 py-3 font-normal outline-none transition focus:border-deep-forest" aria-invalid={Boolean(error)} {...props} />
      {error ? <span className="text-xs font-medium text-danger">{error}</span> : null}
    </label>
  );
}
