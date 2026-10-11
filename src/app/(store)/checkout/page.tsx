import Script from "next/script";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { requireCustomer as requireUser } from "@/lib/auth/guards";
import { getBirds } from "@/lib/data/catalog";

export const dynamic="force-dynamic";
export default async function CheckoutPage(){await requireUser();const birds=await getBirds();return <><Script src="https://app.sandbox.midtrans.com/snap/snap.js" data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY??""} strategy="afterInteractive"/><PageHero eyebrow="Pembayaran aman" title="Lengkapi pesanan Anda." description="Data penerima, pengiriman, harga, dan stok akan diperiksa kembali sebelum pembayaran dibuka."/><Container className="py-12 lg:py-18"><CheckoutForm birds={birds}/></Container></>}
