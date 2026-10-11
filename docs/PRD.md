# PRD — Parrot House

## 1. Product Overview

**Product Name:** Parrot House  
**Product Type:** E-Commerce Website  
**Platform:** Responsive Web  
**Development Stage:** Local Development  
**Primary Users:** Visitor, Customer, Admin  
**Primary Market:** Indonesia

Parrot House adalah website penjualan burung paruh bengkok yang dibuat untuk memudahkan calon pembeli dalam melihat koleksi burung, mengetahui informasi setiap burung, mengecek stok, melakukan pemesanan, pembayaran, serta memperoleh informasi mengenai proses pengiriman.

Website dapat dijelajahi tanpa login untuk melihat katalog, detail burung, informasi toko, artikel, FAQ, dan informasi pemesanan. Login baru diwajibkan ketika pengguna ingin checkout, melakukan pembayaran, melihat pesanan, atau menggunakan fitur personal lainnya.

Parrot House juga berfungsi sebagai media informasi resmi toko agar informasi mengenai stok, harga, jenis burung, cara pembelian, pembayaran, dan pengiriman tidak hanya tersebar melalui WhatsApp atau media sosial.

---

## 2. Problem Statement

Penjualan melalui WhatsApp atau media sosial sering membuat informasi mengenai stok, harga, kondisi burung, pembayaran, dan pengiriman tersebar pada beberapa tempat.

Calon pembeli harus berulang kali menghubungi penjual hanya untuk menanyakan:

- burung yang tersedia;
- harga;
- usia;
- jenis kelamin;
- mutasi atau warna;
- informasi burung;
- cara pemesanan;
- metode pembayaran;
- proses pengiriman.

Dari sisi penjual, proses tersebut juga membuat admin harus menjawab pertanyaan yang sama berulang kali.

Parrot House dibuat sebagai satu platform terpusat untuk menggabungkan katalog, informasi, pemesanan, pembayaran, pengiriman, serta pengelolaan produk dan transaksi.

---

## 3. Goals

Parrot House bertujuan untuk:

1. Mempermudah calon pembeli melihat burung yang tersedia.
2. Menampilkan informasi setiap burung secara jelas.
3. Menampilkan stok dan status ketersediaan secara aktual.
4. Mempermudah proses pemesanan.
5. Menyediakan pembayaran online melalui Midtrans.
6. Mempermudah pembeli memantau status pesanan.
7. Menyediakan jalur komunikasi melalui WhatsApp.
8. Mempermudah admin mengelola burung, stok, harga, transaksi, pengiriman, dan konten.
9. Meningkatkan kepercayaan calon pembeli terhadap Parrot House.
10. Memberikan pengalaman website yang menarik, nyaman, dan ringan.

Customer journey utama:

**Explore → Learn → Trust → Purchase**

---

## 4. Target Users

### 4.1 Visitor

Pengunjung yang ingin:

- melihat katalog;
- melihat detail burung;
- melihat harga;
- melihat stok;
- membaca artikel;
- melihat informasi toko;
- melihat informasi pemesanan;
- melihat informasi pengiriman;
- menghubungi Parrot House.

Visitor tidak diwajibkan login.

### 4.2 Customer

Customer dapat:

- register;
- login;
- logout;
- mengelola profil;
- menyimpan alamat;
- memasukkan burung ke cart;
- checkout;
- melakukan pembayaran;
- melihat status pembayaran;
- melihat riwayat pesanan;
- melihat detail pesanan;
- melihat status pengiriman;
- menghubungi Parrot House melalui WhatsApp.

### 4.3 Admin

Admin dapat:

- login ke dashboard;
- menambahkan burung;
- mengedit burung;
- mengatur kategori;
- memperbarui stok;
- memperbarui harga;
- mengunggah foto;
- mengubah status ketersediaan;
- melihat order;
- melihat status pembayaran;
- memproses pesanan;
- mengatur informasi pengiriman;
- mengelola artikel;
- mengelola FAQ;
- mengelola informasi dasar website.

---

## 5. Initial Bird Categories

Kategori menyimpan kelompok utama, sedangkan nama jenis atau varian disimpan sebagai produk burung. Kategori awal Parrot House:

1. Parkit
2. Lovebird
3. Nuri
4. Conure
5. Monk

Contoh pengelompokan produk:

- Parkit: Parkit Lokal dan Parkit Australia;
- Lovebird: Lovebird Hijau Peach dan varian lovebird lainnya;
- Nuri: Nuri Ambon dan Nuri Pelangi;
- Conure: Sun Conure, Green Cheek Conure, Pineapple Green Cheek Conure, dan Turquoise Green Cheek Conure;
- Monk: Monk Blue dan varian Monk Parakeet lainnya.

Nama kategori dan produk harus ditampilkan terpisah pada katalog dan detail produk. Satu kategori dapat memiliki banyak produk, dan admin dapat memindahkan produk ke kategori lain melalui formulir edit produk.

Kategori harus berasal dari database dan tidak boleh di-hard-code di seluruh UI.

Admin harus dapat:

- menambah kategori;
- mengedit kategori;
- mengaktifkan atau menonaktifkan kategori;
- mengatur urutan kategori.

Nama ilmiah atau status legal burung tidak boleh ditebak oleh sistem. Admin bertanggung jawab memastikan informasi dan dokumentasi yang digunakan sesuai ketentuan yang berlaku.

---

## 6. Inventory Model

Parrot House mendukung dua jenis inventory.

### 6.1 Individual Bird

Digunakan ketika satu listing mewakili satu burung tertentu.

Contoh:

- Name: Rio
- Category: Sun Conure
- Gender: Male
- Age: 8 months
- Stock: 1

Status:

- `AVAILABLE`
- `RESERVED`
- `SOLD`
- `UNAVAILABLE`

### 6.2 Quantity Inventory

Digunakan ketika satu listing memiliki stok lebih dari satu.

Contoh:

- Parkit Lokal
- Stock: 8

Field:

- `inventory_type = INDIVIDUAL`
- `inventory_type = QUANTITY`

---

## 7. Bird Information

Setiap listing burung dapat memiliki:

- id;
- category;
- name;
- slug;
- main image;
- gallery;
- price;
- age;
- gender;
- color;
- mutation;
- description;
- personality;
- tame status;
- ring atau identification code;
- inventory type;
- stock;
- availability status;
- featured status;
- legal/source note;
- created date;
- updated date.

Tidak semua field wajib ditampilkan jika data tidak tersedia.

---

## 8. User Stories

### Visitor

Sebagai visitor, saya ingin membuka website tanpa login agar dapat langsung melihat koleksi Parrot House.

Sebagai visitor, saya ingin mencari burung agar dapat menemukan jenis tertentu dengan cepat.

Sebagai visitor, saya ingin melakukan filter agar katalog lebih mudah dijelajahi.

Sebagai visitor, saya ingin membuka detail burung agar dapat melihat usia, gender, harga, karakter, dan ketersediaannya.

Sebagai visitor, saya ingin melihat informasi Parrot House agar lebih percaya terhadap toko.

Sebagai visitor, saya ingin menghubungi toko melalui WhatsApp apabila membutuhkan informasi tambahan.

### Customer

Sebagai customer, saya ingin membuat akun agar dapat melakukan transaksi.

Sebagai customer, saya ingin menambahkan burung ke cart.

Sebagai customer, saya ingin mengetahui total pembayaran sebelum checkout.

Sebagai customer, saya ingin membayar menggunakan Midtrans.

Sebagai customer, saya ingin mengetahui status pembayaran.

Sebagai customer, saya ingin melihat riwayat pesanan.

Sebagai customer, saya ingin melihat status pengiriman.

Sebagai customer, saya ingin dapat menghubungi admin melalui WhatsApp dari halaman pesanan.

### Admin

Sebagai admin, saya ingin menambah burung tanpa mengubah source code.

Sebagai admin, saya ingin memperbarui stok, harga, dan status burung.

Sebagai admin, saya ingin melihat order yang masuk.

Sebagai admin, saya ingin melihat status pembayaran.

Sebagai admin, saya ingin memproses order.

Sebagai admin, saya ingin memasukkan informasi pengiriman.

Sebagai admin, saya ingin mengelola informasi dan konten website.

---

## 9. Functional Requirements

### 9.1 Public Website

Halaman publik:

- Home
- Birds
- Bird Detail
- About
- Journal / Bird Guide
- Article Detail
- FAQ
- How to Order
- Shipping Information
- Contact
- Cart
- Login
- Register
- Forgot Password

### 9.2 Authentication

Menggunakan Supabase Auth.

Fitur:

- Register
- Login
- Logout
- Forgot Password
- Reset Password

Role:

- `CUSTOMER`
- `ADMIN`

### 9.3 Catalog

Katalog harus menyediakan:

- search;
- category filter;
- availability filter;
- gender filter;
- price range;
- sorting.

Sorting:

- Newest
- Price Low to High
- Price High to Low
- Available First

### 9.4 Bird Detail

Detail burung menampilkan:

- gallery;
- name;
- category;
- price;
- availability;
- age;
- gender;
- color;
- mutation;
- description;
- personality;
- tame status;
- additional information.

CTA utama:

**Add to Cart**

CTA sekunder:

**Ask on WhatsApp**

Jika status `SOLD`, `RESERVED`, atau `UNAVAILABLE`, pembelian dinonaktifkan.

### 9.5 Cart

Visitor dapat memasukkan produk ke cart sebelum login.

Cart menampilkan:

- product image;
- name;
- price;
- quantity;
- subtotal;
- remove;
- checkout.

Untuk `INDIVIDUAL`, quantity maksimum 1.

Login wajib ketika checkout.

### 9.6 Checkout

Flow:

**Cart → Login → Customer Information → Address → Shipping → Review Order → Payment**

Data checkout:

- full name;
- email;
- WhatsApp number;
- receiver name;
- receiver phone;
- province;
- city;
- district;
- postal code;
- complete address;
- notes.

### 9.7 Shipping

Karena produk adalah hewan hidup, pengiriman tidak boleh diasumsikan menggunakan mekanisme e-commerce barang biasa.

Pada MVP, shipping dikelola admin melalui database.

Shipping zone dapat memiliki:

- area;
- province;
- city;
- shipping method;
- price;
- availability;
- notes.

Jika destination tidak tersedia:

**Contact Parrot House for shipping availability**

Tampilkan tombol WhatsApp.

### 9.8 Payment

Payment gateway:

**Midtrans Snap Sandbox**

Alur:

1. Customer checkout.
2. Server memvalidasi user.
3. Server mengecek inventory.
4. Server mengambil harga terpercaya dari database.
5. Server menghitung shipping.
6. Server membuat order.
7. Server melakukan reserve inventory jika diperlukan.
8. Server membuat transaksi Midtrans.
9. Frontend menerima Snap token.
10. Midtrans Snap dibuka.
11. Midtrans mengirim notification/webhook.
12. Backend memverifikasi transaksi.
13. Payment dan order diperbarui.
14. Inventory diperbarui.

Status payment:

- `PENDING`
- `PAID`
- `FAILED`
- `EXPIRED`
- `CANCELLED`
- `REFUNDED`

Frontend tidak boleh menentukan sendiri bahwa payment berhasil.

### 9.9 Inventory Reservation

Untuk individual bird:

`AVAILABLE → RESERVED → SOLD`

Jika pembayaran gagal, expired, atau cancelled:

`RESERVED → AVAILABLE`

Tujuannya untuk menghindari satu burung dibeli oleh dua customer secara bersamaan.

### 9.10 Order Status

Order status:

- `WAITING_PAYMENT`
- `PAID`
- `PROCESSING`
- `READY_TO_SHIP`
- `SHIPPED`
- `DELIVERED`
- `COMPLETED`
- `CANCELLED`

Payment status dan fulfillment status harus disimpan terpisah.

### 9.11 WhatsApp

WhatsApp digunakan untuk komunikasi.

Setelah payment terverifikasi, tampilkan:

**Confirm via WhatsApp**

Contoh pesan:

Halo Parrot House,

Saya ingin mengkonfirmasi pesanan saya.

Order ID: {orderNumber}  
Nama: {customerName}  
Total: {formattedTotal}  
Status Pembayaran: Paid

Terima kasih.

WhatsApp tidak digunakan sebagai sumber validasi pembayaran.

---

## 10. Customer Dashboard

Route utama:

`/account`

Menu:

- Overview
- My Orders
- Profile
- Addresses
- Logout

My Orders menampilkan:

- order number;
- date;
- total;
- payment status;
- order status.

Order Detail menampilkan:

- bird information;
- order date;
- payment;
- address;
- shipping;
- order timeline;
- WhatsApp CTA.

---

## 11. Admin Dashboard

Route:

`/admin`

Hanya role `ADMIN`.

Menu:

- Dashboard
- Birds
- Categories
- Orders
- Shipping
- Articles
- Content
- Customers
- Settings

Dashboard summary:

- Available Birds
- Reserved Birds
- Sold Birds
- Total Listings
- New Orders
- Paid Orders
- Processing Orders
- Recent Orders

Admin dashboard mengutamakan fungsi dan keterbacaan dibanding animasi dekoratif.

---

## 12. Admin Bird Management

Admin dapat:

- create;
- view;
- edit;
- archive;
- upload images;
- reorder images;
- select category;
- set inventory type;
- set stock;
- set price;
- set status;
- set featured;
- set age;
- set gender;
- set color;
- set mutation;
- set tame status;
- set ring code;
- set description;
- set legal/source note.

---

## 13. Admin Order Management

Admin dapat:

- melihat seluruh order;
- mencari order;
- filter order;
- membuka detail order;
- melihat customer;
- melihat status payment;
- update order status;
- update shipping information;
- cancel order jika diperlukan.

Payment status dari Midtrans tidak boleh diubah sembarangan secara manual.

---

## 14. Content Management

Admin dapat mengelola:

- hero text;
- about text;
- contact information;
- WhatsApp number;
- social media;
- FAQ;
- How to Order;
- Shipping Information;
- Journal / Articles.

---

## 15. Non-Functional Requirements

### Performance

- Gunakan optimized images.
- Gunakan `next/image`.
- Lazy load media ketika sesuai.
- Batasi client component.
- Gunakan Server Component ketika tepat.
- Hindari dependency yang tidak perlu.
- Animasi utamanya menggunakan `transform` dan `opacity`.
- Website harus tetap terasa ringan.

### Responsive

Target minimum:

- 375px
- 430px
- 768px
- 1024px
- 1440px

Mobile tidak boleh hanya berupa desktop yang diperkecil.

### Accessibility

- semantic HTML;
- proper form label;
- keyboard navigation;
- visible focus;
- alt text;
- accessible dialog/drawer;
- sufficient contrast;
- comfortable touch targets;
- `prefers-reduced-motion`.

### Security

- Supabase RLS;
- server-side authorization;
- admin route protection;
- server-side stock validation;
- server-side price calculation;
- Zod validation;
- secure environment variables;
- Midtrans webhook verification;
- sensitive endpoint protection jika diperlukan.

Jangan expose:

- `SUPABASE_SERVICE_ROLE_KEY`
- `MIDTRANS_SERVER_KEY`

### SEO

- metadata;
- dynamic product metadata;
- Open Graph;
- sitemap;
- robots.txt;
- semantic URL;
- correct heading hierarchy;
- image alt text.

Contoh:

`/birds/rio-sun-conure`

bukan:

`/product?id=1`

---

## 16. Scope — MVP

Termasuk:

- responsive website;
- homepage;
- catalog;
- bird detail;
- search;
- filters;
- authentication;
- cart;
- checkout;
- shipping configuration;
- Midtrans Sandbox;
- customer dashboard;
- order history;
- order detail;
- WhatsApp integration;
- admin dashboard;
- bird CRUD;
- category CRUD;
- order management;
- shipping management;
- article management;
- basic content management;
- Supabase Storage;
- Supabase RLS.

---

## 17. Out of Scope — MVP

Belum dibuat:

- production hosting;
- custom domain;
- mobile native app;
- multi-vendor;
- auction;
- loyalty points;
- membership;
- AI chatbot;
- AI recommendation;
- live chat;
- forum;
- breeding management;
- multi-language;
- advanced accounting;
- automatic courier integration.

Deployment dilakukan setelah aplikasi lokal selesai dan stabil.

---

## 18. Recommended Tech Stack

| Area | Technology |
|---|---|
| Framework | Next.js App Router |
| Language | TypeScript |
| UI | React |
| Styling | Tailwind CSS |
| Animation | Motion for React + CSS |
| Database | Supabase PostgreSQL |
| Authentication | Supabase Auth |
| Storage | Supabase Storage |
| Authorization | Supabase RLS |
| Validation | Zod |
| Forms | React Hook Form |
| Payment | Midtrans Snap Sandbox |
| Icons | Lucide React |
| Communication | WhatsApp Deep Link |
| Development | Localhost |

React Native tidak digunakan karena Parrot House dibuat sebagai website, bukan aplikasi mobile native.

---

## 19. Local Development Requirement

Tahap saat ini hanya untuk development lokal.

Aplikasi harus berjalan melalui:

```bash
npm install
npm run dev
```

Expected URL:

```text
http://localhost:3000
```

Belum dilakukan:

- hosting;
- deployment;
- production Midtrans;
- production callback URL;
- custom domain;
- deployment pipeline.

Gunakan:

- local Next.js server;
- Supabase project;
- Supabase Auth;
- Supabase Storage;
- Midtrans Sandbox.

`.env.local` tidak boleh di-commit.

Contoh `.env.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

MIDTRANS_SERVER_KEY=
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=
MIDTRANS_IS_PRODUCTION=false

NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_WHATSAPP_NUMBER=
```

---

## 20. Local Midtrans Development

Karena Midtrans webhook tidak dapat langsung mengakses `localhost`, implementasi webhook harus disiapkan agar nantinya dapat diuji melalui temporary development tunnel.

Tunnel hanya digunakan untuk testing webhook dan bukan sebagai production hosting.

Flow:

```text
Midtrans Sandbox
        ↓
Temporary Development URL
        ↓
Next.js Webhook Endpoint
        ↓
Supabase
```

Production deployment dilakukan pada fase berikutnya.

---

## 21. Database Structure

### profiles

- id
- full_name
- email
- phone
- role
- avatar_url
- created_at
- updated_at

### bird_categories

- id
- name
- slug
- description
- image_url
- active
- sort_order

### birds

- id
- category_id
- name
- slug
- description
- personality
- age_value
- age_unit
- gender
- color
- mutation
- price
- inventory_type
- stock
- status
- tame_status
- ring_code
- featured
- legal_note
- created_at
- updated_at

### bird_images

- id
- bird_id
- image_url
- alt_text
- sort_order

### addresses

- id
- user_id
- receiver_name
- phone
- province
- city
- district
- postal_code
- address
- notes

### shipping_zones

- id
- name
- province
- city
- shipping_method
- price
- active
- notes

### carts

- id
- user_id
- created_at

### cart_items

- id
- cart_id
- bird_id
- quantity

### orders

- id
- order_number
- user_id
- address_snapshot
- subtotal
- shipping_cost
- total
- payment_status
- order_status
- shipping_status
- midtrans_order_id
- created_at
- updated_at

### order_items

- id
- order_id
- bird_id
- bird_name_snapshot
- category_snapshot
- price_snapshot
- quantity

### payments

- id
- order_id
- provider
- transaction_id
- transaction_status
- payment_type
- gross_amount
- raw_response
- created_at
- updated_at

### shipments

- id
- order_id
- method
- tracking_number
- status
- shipped_at
- delivered_at
- notes

### articles

- id
- title
- slug
- excerpt
- content
- cover_image
- status
- published_at

### faqs

- id
- question
- answer
- active
- sort_order

### site_settings

- id
- key
- value
- updated_at

---

## 22. Data Integrity Rules

- Harga final dihitung oleh server.
- Client tidak boleh menentukan harga transaksi.
- Stok harus dicek ulang ketika checkout.
- Individual bird maksimum quantity 1.
- Perubahan product tidak mengubah order lama.
- Order item menyimpan snapshot nama, kategori, dan harga.
- Shipping address order disimpan sebagai snapshot.
- Payment notification harus idempotent.
- Duplicate webhook tidak boleh menyebabkan double-update.
- Admin dan customer memiliki akses data yang berbeda.
- Customer hanya dapat melihat order miliknya sendiri.

---

## 23. Design Direction

Parrot House harus terasa:

- natural;
- warm;
- premium;
- friendly;
- fresh;
- organic;
- trustworthy;
- modern;
- editorial.

Website tidak boleh terlihat seperti:

- generic SaaS;
- template AI;
- crypto website;
- generic Tailwind starter;
- admin dashboard pada halaman publik;
- glassmorphism-heavy website.

Burung dan photography menjadi fokus visual utama.

---

## 24. Color System

Suggested palette:

```text
Soft Green      #A8C686
Deep Forest     #315C45
Warm Cream      #F5F0E4
Soft Background #FAF8F2
Warm Gold       #C99A5B
Main Text       #243229
Muted Text      #70786F
```

Gunakan sebagai arah awal dan sesuaikan untuk accessibility.

Hindari:

- neon green;
- terlalu banyak gradient;
- pure white pada seluruh website;
- warna terlalu dingin.

---

## 25. Typography

Recommended:

**Heading:** Newsreader  
**Body / UI:** Plus Jakarta Sans

Gunakan typography dengan hierarchy yang kuat tetapi tidak berlebihan.

Hindari tampilan seperti AI landing page dengan extra-bold sans-serif pada semua section.

---

## 26. Icons

Gunakan:

**Lucide React**

Jangan gunakan emoji sebagai icon interface.

Jangan menaruh seluruh icon di dalam rounded square atau circle secara berulang.

---

## 27. Animation Direction

Website harus terasa hidup tetapi tetap ringan.

Gunakan Motion for React untuk:

- hero reveal;
- staggered text;
- scroll reveal;
- mobile menu;
- filter drawer;
- cart drawer;
- gallery transition;
- meaningful microinteraction.

Gunakan CSS untuk:

- button hover;
- simple transition;
- basic image hover.

Rules:

- tidak semua elemen harus bergerak;
- hindari continuous animation yang tidak penting;
- hindari parallax ekstrem;
- gunakan transform dan opacity;
- respect `prefers-reduced-motion`.

---

## 28. UI Design Rules

Jangan:

- membuat setiap section menjadi card;
- menggunakan rounded-3xl di seluruh website;
- menggunakan gradient secara berlebihan;
- membuat semua heading center;
- menggunakan fake testimonial;
- menggunakan fake statistic;
- menggunakan emoji sebagai icon;
- membuat desain seperti template SaaS;
- membuat terlalu banyak badge;
- menggunakan glassmorphism berlebihan.

Gunakan:

- whitespace;
- editorial composition;
- asymmetric layout;
- strong photography;
- varied image proportions;
- natural copy;
- consistent spacing;
- subtle motion;
- clear hierarchy.

---

## 29. Homepage Structure

### Navbar

- Logo
- Home
- Birds
- About
- Journal
- FAQ
- Contact
- Search
- Cart
- Account

Sticky navbar.

### Hero

Suggested headline:

**Find Your Feathered Companion.**

Supporting copy:

Temukan koleksi burung paruh bengkok dari Parrot House dengan informasi yang jelas dan proses pembelian yang lebih mudah.

CTA:

**Explore Birds**

Secondary:

**About Parrot House**

Gunakan layout asymmetrical dan photography-led.

### Bird Categories

Tampilkan seluruh kategori utama sebagai image-led navigation.

### Available Birds

Heading:

**Meet Our Birds**

Tampilkan listing yang tersedia.

### Featured Bird

Tampilkan satu burung unggulan dengan layout editorial besar.

### About Preview

Cerita singkat Parrot House.

### Why Parrot House

Tampilkan manfaat dengan layout editorial, bukan card berulang.

### How It Works

01 Discover  
02 Choose  
03 Order  
04 Pay  
05 Delivery

### Journal

Artikel edukasi mengenai perawatan, makanan, karakter, dan persiapan memelihara burung.

### Final CTA

**Ready to Meet Your New Companion?**

CTA:

**Explore Birds**

### Footer

- logo;
- navigation;
- contact;
- WhatsApp;
- social media;
- address;
- copyright.

---

## 30. Recommended Routes

```text
/
 /birds
 /birds/[slug]
 /about
 /journal
 /journal/[slug]
 /faq
 /how-to-order
 /shipping
 /contact
 /cart
 /login
 /register
 /forgot-password
 /checkout
 /payment/result

 /account
 /account/orders
 /account/orders/[id]
 /account/profile
 /account/addresses

 /admin
 /admin/birds
 /admin/birds/new
 /admin/birds/[id]
 /admin/categories
 /admin/orders
 /admin/orders/[id]
 /admin/shipping
 /admin/articles
 /admin/content
 /admin/customers
 /admin/settings
```

---

## 31. Recommended Project Structure

```text
parrot-house/
├── docs/
│   └── PRD.md
├── src/
│   ├── app/
│   │   ├── (store)/
│   │   ├── account/
│   │   ├── admin/
│   │   └── api/
│   ├── components/
│   │   ├── layout/
│   │   ├── home/
│   │   ├── birds/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── account/
│   │   ├── admin/
│   │   └── ui/
│   ├── lib/
│   │   ├── supabase/
│   │   ├── midtrans/
│   │   ├── validation/
│   │   ├── auth/
│   │   └── utils/
│   ├── types/
│   └── config/
├── supabase/
│   ├── migrations/
│   └── seed.sql
├── public/
├── .env.example
├── package.json
└── README.md
```

---

## 32. Development Phases

### Phase 1

Project architecture, dependencies, design tokens, fonts, shared layout.

### Phase 2

Homepage dan public pages.

### Phase 3

Catalog, filter, search, bird detail.

### Phase 4

Supabase schema, storage, auth, RLS.

### Phase 5

Cart dan customer account.

### Phase 6

Checkout dan shipping.

### Phase 7

Midtrans Sandbox dan webhook.

### Phase 8

Customer orders.

### Phase 9

Admin dashboard dan CRUD.

### Phase 10

Animation polish.

### Phase 11

Responsive audit.

### Phase 12

Security, accessibility, SEO, dan performance audit.

Setelah major phase:

- lint;
- typecheck;
- build;
- perbaiki error sebelum lanjut.

---

## 33. Local Completion Criteria

Tahap lokal dianggap selesai jika:

1. `npm run dev` berjalan tanpa error.
2. Website terbuka di `http://localhost:3000`.
3. Public pages dapat digunakan tanpa login.
4. Register dan login berjalan dengan Supabase.
5. Admin access terlindungi berdasarkan role.
6. Bird CRUD berjalan.
7. Category CRUD berjalan.
8. Cart berjalan.
9. Checkout berjalan.
10. Shipping rules berjalan.
11. Midtrans Sandbox transaction creation berjalan.
12. Payment notification endpoint tersedia dan siap diuji dengan tunnel.
13. Order tersimpan dengan benar.
14. Customer dapat melihat order.
15. Admin dapat memproses order.
16. Responsive layout berjalan baik.
17. Tidak ada secret yang terekspos ke browser.
18. Lint lolos.
19. TypeScript check lolos.
20. Build lolos.

Deployment secara eksplisit berada di luar scope tahap ini.

---

## 34. Final Product Vision

Parrot House bukan sekadar katalog produk.

Website harus terasa seperti memasuki boutique parrot store secara digital: hangat, natural, hidup, informatif, profesional, dan menyenangkan untuk dijelajahi.

Photography burung menjadi pusat visual.

Typography, layout, spacing, interaction, dan animation harus mendukung konten tanpa mengambil perhatian dari burung sebagai fokus utama.

Pengalaman akhir yang diinginkan:

**Explore → Learn → Trust → Purchase**
