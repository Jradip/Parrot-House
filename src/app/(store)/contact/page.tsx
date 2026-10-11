import type { Metadata } from "next";
import { ArrowUpRight, Camera, MapPin, MessageCircle, Store } from "lucide-react";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { createWhatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Kontak",
  description: "Hubungi Parrot House melalui WhatsApp, Instagram, atau Shopee.",
};

export default function ContactPage() {
  const channels = [
    {
      name: "WhatsApp",
      description: "Tanyakan koleksi, ketersediaan, atau pengiriman melalui percakapan langsung.",
      action: "Buka WhatsApp",
      href: createWhatsAppUrl("Halo Parrot House, saya ingin bertanya tentang koleksi burung."),
      icon: MessageCircle,
    },
    {
      name: "Instagram",
      description: "Buka Instagram untuk melihat kanal sosial Parrot House.",
      action: "Buka Instagram",
      href: "https://www.instagram.com/",
      icon: Camera,
    },
    {
      name: "Shopee",
      description: "Buka Shopee untuk menuju kanal toko. Tautan toko khusus akan dilengkapi nanti.",
      action: "Buka Shopee",
      href: "https://shopee.co.id/",
      icon: Store,
    },
  ];

  return (
    <>
      <PageHero eyebrow="Kontak" title="Temui kami di ruang yang paling nyaman." description="Pilih WhatsApp, Instagram, atau Shopee. Setiap tombol akan membuka aplikasi maupun situs platform yang sesuai." />

      <section className="py-12 sm:py-16 lg:py-24">
        <Container className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
          <aside className="h-fit lg:sticky lg:top-28">
            <p className="section-kicker">Alamat</p>
            <div className="mt-5 border-y border-line py-7">
              <MapPin className="text-deep-forest" size={25} strokeWidth={1.6} />
              <h2 className="mt-6 text-balance font-serif text-[2.25rem] font-medium sm:text-4xl">Jl. Bunga Rampai</h2>
              <p className="mt-4 max-w-sm text-sm leading-7 text-muted-text">Hubungi kami terlebih dahulu melalui WhatsApp sebelum merencanakan kunjungan.</p>
            </div>
            <p className="mt-5 text-xs leading-6 text-muted-text">Tautan Instagram dan Shopee masih menggunakan tujuan contoh selama tahap pengembangan lokal.</p>
          </aside>

          <div className="border-t border-line">
            {channels.map(({ name, description, action, href, icon: Icon }) => (
              <a key={name} href={href} target="_blank" rel="noreferrer" className="group grid gap-5 border-b border-line py-7 transition hover:bg-warm-cream sm:grid-cols-[1fr_auto] sm:items-center sm:px-5 sm:py-8">
                <div className="flex items-start gap-5">
                  <Icon className="mt-1 shrink-0 text-deep-forest" size={24} strokeWidth={1.6} />
                  <div><h2 className="font-serif text-[1.75rem] font-semibold sm:text-3xl">{name}</h2><p className="mt-2 max-w-lg text-sm leading-7 text-muted-text">{description}</p></div>
                </div>
                <span className="inline-flex items-center gap-2 text-sm font-bold text-deep-forest">{action}<ArrowUpRight className="transition group-hover:-translate-y-1 group-hover:translate-x-1" size={17} /></span>
              </a>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
