"use client";

import Link from "next/link";
import { Menu, ShoppingBag, UserRound, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Brand } from "@/components/layout/brand";
import { useCart } from "@/components/cart/cart-provider";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/", label: "Beranda" },
  { href: "/birds", label: "Koleksi" },
  { href: "/bird-guide", label: "Panduan" },
  { href: "/about", label: "Tentang" },
  { href: "/how-to-order", label: "Cara Pesan" },
  { href: "/contact", label: "Kontak" },
];

export function SiteHeader({ userRole }: { userRole: "CUSTOMER" | "ADMIN" | null }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-soft-background/95 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-3 sm:h-18 sm:gap-6">
        <Brand />
        <nav aria-label="Navigasi utama" className="hidden items-center gap-7 lg:flex">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className={cn("text-sm font-semibold text-muted-text transition hover:text-deep-forest", (pathname === item.href || (item.href !== "/" && pathname.startsWith(`${item.href}/`))) && "text-deep-forest")}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
          <Link href={userRole === "ADMIN" ? "/admin" : "/account"} aria-label={userRole === "ADMIN" ? "Ringkasan admin" : "Akun"} className="hidden size-11 place-items-center rounded-full transition hover:bg-warm-cream sm:grid"><UserRound size={19} /></Link>
          {userRole !== "ADMIN" ? <Link href="/cart" aria-label="Keranjang" className="relative grid size-11 place-items-center rounded-full transition hover:bg-warm-cream">
            <ShoppingBag size={19} />
            {count > 0 ? <span className="absolute right-0.5 top-0.5 grid min-w-4 place-items-center rounded-full bg-warm-gold px-1 text-[9px] font-extrabold text-main-text">{count}</span> : null}
          </Link> : null}
          <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? "Tutup menu" : "Buka menu"} className="grid size-11 place-items-center rounded-full transition hover:bg-warm-cream lg:hidden">
            {open ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </Container>
      <div id="mobile-navigation" className={cn("overflow-hidden border-t border-line bg-warm-cream transition-[max-height,opacity] duration-300 lg:hidden", open ? "max-h-[520px] opacity-100" : "max-h-0 border-transparent opacity-0")}>
        <Container className="grid gap-1 py-4">
          {navigation.map((item) => <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-base font-semibold hover:bg-off-white">{item.label}</Link>)}
          <Link href={userRole === "ADMIN" ? "/admin" : "/account"} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-base font-semibold hover:bg-off-white sm:hidden">{userRole === "ADMIN" ? "Ringkasan admin" : "Akun saya"}</Link>
        </Container>
      </div>
    </header>
  );
}
