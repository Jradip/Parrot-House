"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import { BirdCard } from "@/components/birds/bird-card";
import { Button } from "@/components/ui/button";
import type { Bird, BirdCategory, BirdStatus, Gender } from "@/types/domain";

type Sort = "newest" | "price-asc" | "price-desc" | "available";

export function CatalogExplorer({ birds, categories }: { birds: Bird[]; categories: BirdCategory[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [availability, setAvailability] = useState<"all" | BirdStatus>("all");
  const [gender, setGender] = useState<"all" | Gender>("all");
  const [maxPrice, setMaxPrice] = useState(10000000);
  const [sort, setSort] = useState<Sort>("newest");
  const [mobileFilters, setMobileFilters] = useState(false);

  const result = useMemo(() => birds.filter((bird) => {
    const term = query.toLowerCase().trim();
    const searchableText = `${bird.name} ${bird.category} ${bird.description} ${bird.color}`.toLowerCase();
    return (!term || searchableText.includes(term)) &&
      (category === "all" || bird.categoryId === category) &&
      (availability === "all" || bird.status === availability) &&
      (gender === "all" || bird.gender === gender) && bird.price <= maxPrice;
  }).sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    if (sort === "available") return Number(b.status === "AVAILABLE") - Number(a.status === "AVAILABLE");
    return b.createdAt.localeCompare(a.createdAt);
  }), [availability, birds, category, gender, maxPrice, query, sort]);

  const groupedResult = useMemo(() => {
    const groups = categories.flatMap((item) => {
      const categoryBirds = result.filter((bird) => bird.categoryId === item.id);
      return categoryBirds.length ? [{ category: item, birds: categoryBirds }] : [];
    });
    const knownCategoryIds = new Set(categories.map((item) => item.id));
    const uncategorizedBirds = result.filter((bird) => !knownCategoryIds.has(bird.categoryId));

    return uncategorizedBirds.length
      ? [...groups, { category: undefined, birds: uncategorizedBirds }]
      : groups;
  }, [categories, result]);

  const filters = <div className="grid gap-6">
    <Filter label="Kategori"><select value={category} onChange={(event) => setCategory(event.target.value)} className="w-full rounded-lg border border-line bg-off-white px-3 py-3"><option value="all">Semua kategori</option>{categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></Filter>
    <Filter label="Ketersediaan"><select value={availability} onChange={(event) => setAvailability(event.target.value as typeof availability)} className="w-full rounded-lg border border-line bg-off-white px-3 py-3"><option value="all">Semua status</option><option value="AVAILABLE">Tersedia</option><option value="RESERVED">Dipesan</option><option value="SOLD">Terjual</option></select></Filter>
    <Filter label="Jenis kelamin"><select value={gender} onChange={(event) => setGender(event.target.value as typeof gender)} className="w-full rounded-lg border border-line bg-off-white px-3 py-3"><option value="all">Semua jenis kelamin</option><option value="MALE">Jantan</option><option value="FEMALE">Betina</option><option value="UNKNOWN">Belum diketahui</option></select></Filter>
    <Filter label={`Harga maksimal · Rp${new Intl.NumberFormat("id-ID").format(maxPrice)}`}><input type="range" min="500000" max="10000000" step="250000" value={maxPrice} onChange={(event) => setMaxPrice(Number(event.target.value))} className="w-full accent-deep-forest" /></Filter>
    <Button variant="secondary" onClick={() => { setCategory("all"); setAvailability("all"); setGender("all"); setMaxPrice(10000000); }} className="w-full">Atur ulang penyaring</Button>
  </div>;

  return <div>
    <div className="mb-8 flex flex-col gap-3 border-b border-line pb-6 sm:flex-row sm:items-center"><label className="flex-1"><span className="sr-only">Cari burung</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari nama atau kategori burung…" className="min-h-12 w-full rounded-lg border border-line bg-off-white px-4" /></label><select value={sort} onChange={(event) => setSort(event.target.value as Sort)} className="min-h-12 w-full rounded-lg border border-line bg-off-white px-4 text-sm font-semibold sm:w-auto"><option value="newest">Terbaru</option><option value="price-asc">Harga terendah</option><option value="price-desc">Harga tertinggi</option><option value="available">Tersedia lebih dulu</option></select><Button variant="secondary" onClick={() => setMobileFilters(true)} className="w-full sm:w-auto lg:hidden"><SlidersHorizontal size={17} /> Penyaring</Button></div>
    <div className="grid gap-10 lg:grid-cols-[15rem_1fr]"><aside className="hidden lg:block">{filters}</aside><div>{result.length ? <div className="grid gap-16">{groupedResult.map((group) => <section key={group.category?.id ?? "uncategorized"} aria-labelledby={`category-${group.category?.id ?? "uncategorized"}`}><div className="mb-7 border-t border-line pt-6 sm:flex sm:items-end sm:justify-between sm:gap-8"><div><p className="section-kicker">Kategori burung</p><h2 id={`category-${group.category?.id ?? "uncategorized"}`} className="mt-2 font-serif text-4xl font-medium">{group.category?.name ?? "Kategori lainnya"}</h2>{group.category?.description ? <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-text">{group.category.description}</p> : null}</div><p className="mt-3 shrink-0 text-xs font-bold uppercase tracking-wider text-muted-text sm:mt-0">{group.birds.length} produk</p></div><div className="grid gap-x-5 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">{group.birds.map((bird) => <BirdCard key={bird.id} bird={bird} />)}</div></section>)}</div> : <div className="grid min-h-72 place-items-center border-y border-line text-center"><div><p className="font-serif text-3xl">Belum ada burung yang cocok.</p><p className="mt-2 text-sm text-muted-text">Coba ubah kata pencarian atau filter.</p></div></div>}</div></div>
    {mobileFilters ? <div className="fixed inset-0 z-[70] bg-main-text/35 lg:hidden" role="dialog" aria-modal="true" aria-label="Penyaring katalog"><div className="absolute inset-x-0 bottom-0 max-h-[88svh] overflow-y-auto rounded-t-[var(--radius-lg)] bg-soft-background p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] sm:p-6"><div className="mb-7 flex items-center justify-between gap-4 sm:mb-8"><h2 className="font-serif text-[1.75rem] sm:text-3xl">Penyaring koleksi</h2><button onClick={() => setMobileFilters(false)} aria-label="Tutup penyaring" className="grid size-11 shrink-0 place-items-center rounded-full bg-warm-cream"><X size={20} /></button></div>{filters}<Button onClick={() => setMobileFilters(false)} className="mt-4 w-full">Tampilkan {result.length} hasil</Button></div></div> : null}
  </div>;
}

function Filter({ label, children }: { label: string; children: React.ReactNode }) { return <label className="grid gap-2 text-xs font-extrabold uppercase tracking-[0.1em] text-main-text">{label}{children}</label>; }
