import { ArrowLeft } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return <main className="grid min-h-[100svh] place-items-center bg-warm-cream px-4"><div className="max-w-xl text-center"><p className="section-kicker">404 · Belum ditemukan</p><h1 className="mt-5 text-balance font-serif text-[2.7rem] font-medium leading-[1.05] tracking-tight sm:text-6xl">Sepertinya burungnya terbang ke halaman lain.</h1><p className="mt-5 leading-7 text-muted-text">Alamat yang Anda buka tidak tersedia atau sudah dipindahkan.</p><ButtonLink href="/" className="mt-8"><ArrowLeft size={17} /> Kembali ke beranda</ButtonLink></div></main>;
}
