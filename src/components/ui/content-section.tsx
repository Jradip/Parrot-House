import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";

export function ContentSection({ title, children, tone = "light" }: { title: string; children: ReactNode; tone?: "light" | "cream" }) {
  return <section className={tone === "cream" ? "bg-warm-cream py-14 lg:py-20" : "py-14 lg:py-20"}><Container className="grid gap-7 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16"><h2 className="max-w-sm font-serif text-3xl font-medium leading-tight sm:text-4xl">{title}</h2><div className="max-w-3xl space-y-5 text-base leading-8 text-muted-text">{children}</div></Container></section>;
}
