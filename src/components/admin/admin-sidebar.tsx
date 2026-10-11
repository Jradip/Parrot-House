"use client";

import Link from "next/link";
import { Bird, Boxes, ExternalLink, LayoutDashboard, MapPin, Package, Settings, ShieldCheck, Users } from "lucide-react";
import { usePathname } from "next/navigation";
import { Brand } from "@/components/layout/brand";
import { LogoutButton } from "@/components/account/logout-button";
import { cn } from "@/lib/utils";

const links = [
  [LayoutDashboard, "Ringkasan", "/admin"],
  [Package, "Pesanan", "/admin/orders"],
  [Bird, "Burung", "/admin/birds"],
  [Boxes, "Kategori", "/admin/categories"],
  [MapPin, "Pengiriman", "/admin/shipping"],
  [Users, "Pelanggan", "/admin/customers"],
  [ShieldCheck, "Admin", "/admin/admins"],
  [Settings, "Pengaturan", "/admin/settings"],
] as const;

export function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="sticky top-0 z-50 border-b border-line bg-deep-forest text-off-white lg:h-screen lg:border-b-0">
      <div className="flex h-full flex-col p-4 sm:p-5 lg:p-7">
        <div className="flex items-center justify-between gap-4 border-b border-off-white/15 pb-4 lg:block lg:pb-5">
          <Brand inverse compact />
          <div className="flex items-center gap-4 lg:hidden">
            <Link href="/" aria-label="Lihat situs" className="text-off-white/70 transition hover:text-off-white"><ExternalLink size={17} /></Link>
            <LogoutButton inverse />
          </div>
        </div>
        <div className="mt-5 hidden items-center justify-between gap-3 lg:block">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-soft-green">Ruang operasional</p>
            <p className="mt-1 font-serif text-2xl">Pengelolaan toko</p>
          </div>
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-off-white/70 transition hover:text-off-white">
            <ExternalLink size={15} /> Lihat situs
          </Link>
        </div>
        <nav className="mt-3 flex gap-1 overflow-x-auto pb-1 sm:mt-4 lg:mt-7 lg:flex-col" aria-label="Navigasi admin">
          {links.map(([Icon, label, href]) => (
            <Link key={href} href={href} aria-current={pathname === href || (href !== "/admin" && pathname.startsWith(`${href}/`)) ? "page" : undefined} className={cn("inline-flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition hover:bg-off-white/10 hover:text-off-white", pathname === href || (href !== "/admin" && pathname.startsWith(`${href}/`)) ? "bg-off-white/15 text-off-white" : "text-off-white/70")}>
              <Icon size={17} />{label}
            </Link>
          ))}
        </nav>
        <div className="mt-6 hidden border-t border-off-white/15 pt-5 lg:mt-auto lg:block"><LogoutButton inverse /></div>
      </div>
    </aside>
  );
}
