import { Container } from "@/components/ui/container";

export function PageHero({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <section className="border-b border-line bg-warm-cream py-10 sm:py-14 lg:py-20">
      <Container>
        <p className="section-kicker flex items-center gap-3"><span className="h-px w-7 bg-warm-gold" aria-hidden="true" />{eyebrow}</p>
        <div className="mt-5 grid gap-4 sm:mt-6 sm:gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
          <h1 className="max-w-3xl text-balance font-serif text-[clamp(2.35rem,11vw,4.75rem)] font-medium leading-[1.04] tracking-[-0.03em] sm:text-[clamp(3.2rem,7vw,4.75rem)]">{title}</h1>
          <p className="max-w-lg text-[0.95rem] leading-7 text-muted-text sm:text-base sm:leading-8 lg:pb-1">{description}</p>
        </div>
      </Container>
    </section>
  );
}
