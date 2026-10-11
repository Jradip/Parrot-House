import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "quiet";

export function buttonStyles(variant: Variant = "primary") {
  return cn(
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition duration-200 disabled:cursor-not-allowed disabled:opacity-50",
    variant === "primary" && "bg-deep-forest text-off-white hover:bg-forest-strong hover:-translate-y-0.5",
    variant === "secondary" && "border border-deep-forest/25 bg-off-white/65 text-deep-forest hover:border-deep-forest hover:bg-off-white",
    variant === "quiet" && "px-1 text-deep-forest underline decoration-warm-gold/60 underline-offset-8 hover:decoration-deep-forest",
  );
}

export function Button({ variant = "primary", className, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button className={cn(buttonStyles(variant), className)} {...props} />;
}

export function ButtonLink({ href, children, variant = "primary", className }: { href: string; children: ReactNode; variant?: Variant; className?: string }) {
  return <Link href={href} className={cn(buttonStyles(variant), className)}>{children}</Link>;
}
