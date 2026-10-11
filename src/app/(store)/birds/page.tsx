import type { Metadata } from "next";
import { CatalogExplorer } from "@/components/birds/catalog-explorer";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { getBirds, getCategories } from "@/lib/data/catalog";

export const metadata: Metadata = { title: "Koleksi Burung", description: "Jelajahi koleksi burung Parrot House." };

export const dynamic="force-dynamic";
export default async function BirdsPage() { const [birds,categories]=await Promise.all([getBirds(),getCategories()]); return <><PageHero eyebrow="Koleksi burung" title="Kenali tiap karakter sebelum memilih." description="Gunakan pencarian dan penyaring untuk melihat koleksi berdasarkan kategori, ketersediaan, jenis kelamin, dan rentang harga." /><Container className="py-14 lg:py-20"><CatalogExplorer birds={birds} categories={categories} /><p className="mt-12 text-xs text-muted-text">Data koleksi ini merupakan data contoh untuk pengembangan lokal.</p></Container></>; }
