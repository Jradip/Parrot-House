export type BirdGuide = {
  slug: string;
  name: string;
  alternativeName?: string;
  categoryType: "Jenis burung" | "Mutasi warna" | "Kategori dagang" | "Edukasi";
  summary: string;
  imageUrl?: string;
  facts: Array<{ label: string; value: string }>;
  personality: string[];
  diet: string;
  care: string;
  taming: string;
  suitableFor: string;
  importantNote?: string;
  legalNote?: string;
};

export const birdGuides: BirdGuide[] = [
  {
    slug: "parkit-lokal",
    name: "Parkit Lokal",
    alternativeName: "Budgie",
    categoryType: "Kategori dagang",
    summary: "Burung kecil yang aktif, sosial, dan penuh rasa ingin tahu. Parkit senang terbang, memanjat, bermain, dan berkicau.",
    facts: [
      { label: "Ukuran", value: "Kecil" },
      { label: "Tingkat suara", value: "Rendah–sedang" },
      { label: "Usia hidup", value: "Sekitar 7–12 tahun" },
      { label: "Kematangan", value: "Sekitar 6–9 bulan" },
      { label: "Pengalaman", value: "Relatif ramah untuk pemula" },
    ],
    personality: ["Sosial", "Aktif", "Penasaran"],
    diet: "Gunakan pelet untuk burung kecil sebagai dasar makanan. Tambahkan sayuran, sayuran berdaun hijau, sedikit buah, dan biji dalam jumlah terbatas. Millet dapat menjadi hadiah saat latihan.",
    care: "Sediakan ruang bergerak, tenggeran dengan ukuran bervariasi, mainan, bahan aman untuk dikunyah, dan aktivitas mencari makan. Berikan kesempatan terbang atau bermain di luar kandang dalam ruangan yang aman.",
    taming: "Mulai dengan berada di dekat kandang dan berbicara pelan. Setelah burung nyaman, tawarkan millet dari tangan lalu latih naik ke jari atau tenggeran. Jangan mengejar burung dengan tangan.",
    suitableFor: "Pemilik yang mencari burung kecil, ceria, aktif, dan interaktif.",
  },
  {
    slug: "parkit-australia",
    name: "Parkit Australia",
    alternativeName: "Falk / Cockatiel",
    categoryType: "Kategori dagang",
    summary: "Burung berjambul yang ekspresif, sosial, dan dikenal senang bersiul. Posisi jambulnya membantu menunjukkan rasa penasaran, santai, atau waspada.",
    imageUrl: "/images/parkit-australia.png",
    facts: [
      { label: "Ukuran", value: "Sekitar 32 cm termasuk ekor" },
      { label: "Tingkat suara", value: "Sedang" },
      { label: "Usia hidup", value: "Sekitar 10–14 tahun" },
      { label: "Penampilan dewasa", value: "Lebih jelas setelah mabung pertama" },
      { label: "Kematangan", value: "Sekitar tahun pertama" },
    ],
    personality: ["Sosial", "Ekspresif", "Aktif"],
    diet: "Berikan pelet seimbang sebagai makanan utama, ditambah sayuran dan sedikit buah. Biji diberikan terbatas sebagai variasi atau hadiah.",
    care: "Sediakan waktu di luar kandang, tenggeran bervariasi, mainan kunyah, stimulasi mental, dan interaksi rutin.",
    taming: "Dekati perlahan dan perhatikan bahasa tubuhnya. Tawarkan hadiah dari tangan, kemudian latih naik ke jari atau tenggeran. Siulan sederhana juga dapat membangun interaksi positif.",
    suitableFor: "Pemilik yang menyukai burung komunikatif, ekspresif, dan senang bersiul.",
    importantNote: "Panduan ini menggunakan pengertian Parkit Australia sebagai Falk atau Cockatiel, sesuai koleksi Parrot House.",
  },
  {
    slug: "lovebird",
    name: "Lovebird",
    categoryType: "Jenis burung",
    summary: "Burung kecil dengan energi besar. Lovebird aktif, berani, suka memanjat, dan dapat membangun ikatan kuat dengan manusia maupun pasangannya.",
    imageUrl: "/images/lovebird.png",
    facts: [
      { label: "Ukuran", value: "Sekitar 13–16,5 cm" },
      { label: "Tingkat suara", value: "Sedang" },
      { label: "Usia hidup", value: "Sekitar 10–15 tahun" },
      { label: "Kematangan", value: "Sekitar 8–12 bulan" },
      { label: "Karakter", value: "Aktif dan berani" },
    ],
    personality: ["Aktif", "Sosial", "Berani"],
    diet: "Gunakan pelet sebagai makanan utama, ditambah sayuran, sayuran berdaun hijau, dan sedikit buah. Biji diberikan terbatas.",
    care: "Sediakan mainan kunyah, aktivitas mencari makan, tenggeran, ruang bergerak, dan interaksi setiap hari.",
    taming: "Gunakan hadiah dan sesi latihan singkat. Jika burung menjaga kandangnya secara berlebihan, latihan dapat dilakukan di area netral setelah ia dapat keluar dengan aman.",
    suitableFor: "Pemilik yang menyukai burung kecil dengan karakter kuat dan aktif.",
  },
  {
    slug: "nuri-raja-ambon",
    name: "Nuri-raja Ambon",
    alternativeName: "Nuri Ambon",
    categoryType: "Edukasi",
    summary: "Paruh bengkok asli kawasan Maluku dan Indonesia bagian timur dengan kombinasi warna merah, hijau, dan biru yang mencolok.",
    facts: [
      { label: "Ukuran", value: "Sekitar 35 cm" },
      { label: "Berat", value: "Sekitar 145–163 gram" },
      { label: "Kematangan", value: "Sekitar 1 tahun" },
      { label: "Asal", value: "Indonesia bagian timur" },
      { label: "Status panduan", value: "Edukasi dan verifikasi legal" },
    ],
    personality: ["Aktif", "Peka", "Membutuhkan pendekatan bertahap"],
    diet: "Di alam, makanannya meliputi buah, beri, biji, dan kuncup tanaman. Untuk pemeliharaan yang sah, pola makan harus disesuaikan dengan kondisi individu serta saran dokter hewan burung.",
    care: "Utamakan kesejahteraan, ruang yang memadai, aktivitas pengayaan, perawatan dokter hewan, dan asal-usul yang jelas. Burung tidak boleh diambil dari alam.",
    taming: "Gunakan penguatan positif, hadiah kecil, dan latihan naik ke tenggeran secara bertahap. Jangan memaksa kontak dan selalu perhatikan bahasa tubuh burung.",
    suitableFor: "Halaman ini ditujukan untuk edukasi dan kesadaran mengenai tanggung jawab pemeliharaan.",
    legalNote: "Ketersediaan atau perdagangan tidak boleh disimpulkan hanya dari nama jenis. Asal-usul, dokumentasi, perlindungan satwa, serta ketentuan hukum harus diverifikasi terlebih dahulu.",
  },
  {
    slug: "sun-conure",
    name: "Sun Conure",
    categoryType: "Jenis burung",
    summary: "Burung berwarna cerah dengan kepribadian ekspresif. Sun Conure sosial, aktif, suka bermain, dan biasanya sangat menikmati interaksi dengan manusia.",
    imageUrl: "/images/sun-conure.png",
    facts: [
      { label: "Ukuran", value: "Kecil–menengah" },
      { label: "Tingkat suara", value: "Tinggi" },
      { label: "Usia hidup", value: "Sekitar 20–30 tahun" },
      { label: "Kematangan", value: "Sekitar 2 tahun" },
      { label: "Komitmen", value: "Tinggi" },
    ],
    personality: ["Sosial", "Suka bermain", "Ekspresif"],
    diet: "Gunakan pelet sebagai dasar, ditambah sayuran, sayuran berdaun hijau, sedikit buah, serta biji atau kacang sebagai hadiah. Kuaci bukan makanan utama.",
    care: "Sun Conure membutuhkan aktivitas harian, waktu di luar kandang, kesempatan memanjat, mainan kunyah, aktivitas mencari makan, dan interaksi sosial.",
    taming: "Gunakan penguatan positif. Latih naik ke tangan, kembali ke tenggeran, dan mengikuti sasaran sederhana. Berikan perhatian pada perilaku tenang, bukan hanya saat burung berteriak.",
    suitableFor: "Pemilik yang siap menghadapi suara keras, interaksi intensif, dan komitmen jangka panjang.",
  },
  {
    slug: "green-cheek-conure",
    name: "Green Cheek Conure",
    categoryType: "Jenis burung",
    summary: "Conure kecil yang aktif, penasaran, suka bermain, dan dapat dekat dengan manusia jika disosialisasikan dengan baik.",
    imageUrl: "/images/hero-parrot-house.png",
    facts: [
      { label: "Ukuran", value: "Kecil–menengah" },
      { label: "Berat", value: "Umumnya sekitar 55–70 gram" },
      { label: "Tingkat suara", value: "Sedang" },
      { label: "Usia hidup", value: "Sekitar 20–25 tahun" },
      { label: "Kematangan", value: "Sekitar 2 tahun" },
    ],
    personality: ["Suka bermain", "Sosial", "Penasaran"],
    diet: "Berikan pelet sebagai dasar, ditambah sayuran, sayuran berdaun hijau, sedikit buah, dan biji atau kacang sebagai hadiah.",
    care: "Sediakan sarana memanjat, mainan sobek dan kunyah, aktivitas mencari makan, interaksi, serta latihan singkat.",
    taming: "Gunakan hadiah, latihan mengikuti sasaran, dan latihan naik ke tangan. Jangan menghukum gigitan; pelajari apakah paruh digunakan untuk mengeksplorasi atau sebagai respons defensif.",
    suitableFor: "Pemilik yang menginginkan conure berukuran lebih kecil tetapi tetap aktif dan interaktif.",
  },
  {
    slug: "pineapple-green-cheek-conure",
    name: "Pineapple Green Cheek Conure",
    alternativeName: "Pineapple GCC",
    categoryType: "Mutasi warna",
    summary: "Mutasi warna dari Green Cheek Conure. Perbedaan utamanya terletak pada warna bulu, sedangkan kebutuhan dasar perawatannya tetap sama.",
    facts: [
      { label: "Kelompok", value: "Green Cheek Conure" },
      { label: "Tingkat suara", value: "Sedang" },
      { label: "Usia hidup", value: "Sekitar 20–25 tahun" },
      { label: "Kematangan", value: "Sekitar 2 tahun" },
      { label: "Perbedaan utama", value: "Mutasi warna" },
    ],
    personality: ["Aktif", "Suka bermain", "Sosial"],
    diet: "Ikuti pola makan Green Cheek Conure: pelet sebagai dasar, sayuran, sayuran berdaun hijau, sedikit buah, serta biji atau kacang sebagai hadiah.",
    care: "Sediakan mainan kunyah, aktivitas mencari makan, interaksi rutin, serta waktu beraktivitas di luar kandang dalam ruangan aman.",
    taming: "Gunakan penguatan positif, hadiah kecil, dan latihan naik ke tangan secara bertahap.",
    suitableFor: "Pemilik yang siap memenuhi kebutuhan aktif dan sosial Green Cheek Conure.",
    importantNote: "Mutasi Pineapple tidak menentukan tingkat kejinakan. Kepribadian dipengaruhi individu, sosialisasi, pengalaman, dan lingkungan.",
  },
  {
    slug: "turquoise-green-cheek-conure",
    name: "Turquoise Green Cheek Conure",
    alternativeName: "Turquoise GCC",
    categoryType: "Mutasi warna",
    summary: "Mutasi warna dari Green Cheek Conure dengan warna bulu berbeda, tetapi kebutuhan makanan, kesehatan, pengayaan, dan interaksinya tetap sama.",
    facts: [
      { label: "Kelompok", value: "Green Cheek Conure" },
      { label: "Tingkat suara", value: "Sedang" },
      { label: "Usia hidup", value: "Sekitar 20–25 tahun" },
      { label: "Kematangan", value: "Sekitar 2 tahun" },
      { label: "Perbedaan utama", value: "Mutasi warna" },
    ],
    personality: ["Aktif", "Penasaran", "Suka bermain"],
    diet: "Ikuti pola makan Green Cheek Conure: pelet sebagai dasar, sayuran, sayuran berdaun hijau, sedikit buah, serta biji atau kacang sebagai hadiah.",
    care: "Berikan ruang bergerak, mainan kunyah, aktivitas mencari makan, latihan, dan interaksi harian.",
    taming: "Bangun rasa percaya, gunakan hadiah, latih naik ke tangan, lalu lanjutkan dengan latihan sasaran dan kembali ketika dipanggil setelah dasar latihan terbentuk.",
    suitableFor: "Pemilik yang memahami kebutuhan sosial dan aktivitas Green Cheek Conure.",
    importantNote: "Perbedaan warna tidak menjamin karakter tertentu. Setiap burung memiliki pengalaman dan kepribadian yang berbeda.",
  },
  {
    slug: "monk-blue",
    name: "Monk Blue",
    alternativeName: "Blue Quaker",
    categoryType: "Mutasi warna",
    summary: "Burung cerdas dan aktif yang cepat mempelajari rutinitas. Blue merupakan mutasi warna dari Monk Parakeet, bukan jenis yang berbeda.",
    facts: [
      { label: "Ukuran", value: "Sekitar 28–30 cm" },
      { label: "Tingkat suara", value: "Sedang–tinggi" },
      { label: "Usia hidup", value: "Sekitar 20–30 tahun" },
      { label: "Kematangan", value: "Sekitar 1–3 tahun" },
      { label: "Perbedaan Blue", value: "Mutasi warna" },
    ],
    personality: ["Cerdas", "Aktif", "Sosial", "Percaya diri"],
    diet: "Gunakan pelet seimbang sebagai dasar, ditambah sayuran, sayuran berdaun hijau, sedikit buah, serta biji atau kacang dalam jumlah kecil. Hindari pola makan yang terlalu tinggi lemak.",
    care: "Berikan stimulasi mental, aktivitas mencari makan, mainan kunyah, latihan, waktu di luar kandang, dan interaksi sosial.",
    taming: "Jika burung menjaga kandang atau area favoritnya, gunakan area latihan netral atau tenggeran. Bila takut tangan, mulai dengan latihan menggunakan tongkat lalu beralih secara bertahap ke tangan.",
    suitableFor: "Pemilik yang menyukai burung cerdas dan siap memberikan latihan serta pengayaan rutin.",
  },
];

export const basicCare = [
  {
    title: "Makanan seimbang",
    description: "Jangan menjadikan biji sebagai satu-satunya makanan. Gunakan pelet yang sesuai sebagai dasar, lalu lengkapi dengan sayuran segar, sayuran berdaun hijau, dan sedikit buah.",
  },
  {
    title: "Lingkungan aman",
    description: "Jauhkan burung dari asap rokok, aerosol, asap dapur, bahan kimia kuat, serta produk anti-lengket yang terlalu panas. Amankan kipas, pintu, jendela, kabel, dan hewan lain.",
  },
  {
    title: "Bangun rasa percaya",
    description: "Menjinakkan berarti membangun rasa percaya. Gunakan hadiah, latihan singkat, suara tenang, dan berikan waktu bagi burung untuk beradaptasi tanpa dipaksa.",
  },
];

export const beforeBuyingChecklist = [
  "Tingkat suara sesuai dengan lingkungan rumah.",
  "Ada waktu untuk berinteraksi setiap hari.",
  "Tersedia ruang aman untuk aktivitas di luar kandang.",
  "Siap menyediakan makanan yang seimbang.",
  "Siap dengan biaya perawatan dan dokter hewan.",
  "Anggota rumah memahami cara berinteraksi dengan burung.",
  "Legalitas dan asal-usul burung telah diperiksa.",
];

export const healthWarningSigns = [
  "Nafsu makan turun atau berat badan berubah jelas.",
  "Terlalu diam atau sering berada di dasar kandang.",
  "Napas terlihat berat atau ekor bergerak berlebihan saat bernapas.",
  "Perubahan kotoran yang menetap atau muntah yang tidak biasa.",
  "Luka, kehilangan keseimbangan, atau perubahan perilaku mendadak.",
];

export const birdGuideFaqs = [
  ["Apakah burung harus makan biji-bijian setiap hari?", "Biji tidak sebaiknya menjadi satu-satunya makanan. Pola makan perlu disesuaikan dengan jenis burung dan dibuat lebih seimbang."],
  ["Apakah semua burung bisa langsung jinak?", "Tidak. Kecepatan sosialisasi berbeda pada setiap individu. Utamakan rasa percaya dan kenyamanan burung."],
  ["Berapa lama proses menjinakkan?", "Tidak ada waktu pasti. Gunakan latihan singkat dan rutin, lalu kurangi tekanan ketika burung menunjukkan rasa takut."],
  ["Apa yang dilakukan jika burung menggigit?", "Tetap tenang, jangan menghukum, dan perhatikan konteks serta bahasa tubuh untuk memahami penyebabnya."],
  ["Apakah burung perlu keluar kandang?", "Burung peliharaan membutuhkan aktivitas. Waktu di luar kandang dapat diberikan dalam ruangan yang aman dan dengan pengawasan."],
  ["Apakah kuaci boleh diberikan?", "Boleh sebagai hadiah dalam jumlah terbatas untuk jenis yang sesuai, tetapi bukan sebagai makanan utama."],
] as const;

export function getBirdGuide(slug: string) {
  return birdGuides.find((guide) => guide.slug === slug);
}

const guideSlugByProduct: Record<string, string> = {
  "Parkit Lokal": "parkit-lokal",
  "Parkit Australia": "parkit-australia",
  Lovebird: "lovebird",
  "Nuri Ambon": "nuri-raja-ambon",
  "Sun Conure": "sun-conure",
  "Green Cheek Conure": "green-cheek-conure",
  "Pineapple Green Cheek Conure": "pineapple-green-cheek-conure",
  "Turquoise Green Cheek Conure": "turquoise-green-cheek-conure",
  "Monk Blue": "monk-blue",
};

export function getBirdGuideSlug(productName: string) {
  if (guideSlugByProduct[productName]) return guideSlugByProduct[productName];
  if (productName.toLowerCase().startsWith("lovebird")) return "lovebird";
  return undefined;
}
