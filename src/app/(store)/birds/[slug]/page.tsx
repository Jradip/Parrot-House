import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { BookOpen, MessageCircle } from "lucide-react";
import { AddToCartButton } from "@/components/birds/add-to-cart-button";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { birds } from "@/lib/data/demo";
import { getBirdGuideSlug } from "@/lib/data/bird-guides";
import { getBirdBySlugFromSource } from "@/lib/data/catalog";
import { hasSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { formatRupiah } from "@/lib/utils";
import { createWhatsAppUrl } from "@/lib/whatsapp";

export function generateStaticParams() {
  return birds.map((bird) => ({ slug: bird.slug }));
}

type BirdPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: BirdPageProps): Promise<Metadata> {
  const { slug } = await params;
  const bird = await getBirdBySlugFromSource(slug);

  return bird
    ? { title: bird.name, description: bird.description }
    : {};
}

export default async function BirdDetailPage({ params }: BirdPageProps) {
  const { slug } = await params;
  const bird = await getBirdBySlugFromSource(slug);

  if (!bird) notFound();

  const disabled = bird.status !== "AVAILABLE";
  let canPurchase = false;
  let isAdmin = false;

  if (hasSupabaseEnv) {
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();
    const userId = data?.claims?.sub;
    if (userId) {
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", userId).single();
      isAdmin = profile?.role === "ADMIN";
      canPurchase = !isAdmin;
    }
  }

  const returnPath = `/birds/${bird.slug}`;
  const guideSlug = getBirdGuideSlug(bird.name);
  const loginHref = `/login?next=${encodeURIComponent(returnPath)}&intent=cart${hasSupabaseEnv ? "" : "&reason=setup"}`;
  const genderLabel =
    bird.gender === "MALE"
      ? "Jantan"
      : bird.gender === "FEMALE"
        ? "Betina"
        : "Belum diketahui";
  const information = [
    ["Usia", bird.age],
    ["Kelamin", genderLabel],
    ["Warna", bird.color],
    ["Karakter", bird.tameStatus],
  ];
  const whatsappHref = createWhatsAppUrl(
    `Halo Parrot House, saya ingin bertanya tentang ${bird.name}.`,
  );

  return (
    <Container className="py-6 sm:py-10 lg:py-18">
      <div className="grid gap-8 sm:gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-lg)] bg-warm-cream">
          <Image
            src={bird.imageUrl}
            alt={bird.name}
            fill
            loading="eager"
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover"
          />
        </div>

        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="section-kicker">Kategori {bird.category}</p>
          <h1 className="mt-3 text-balance font-serif text-[2.75rem] font-medium leading-[1.02] tracking-tight sm:mt-4 sm:text-6xl lg:text-7xl">
            {bird.name}
          </h1>
          <p className="mt-5 text-xl font-bold text-deep-forest">
            {formatRupiah(bird.price)}
          </p>
          <span className="mt-5 inline-flex rounded-full bg-warm-cream px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider text-deep-forest">
            {bird.status === "AVAILABLE"
              ? "Tersedia"
              : bird.status === "RESERVED"
                ? "Dipesan"
                : "Tidak tersedia"}
          </span>
          <p className="mt-8 text-base leading-8 text-muted-text">
            {bird.description}
          </p>

          <section className="mt-9 border-y border-line py-6" aria-labelledby="bird-information-title">
            <h2
              id="bird-information-title"
              className="text-xs font-extrabold uppercase tracking-[0.16em] text-deep-forest"
            >
              Informasi burung
            </h2>
            <dl className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2">
              {information.map(([term, value]) => (
                <div key={term} className="border-t border-line pt-4">
                  <dt className="text-[11px] font-bold uppercase tracking-wider text-muted-text">
                    {term}
                  </dt>
                  <dd className="mt-1.5 text-sm font-semibold text-main-text">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <div className="mt-8 flex flex-col gap-3 sm:mt-9 sm:flex-row">
            <AddToCartButton
              birdId={bird.id}
              maxQuantity={bird.inventoryType === "INDIVIDUAL" ? 1 : bird.stock}
              disabled={disabled}
              adminBlocked={isAdmin}
              isAuthenticated={canPurchase}
              loginHref={loginHref}
            />
            <ButtonLink href={whatsappHref} variant="secondary" className="w-full sm:w-auto">
              <MessageCircle size={17} /> Tanya melalui WhatsApp
            </ButtonLink>
          </div>
          {guideSlug ? <ButtonLink href={`/bird-guide#${guideSlug}`} variant="quiet" className="mt-6"><BookOpen size={16} /> Baca panduan {bird.name}</ButtonLink> : null}
          <p className="mt-6 text-xs leading-5 text-muted-text">
            Informasi ini merupakan data contoh untuk pengembangan lokal dan dapat diperbarui oleh admin.
          </p>
        </div>
      </div>
    </Container>
  );
}
