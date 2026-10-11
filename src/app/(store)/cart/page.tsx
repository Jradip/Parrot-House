import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CartView } from "@/components/cart/cart-view";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { getSessionRole } from "@/lib/auth/guards";
import { getBirds } from "@/lib/data/catalog";

export const metadata: Metadata = { title: "Keranjang" };
export const dynamic = "force-dynamic";

export default async function CartPage() {
  const session = await getSessionRole();
  if (session?.role === "ADMIN") redirect("/admin");
  const birds = await getBirds();

  return (
    <>
      <PageHero eyebrow="Pilihan Anda" title="Keranjang" description="Tinjau pilihan Anda sebelum melanjutkan ke informasi penerima dan pengiriman." />
      <Container className="py-10 lg:py-16"><CartView birds={birds} isAuthenticated={session?.role === "CUSTOMER"} /></Container>
    </>
  );
}
