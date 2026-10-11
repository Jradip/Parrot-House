<div align="center">

# Parrot House

### Ruang digital untuk mengenal, memilih, dan memesan burung paruh bengkok dengan lebih tenang.

Website e-commerce lokal dengan tampilan hangat dan editorial, katalog yang mudah dijelajahi, pembayaran Midtrans Sandbox, serta dashboard khusus pelanggan dan admin.

![Beranda Parrot House](./public/images/hero-parrot-house.png)

![Next.js](https://img.shields.io/badge/Next.js-16.3.5-243229?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5-315C45?style=flat-square)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-A8C686?style=flat-square&labelColor=315C45)
![Midtrans](https://img.shields.io/badge/Midtrans-Sandbox-C99A5B?style=flat-square)

</div>

> **Status proyek:** pengembangan lokal. Repository ini belum dikonfigurasi untuk deployment atau Midtrans Production.

## Tentang Parrot House

Parrot House dibuat untuk menyatukan hal-hal yang biasanya tersebar di banyak percakapan: koleksi burung, harga, ketersediaan, panduan perawatan, pemesanan, pembayaran, sampai status pengiriman.

Pengunjung dapat melihat-lihat tanpa akun. Login baru dibutuhkan ketika pelanggan ingin menambahkan burung ke keranjang, melanjutkan checkout, atau membuka informasi pribadi dan riwayat pesanan.

Alur pengalaman utamanya sederhana:

```text
Jelajahi → Pelajari → Percaya → Pesan
```

## Yang sudah tersedia

### Untuk pengunjung dan pelanggan

- Beranda responsif dengan gaya natural, hangat, dan editorial.
- Katalog berdasarkan kategori burung, lengkap dengan pencarian, penyaring, dan pengurutan.
- Detail burung berisi harga, ketersediaan, usia, jenis kelamin, warna, dan karakter.
- Panduan jenis burung dan informasi perawatan dasar.
- Registrasi, login, lupa kata sandi, dan reset kata sandi melalui Supabase Auth.
- Keranjang yang dipisahkan berdasarkan sesi akun.
- Checkout dengan validasi harga dan stok dari server.
- Pilihan QRIS, transfer bank, dan ShopeePay melalui Midtrans Snap Sandbox.
- Riwayat pesanan dengan status pembayaran, pemrosesan, dan pengiriman.
- Pengaturan nama, nomor WhatsApp, dan kata sandi.
- Tautan langsung ke WhatsApp, Instagram, dan Shopee.

### Untuk admin

- Dashboard operasional yang terpisah dari halaman pelanggan.
- Pengelolaan burung, foto katalog, harga, stok, dan status ketersediaan.
- Pengelolaan kategori dan perpindahan produk antar kategori.
- Daftar pelanggan dan pengelolaan akun admin.
- Daftar pesanan dengan status pembayaran dari Midtrans.
- Tahapan pemrosesan pesanan: dibayar, diproses, siap dikirim, dikirim, dan selesai.
- Konfirmasi pengiriman yang langsung terlihat pada riwayat pesanan pelanggan.
- Pengaturan zona, metode, dan biaya pengiriman.
- Pengelolaan informasi dasar toko.

## Teknologi

| Bagian | Teknologi |
| --- | --- |
| Framework | Next.js App Router |
| Bahasa | TypeScript |
| UI | React, Tailwind CSS, Motion for React |
| Database | Supabase PostgreSQL |
| Autentikasi | Supabase Auth |
| Penyimpanan gambar | Supabase Storage |
| Keamanan data | Supabase Row Level Security |
| Form dan validasi | React Hook Form, Zod |
| Pembayaran | Midtrans Snap Sandbox |
| Ikon | Lucide React |

## Menjalankan proyek

### Persiapan

Pastikan komputer sudah memiliki:

- Node.js 20.19+, 22.13+, atau 24+;
- npm;
- Docker Desktop yang sedang aktif;
- Supabase CLI, sudah tersedia melalui dependency proyek.

### 1. Pasang dependency

```bash
npm install
```

### 2. Siapkan environment lokal

Salin `.env.example` menjadi `.env.local`.

```powershell
Copy-Item .env.example .env.local
```

Isi variabel berikut dengan kredensial lokal atau Sandbox:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

MIDTRANS_SERVER_KEY=
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=
MIDTRANS_IS_PRODUCTION=false

NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_WHATSAPP_NUMBER=

LOCAL_ADMIN_EMAIL=
LOCAL_ADMIN_PASSWORD=
LOCAL_CUSTOMER_EMAIL=
LOCAL_CUSTOMER_PASSWORD=
```

Jangan memasukkan `.env.local` ke Git. File tersebut sudah tercantum dalam `.gitignore`.

### 3. Jalankan Supabase lokal

```bash
npm run supabase:start
```

Perintah ini menjalankan database lokal, menerapkan migration, dan memasukkan data demo dari seed. Supabase Studio dapat dibuka di [http://127.0.0.1:54323](http://127.0.0.1:54323).

### 4. Buat akun development

Setelah variabel akun lokal diisi, jalankan:

```bash
npm run accounts:local
```

Script akan membuat atau memperbarui satu akun pelanggan dan satu akun admin berdasarkan isi `.env.local`.

### 5. Jalankan website

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

Untuk menghentikan layanan Supabase:

```bash
npm run supabase:stop
```

## Pembayaran Sandbox

Checkout menggunakan **Midtrans Snap Sandbox**. Status pembayaran hanya diperbarui setelah server memeriksa transaksi atau menerima notification webhook dari Midtrans.

Karena website masih berjalan di localhost, pengujian webhook dapat memakai temporary development tunnel:

```text
https://<temporary-development-url>/api/midtrans/notification
```

Tunnel hanya digunakan untuk testing. Jangan menggunakan kredensial Midtrans Production pada tahap ini.

## Struktur proyek

```text
Parrot-House/
├── docs/                 # PRD dan kebutuhan produk
├── public/images/        # Aset gambar development
├── scripts/              # Script akun lokal
├── src/
│   ├── app/              # Halaman, layout, route API
│   ├── components/       # Komponen fitur dan UI
│   ├── lib/              # Auth, Supabase, Midtrans, data, validasi
│   └── types/            # Tipe domain dan deklarasi TypeScript
└── supabase/
    ├── migrations/       # Riwayat perubahan database
    └── seed.sql          # Data awal untuk development
```

Dokumen kebutuhan lengkap tersedia di [`docs/PRD.md`](./docs/PRD.md).

## Pemeriksaan kualitas

Sebelum perubahan dianggap siap, jalankan:

```bash
npm run lint
npm run typecheck
npm run build
```

Layout telah disiapkan untuk lebar layar 375px, 430px, 768px, 1024px, dan 1440px ke atas.

## Catatan data

- Isi katalog awal adalah data demo untuk pengembangan lokal.
- Harga final, stok, dan biaya pengiriman dihitung ulang oleh server.
- Riwayat pesanan menyimpan snapshot produk dan alamat agar tidak berubah ketika data katalog diperbarui.
- Informasi legal, sumber, dan ketentuan pengiriman burung harus diverifikasi oleh pengelola toko sebelum digunakan untuk operasional nyata.

## Arah desain

Parrot House dirancang seperti boutique parrot store digital: hangat, natural, informatif, dan nyaman dijelajahi. Fotografi burung menjadi fokus utama, didukung tipografi Newsreader dan Plus Jakarta Sans, warna hijau hutan, krem hangat, serta animasi yang ringan.

---

<div align="center">
  Dibuat untuk pengalaman memilih burung yang lebih jelas dan tenang.
</div>
