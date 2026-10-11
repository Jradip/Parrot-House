"use client";

import Link from "next/link";
import { History, Settings, UserRound } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/account", label: "Ringkasan", icon: UserRound },
  { href: "/account/orders", label: "Riwayat pesanan", icon: History },
  { href: "/account/profile", label: "Pengaturan", icon: Settings },
];

export function AccountNavigation() {
  const pathname = usePathname();

  return (
    <nav aria-label="Menu akun" className="flex gap-2 overflow-x-auto border-b border-line pb-3 lg:flex-col lg:border-b-0 lg:pb-0">
      {links.map(({ href, label, icon: Icon }) => {
        const active = href === "/account" ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-bold transition",
              active ? "bg-warm-cream text-deep-forest" : "text-muted-text hover:bg-warm-cream hover:text-main-text",
            )}
          >
            <Icon size={17} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
