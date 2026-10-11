import type { Article, Bird, BirdCategory } from "@/types/domain";

export const birdCategories: BirdCategory[] = [
  ["00000000-0000-4000-8000-000000000001", "parkit", "Parkit", "Koleksi Parkit Lokal dan Parkit Australia."],
  ["00000000-0000-4000-8000-000000000003", "lovebird", "Lovebird", "Pilihan lovebird dengan warna dan karakter yang beragam."],
  ["00000000-0000-4000-8000-000000000004", "nuri", "Nuri", "Koleksi nuri seperti Nuri Ambon dan jenis nuri lainnya."],
  ["00000000-0000-4000-8000-000000000005", "conure", "Conure", "Sun Conure dan ragam Green Cheek Conure dalam satu kategori."],
  ["00000000-0000-4000-8000-000000000009", "monk", "Monk", "Koleksi Monk Parakeet dengan beragam warna."],
].map(([id, slug, name, description], index) => ({
  id,
  slug,
  name,
  description,
  active: true,
  sortOrder: index + 1,
}));

export const birds: Bird[] = [
  {
    id: "10000000-0000-4000-8000-000000000001",
    categoryId: "00000000-0000-4000-8000-000000000005",
    category: "Conure",
    name: "Sun Conure",
    slug: "sun-conure",
    imageUrl: "/images/sun-conure.png",
    price: 6750000,
    age: "8 bulan",
    gender: "MALE",
    color: "Kuning, jingga, hijau",
    description: "Data contoh untuk menampilkan informasi burung pada tahap pengembangan lokal.",
    tameStatus: "Terbiasa dengan interaksi manusia",
    inventoryType: "INDIVIDUAL",
    stock: 1,
    status: "AVAILABLE",
    featured: true,
    createdAt: "2026-08-28",
  },
  {
    id: "10000000-0000-4000-8000-000000000002",
    categoryId: "00000000-0000-4000-8000-000000000003",
    category: "Lovebird",
    name: "Lovebird Hijau Peach",
    slug: "lovebird-hijau-peach",
    imageUrl: "/images/lovebird.png",
    price: 850000,
    age: "6 bulan",
    gender: "FEMALE",
    color: "Hijau dan peach",
    description: "Data contoh untuk menguji katalog, penyaring, dan proses pemesanan lokal.",
    tameStatus: "Sedang beradaptasi",
    inventoryType: "INDIVIDUAL",
    stock: 1,
    status: "AVAILABLE",
    featured: false,
    createdAt: "2026-08-20",
  },
  {
    id: "10000000-0000-4000-8000-000000000003",
    categoryId: "00000000-0000-4000-8000-000000000001",
    category: "Parkit",
    name: "Parkit Australia",
    slug: "parkit-australia",
    imageUrl: "/images/parkit-australia.png",
    price: 475000,
    age: "5 bulan",
    gender: "MALE",
    color: "Abu-abu, kuning, jingga",
    description: "Data contoh lokal yang dapat diperbarui oleh admin sesuai informasi burung.",
    tameStatus: "Terbiasa dengan tangan",
    inventoryType: "QUANTITY",
    stock: 4,
    status: "AVAILABLE",
    featured: false,
    createdAt: "2026-08-12",
  },
  {
    id: "10000000-0000-4000-8000-000000000004",
    categoryId: "00000000-0000-4000-8000-000000000005",
    category: "Conure",
    name: "Green Cheek Conure",
    slug: "green-cheek-conure",
    imageUrl: "/images/hero-parrot-house.png",
    price: 5250000,
    age: "10 bulan",
    gender: "UNKNOWN",
    color: "Hijau, merah marun",
    description: "Data contoh untuk menguji status pemesanan dan ketersediaan pada tampilan lokal.",
    tameStatus: "Terbiasa dengan interaksi manusia",
    inventoryType: "INDIVIDUAL",
    stock: 1,
    status: "RESERVED",
    featured: false,
    createdAt: "2026-08-03",
  },
];

export const articles: Article[] = [
  {
    id: "article-1",
    slug: "menyiapkan-rumah-untuk-burung",
    title: "Menyiapkan rumah yang nyaman untuk burung baru",
    excerpt: "Panduan awal untuk menata ruang yang tenang dan membantu proses adaptasi.",
    publishedAt: "2026-08-22",
  },
  {
    id: "article-2",
    slug: "memahami-rutinitas-harian",
    title: "Memahami rutinitas harian sahabat berbulu",
    excerpt: "Hal-hal dasar yang perlu diamati untuk membangun kebiasaan yang konsisten.",
    publishedAt: "2026-08-14",
  },
  {
    id: "article-3",
    slug: "pertanyaan-sebelum-memilih-burung",
    title: "Pertanyaan penting sebelum memilih burung",
    excerpt: "Pertimbangkan waktu, ruang, dan kesiapan keluarga sebelum mengambil keputusan.",
    publishedAt: "2026-08-02",
  },
];

export function getBirdBySlug(slug: string) {
  return birds.find((bird) => bird.slug === slug);
}

export function getArticleBySlug(slug: string) {
  return articles.find((article) => article.slug === slug);
}
