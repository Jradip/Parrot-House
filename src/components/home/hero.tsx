"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Container } from "@/components/ui/container";

export function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="bg-soft-background pt-3 sm:pt-6 lg:pt-8" aria-labelledby="home-heading">
      <Container>
        <div className="relative isolate overflow-hidden rounded-[var(--radius-md)] bg-warm-cream lg:min-h-[36rem]">
          <div className="relative z-10 px-5 pb-8 pt-9 min-[390px]:px-6 sm:px-10 sm:pb-10 sm:pt-14 lg:flex lg:min-h-[36rem] lg:w-[61%] lg:flex-col lg:justify-center lg:px-16 lg:py-20">
            <motion.div initial={reduceMotion ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <p className="section-kicker">Parrot House · Koleksi &amp; panduan</p>
              <h1 id="home-heading" className="mt-4 max-w-2xl text-balance font-serif text-[clamp(2.9rem,13vw,6.25rem)] font-medium leading-[0.96] tracking-[-0.04em] text-main-text sm:mt-5 sm:text-[clamp(3.7rem,8vw,6.25rem)] lg:text-[clamp(4.6rem,6vw,6.25rem)]">
                Pilih dengan <span className="italic text-deep-forest">lebih tenang.</span>
              </h1>
              <p className="mt-5 max-w-md text-[0.95rem] leading-7 text-muted-text sm:mt-6 sm:text-lg sm:leading-8">
                Temukan burung yang sesuai dan kenali kebutuhannya sebelum mengambil keputusan.
              </p>
              <Link
                href="#mulai-dari-sini"
                aria-label="Lihat pilihan koleksi dan panduan"
                className="group mt-7 inline-flex min-h-11 w-fit items-center gap-2 rounded-full border border-deep-forest/25 bg-off-white/70 px-5 py-2.5 text-sm font-bold text-deep-forest transition duration-300 hover:border-deep-forest hover:bg-deep-forest hover:text-off-white sm:mt-8 motion-reduce:transition-none"
              >
                <span>Telusuri</span>
                <ArrowDown className="transition duration-300 group-hover:translate-y-0.5 motion-reduce:transition-none" size={16} aria-hidden="true" />
              </Link>
            </motion.div>
          </div>
          <div className="relative h-[17rem] min-[390px]:h-[19rem] sm:h-[25rem] lg:absolute lg:inset-0 lg:h-auto">
            <Image src="/images/hero-parrot-house.png" alt="Green Cheek Conure bertengger di ruang hijau yang hangat" fill priority sizes="(max-width: 1024px) 100vw, 92vw" className="object-cover object-[72%_center] lg:object-center" />
          </div>
          <div className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-warm-cream from-[28%] via-warm-cream/95 via-[42%] to-transparent to-[72%] lg:block" />
        </div>
      </Container>
    </section>
  );
}
