import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, PackageCheck, Search, ShoppingBag } from "lucide-react";
import { Hero } from "@/components/home/hero";
import { Container } from "@/components/ui/container";

const orderSteps = [
  { icon: Search, title: "Temukan burung", text: "Jelajahi koleksi dan lihat informasi setiap burung dengan jelas." },
  { icon: ShoppingBag, title: "Buat pesanan", text: "Masuk ke akun, pilih burung, lalu lengkapi alamat pengiriman." },
  { icon: PackageCheck, title: "Pantau pengiriman", text: "Lihat perkembangan pembayaran dan pengiriman di akun Anda." },
] as const;

export default function HomePage() {
  return (
    <>
      <Hero />

      <section id="mulai-dari-sini" className="scroll-mt-20 py-12 sm:scroll-mt-24 sm:py-16 lg:py-20" aria-labelledby="explore-heading">
        <Container>
          <div className="mb-8 flex flex-col gap-5 border-b border-line pb-8 md:mb-10 md:flex-row md:items-end md:justify-between md:gap-12">
            <div>
              <p className="section-kicker">Mulai dari sini</p>
              <h2 id="explore-heading" className="mt-3 max-w-xl text-balance font-serif text-[2.25rem] font-medium leading-tight sm:text-5xl">Jelajahi dengan cara Anda.</h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-muted-text sm:text-base">Lihat pilihan burung yang tersedia atau kenali kebutuhan mereka lebih dulu.</p>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1.22fr_0.78fr] lg:gap-6">
            <Link href="/birds" className="group relative isolate flex min-h-[19rem] flex-col justify-end overflow-hidden rounded-[var(--radius-md)] bg-deep-forest p-5 text-off-white min-[390px]:p-6 sm:min-h-[26rem] sm:p-10 lg:min-h-[28rem]" aria-label="Buka koleksi burung">
              <Image src="/images/sun-conure.png" alt="Sun Conure bertengger dengan bulu kuning dan jingga" fill sizes="(max-width: 1024px) 100vw, 58vw" className="-z-20 object-cover object-[center_10%] transition duration-700 group-hover:scale-[1.035] motion-reduce:transition-none" />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-strong/90 via-forest-strong/15 to-transparent" />
              <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-off-white/85">Koleksi burung</p>
                  <h3 className="mt-3 max-w-md text-balance font-serif text-[2rem] font-medium leading-[1.08] min-[390px]:text-4xl sm:text-5xl">Temukan yang tepat untuk Anda.</h3>
                  <p className="mt-4 max-w-sm text-sm leading-7 text-off-white/90">Pilih berdasarkan jenis dan lihat ketersediaannya.</p>
                </div>
                <span className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-off-white px-5 py-2.5 text-sm font-bold text-deep-forest shadow-sm transition group-hover:-translate-y-0.5 group-hover:bg-warm-cream motion-reduce:transition-none">
                  Lihat koleksi
                  <ArrowRight className="transition group-hover:translate-x-1 motion-reduce:transition-none" size={17} aria-hidden="true" />
                </span>
              </div>
            </Link>

            <Link href="/bird-guide" className="group flex min-h-[19rem] flex-col overflow-hidden rounded-[var(--radius-md)] bg-deep-forest text-off-white sm:min-h-[26rem] lg:min-h-[28rem]" aria-label="Buka panduan burung">
              <div className="flex flex-1 flex-col justify-between gap-8 p-5 min-[390px]:p-6 sm:gap-10 sm:p-10">
                <BookOpen size={27} strokeWidth={1.35} aria-hidden="true" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-soft-green">Panduan burung</p>
                  <h3 className="mt-3 max-w-sm text-balance font-serif text-[2rem] font-medium leading-[1.08] min-[390px]:text-4xl sm:text-5xl">Kenali sebelum memilih.</h3>
                  <p className="mt-5 max-w-xs text-sm leading-7 text-off-white/80">Pahami karakter, perawatan, dan kebutuhan dasar setiap jenis burung.</p>
                </div>
              </div>
              <div className="flex items-center justify-between gap-5 border-t border-off-white/20 px-5 py-4 text-[10px] font-bold uppercase tracking-[0.1em] text-off-white/80 min-[390px]:px-6 sm:px-10 sm:py-6 sm:text-xs sm:tracking-[0.12em]">
                <span>Pelajari panduan lengkap</span>
                <ArrowRight className="shrink-0 text-off-white transition group-hover:translate-x-1 motion-reduce:transition-none" size={21} strokeWidth={1.5} aria-hidden="true" />
              </div>
            </Link>
          </div>
        </Container>
      </section>

      <section className="border-t border-line bg-warm-cream py-12 sm:py-16 lg:py-20" aria-labelledby="steps-heading">
        <Container className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
          <div>
            <p className="section-kicker">Cara memesan</p>
            <h2 id="steps-heading" className="mt-3 max-w-md text-balance font-serif text-[2.25rem] font-medium leading-tight sm:text-5xl">Dari pilihan hingga pengiriman.</h2>
            <Link href="/how-to-order" className="group mt-7 inline-flex min-h-11 items-center gap-2 border-b border-deep-forest pb-1 text-sm font-bold text-deep-forest">
              Pelajari cara memesan <ArrowRight size={17} className="transition group-hover:translate-x-1 motion-reduce:transition-none" aria-hidden="true" />
            </Link>
          </div>
          <div className="border-t border-line">
            {orderSteps.map(({ icon: Icon, title, text }) => (
              <div key={title} className="grid grid-cols-[2rem_1fr] gap-5 border-b border-line py-6 sm:grid-cols-[2.5rem_1fr] sm:gap-7">
                <Icon className="mt-1 text-deep-forest" size={22} strokeWidth={1.5} aria-hidden="true" />
                <div className="grid gap-1 sm:grid-cols-[minmax(10rem,0.7fr)_1fr] sm:gap-8">
                  <h3 className="font-serif text-2xl font-medium">{title}</h3>
                  <p className="max-w-sm text-sm leading-7 text-muted-text">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
