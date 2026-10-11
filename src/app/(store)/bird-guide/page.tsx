import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, Check, HeartHandshake, ShieldCheck, Utensils } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { basicCare, beforeBuyingChecklist, birdGuides, type BirdGuide } from "@/lib/data/bird-guides";

export const metadata: Metadata = {
  title: "Panduan Burung",
  description: "Panduan dasar untuk mengenal karakter, makanan, perawatan, dan proses menjinakkan burung paruh bengkok.",
};

const careIcons = [Utensils, ShieldCheck, HeartHandshake];

export default function BirdGuidePage() {
  return (
    <>
      <PageHero
        eyebrow="Panduan burung"
        title="Kenali kebutuhannya sebelum memilih."
        description="Karakter, kebutuhan, dan perawatan dasar sembilan jenis burung tersusun di sini agar Anda dapat membacanya dengan tenang."
      />

      <section className="py-12 sm:py-14 lg:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.65fr_1.35fr]">
            <div>
              <p className="section-kicker">Perawatan umum</p>
              <h2 className="mt-4 max-w-sm text-balance font-serif text-[2.25rem] font-medium leading-tight sm:text-4xl">Perawatan dimulai dari kebiasaan sehari-hari.</h2>
              <ButtonLink href="/faq" variant="quiet" className="mt-7">Baca informasi perawatan <ArrowRight size={16} /></ButtonLink>
            </div>
            <div className="grid border-t border-line md:grid-cols-3">
              {basicCare.map((item, index) => {
                const Icon = careIcons[index];
                return (
                  <article key={item.title} className="border-b border-line py-7 md:border-r md:px-6 md:first:pl-0 md:last:border-r-0 md:last:pr-0">
                    <Icon className="text-deep-forest" size={23} strokeWidth={1.7} />
                    <h3 className="mt-5 font-serif text-2xl font-medium">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-muted-text">{item.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </Container>
      </section>

      <section id="jenis-burung" className="scroll-mt-24 bg-warm-cream py-12 sm:py-14 lg:py-20">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
            <div>
              <p className="section-kicker">Kenali setiap jenis</p>
              <h2 className="mt-4 max-w-xl font-serif text-[2.25rem] font-medium sm:text-5xl">Kenali setiap jenis.</h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-muted-text">Pilih jenis untuk menuju informasinya. Setiap bagian memuat karakter, fakta singkat, makanan, perawatan, dan cara membangun rasa percaya.</p>
          </div>

          <nav aria-label="Daftar jenis burung" className="mt-9 grid gap-x-10 border-t border-line sm:grid-cols-2 lg:grid-cols-3">
            {birdGuides.map((guide) => (
              <Link key={guide.slug} href={`#${guide.slug}`} className="group flex min-h-16 items-center justify-between gap-4 border-b border-line py-3 text-sm font-semibold text-main-text transition hover:text-deep-forest">
                <span>{guide.name}</span>
                <ArrowDown className="shrink-0 text-deep-forest transition group-hover:translate-y-1" size={16} aria-hidden="true" />
              </Link>
            ))}
          </nav>

          <div className="mt-8">
            {birdGuides.map((guide) => <BirdGuideSection key={guide.slug} guide={guide} />)}
          </div>
        </Container>
      </section>

      <section className="bg-deep-forest py-12 text-off-white sm:py-14 lg:py-20">
        <Container className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="section-kicker !text-soft-green">Sebelum memilih</p>
            <h2 className="mt-5 max-w-lg text-balance font-serif text-[2.25rem] font-medium leading-tight sm:text-4xl">Siapkan rumah dan waktu untuk mereka.</h2>
            <p className="mt-6 max-w-lg text-sm leading-7 text-off-white/70">Burung paruh bengkok dapat hidup bertahun-tahun bahkan puluhan tahun. Pertimbangkan suara, aktivitas, interaksi, ruang, makanan, dan perawatan jangka panjang.</p>
          </div>
          <ul className="grid gap-x-8 border-t border-off-white/20 sm:grid-cols-2">
            {beforeBuyingChecklist.map((item) => (
              <li key={item} className="flex items-start gap-3 border-b border-off-white/20 py-4 text-sm leading-6 text-off-white/85"><Check className="mt-0.5 shrink-0 text-soft-green" size={17} aria-hidden="true" />{item}</li>
            ))}
          </ul>
        </Container>
      </section>

    </>
  );
}

function BirdGuideSection({ guide }: { guide: BirdGuide }) {
  return (
    <article id={guide.slug} className="scroll-mt-24 border-t border-line py-10 sm:py-12 lg:py-16">
      <div className={guide.imageUrl ? "grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16" : "grid gap-8"}>
        <div>
          {guide.imageUrl ? (
            <div className="relative mb-7 aspect-[5/4] overflow-hidden rounded-[var(--radius-md)] bg-soft-background">
              <Image src={guide.imageUrl} alt={guide.name} fill sizes="(max-width: 1024px) 100vw, 38vw" className="object-cover object-[center_30%]" />
            </div>
          ) : null}
          <p className="section-kicker">{guide.categoryType}</p>
          <h3 className="mt-3 max-w-lg text-balance font-serif text-[2.15rem] font-medium leading-tight sm:text-[2.75rem]">{guide.name}</h3>
          {guide.alternativeName ? <p className="mt-2 text-sm font-semibold text-deep-forest">{guide.alternativeName}</p> : null}
          <p className="mt-5 max-w-lg text-sm leading-7 text-muted-text">{guide.summary}</p>
        </div>

        <div className={guide.imageUrl ? "" : "grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14"}>
          <div>
            <dl className="grid gap-x-8 border-t border-line sm:grid-cols-2">
              {guide.facts.map((fact) => <div key={fact.label} className="border-b border-line py-4"><dt className="text-[10px] font-extrabold uppercase tracking-wider text-muted-text">{fact.label}</dt><dd className="mt-1.5 text-sm font-semibold leading-6">{fact.value}</dd></div>)}
            </dl>
            <div className="border-b border-line py-5"><span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-text">Karakter</span><p className="mt-2 font-serif text-xl font-medium text-deep-forest">{guide.personality.join(" · ")}</p></div>
          </div>
          <div>
            <div>
              <GuideInfo title="Makanan" text={guide.diet} />
              <GuideInfo title="Perawatan harian" text={guide.care} />
              <GuideInfo title="Menjinakkan" text={guide.taming} />
            </div>
            <div className="pt-6"><span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-text">Cocok untuk</span><p className="mt-2 text-sm leading-7">{guide.suitableFor}</p></div>
            {guide.importantNote ? <p className="mt-5 border-l-2 border-warm-gold pl-4 text-xs leading-6 text-muted-text"><strong className="text-main-text">Perlu dipahami:</strong> {guide.importantNote}</p> : null}
            {guide.legalNote ? <p className="mt-5 border-l-2 border-warm-gold pl-4 text-xs leading-6 text-muted-text"><strong className="text-main-text">Asal-usul dan ketentuan:</strong> {guide.legalNote}</p> : null}
          </div>
        </div>
      </div>
    </article>
  );
}

function GuideInfo({ title, text }: { title: string; text: string }) {
  return <div className="grid gap-2 border-b border-line py-5 sm:grid-cols-[11rem_1fr] sm:gap-6"><h4 className="font-serif text-xl font-medium">{title}</h4><p className="text-sm leading-7 text-muted-text">{text}</p></div>;
}
