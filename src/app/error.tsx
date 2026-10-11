"use client";

import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <div className="grid min-h-[70vh] place-items-center px-4"><div className="max-w-lg text-center"><p className="section-kicker">Terjadi kendala</p><h1 className="mt-4 text-balance font-serif text-[2.5rem] font-medium leading-tight sm:text-5xl">Halaman belum dapat ditampilkan.</h1><p className="mt-5 leading-7 text-muted-text">Coba muat ulang bagian ini. Jika kendala berlanjut, kembali ke halaman utama.</p><Button onClick={reset} className="mt-7"><RotateCcw size={16} /> Coba lagi</Button></div></div>;
}
