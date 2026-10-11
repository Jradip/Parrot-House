import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import type { Bird } from "@/types/domain";

const statusLabel = { AVAILABLE: "Tersedia", RESERVED: "Dipesan", SOLD: "Terjual", UNAVAILABLE: "Tidak tersedia" } as const;

export function BirdCard({ bird }: { bird: Bird }) {
  return (
    <article className="group">
      <Link href={`/birds/${bird.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-md)] bg-warm-cream">
          <Image src={bird.imageUrl} alt={bird.name} fill sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 25vw" className="object-cover transition duration-500 group-hover:scale-[1.025]" />
          <span className="absolute left-3 top-3 rounded-full bg-off-white/90 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-deep-forest backdrop-blur">{statusLabel[bird.status]}</span>
        </div>
        <div className="flex items-start justify-between gap-4 pt-4">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-deep-forest">Kategori {bird.category}</p>
            <h3 className="mt-1 font-serif text-2xl font-semibold text-main-text">{bird.name}</h3>
          </div>
          <ArrowUpRight className="mt-1 shrink-0 text-deep-forest transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" size={19} />
        </div>
        <p className="mt-3 font-bold text-deep-forest">{formatRupiah(bird.price)}</p>
      </Link>
    </article>
  );
}
