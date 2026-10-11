import Link from "next/link";
import { Bird } from "lucide-react";

export function Brand({ inverse = false, compact = false }: { inverse?: boolean; compact?: boolean }) {
  return (
    <Link href="/" aria-label="Parrot House, halaman utama" className={`inline-flex items-center ${compact ? "gap-2" : "gap-2.5"}`}>
      <span className={`grid shrink-0 place-items-center rounded-full ${compact ? "size-8" : "size-9 sm:size-10"} ${inverse ? "bg-soft-green text-deep-forest" : "bg-deep-forest text-off-white"}`}>
        <Bird aria-hidden="true" size={compact ? 16 : 20} strokeWidth={1.8} />
      </span>
      <span className={`whitespace-nowrap font-serif font-semibold tracking-tight ${compact ? "text-base" : "text-lg sm:text-xl"} ${inverse ? "text-off-white" : "text-main-text"}`}>Parrot House</span>
    </Link>
  );
}
