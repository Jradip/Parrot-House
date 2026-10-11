import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, MessageCircle } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description: "Mengenal toko Parrot House.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Tentang kami"
        title="Mengenal Parrot House."
        description="Toko burung paruh bengkok dengan informasi koleksi, pemesanan, pembayaran, dan pengiriman yang tersusun dalam satu tempat."
      />

      <section className="py-12 sm:py-14 lg:py-20">
        <Container className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div className="relative mx-auto aspect-square w-full max-w-xl overflow-hidden rounded-[var(--radius-md)] bg-off-white lg:max-w-none">
            <Image src="/images/parrot-house-emblem.webp" alt="Emblem Parrot House bergambar burung paruh bengkok dan rumah" fill loading="eager" sizes="(max-width: 1024px) 100vw, 42vw" className="object-contain p-5 sm:p-8" />
          </div>
          <div className="max-w-2xl">
            <p className="section-kicker">Tentang toko</p>
            <h2 className="mt-3 font-serif text-3xl font-medium leading-tight sm:text-4xl">Mengenal sebelum memilih.</h2>
            <p className="mt-5 text-base leading-8 text-muted-text">
              Parrot House adalah toko yang menyediakan beragam jenis burung paruh bengkok. Melalui website ini, pengunjung dapat melihat koleksi, mempelajari informasi dasar setiap burung, dan memahami proses pemesanan dengan lebih mudah.
            </p>
            <p className="mt-5 text-base leading-8 text-muted-text">
              Jika ada informasi yang ingin dipastikan, pelanggan dapat menghubungi Parrot House melalui WhatsApp, Instagram, atau Shopee.
            </p>
            <div className="mt-8 grid gap-3 min-[390px]:flex min-[390px]:flex-wrap">
              <ButtonLink href="/birds" className="w-full min-[390px]:w-auto">Lihat koleksi <ArrowRight size={17} /></ButtonLink>
              <ButtonLink href="/contact" variant="secondary" className="w-full min-[390px]:w-auto"><MessageCircle size={17} /> Hubungi kami</ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
