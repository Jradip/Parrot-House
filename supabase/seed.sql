insert into public.bird_categories (id, name, slug, description, sort_order) values
  ('00000000-0000-4000-8000-000000000001', 'Parkit', 'parkit', 'Koleksi Parkit Lokal dan Parkit Australia.', 1),
  ('00000000-0000-4000-8000-000000000003', 'Lovebird', 'lovebird', 'Pilihan lovebird dengan warna dan karakter yang beragam.', 2),
  ('00000000-0000-4000-8000-000000000004', 'Nuri', 'nuri', 'Koleksi nuri seperti Nuri Ambon dan jenis nuri lainnya.', 3),
  ('00000000-0000-4000-8000-000000000005', 'Conure', 'conure', 'Sun Conure dan ragam Green Cheek Conure dalam satu kategori.', 4),
  ('00000000-0000-4000-8000-000000000009', 'Monk', 'monk', 'Koleksi Monk Parakeet dengan beragam warna.', 5)
on conflict (slug) do update set name = excluded.name, description = excluded.description, sort_order = excluded.sort_order;

insert into public.birds (id, category_id, name, slug, description, age_value, age_unit, gender, color, price, inventory_type, stock, status, tame_status, featured) values
  ('10000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000005', 'Sun Conure', 'sun-conure', 'Data contoh untuk menampilkan informasi burung pada tahap pengembangan lokal.', 8, 'MONTHS', 'MALE', 'Kuning, jingga, hijau', 6750000, 'INDIVIDUAL', 1, 'AVAILABLE', 'Terbiasa dengan interaksi manusia', true),
  ('10000000-0000-4000-8000-000000000002', '00000000-0000-4000-8000-000000000003', 'Lovebird Hijau Peach', 'lovebird-hijau-peach', 'Data contoh untuk menguji katalog, penyaring, dan proses pemesanan lokal.', 6, 'MONTHS', 'FEMALE', 'Hijau dan peach', 850000, 'INDIVIDUAL', 1, 'AVAILABLE', 'Sedang beradaptasi', false),
  ('10000000-0000-4000-8000-000000000003', '00000000-0000-4000-8000-000000000001', 'Parkit Australia', 'parkit-australia', 'Data contoh lokal yang dapat diperbarui oleh admin sesuai informasi burung.', 5, 'MONTHS', 'MALE', 'Abu-abu, kuning, jingga', 475000, 'QUANTITY', 4, 'AVAILABLE', 'Terbiasa dengan tangan', false),
  ('10000000-0000-4000-8000-000000000004', '00000000-0000-4000-8000-000000000005', 'Green Cheek Conure', 'green-cheek-conure', 'Data contoh untuk menguji status pemesanan dan ketersediaan pada tampilan lokal.', 10, 'MONTHS', 'UNKNOWN', 'Hijau, merah marun', 5250000, 'INDIVIDUAL', 1, 'RESERVED', 'Terbiasa dengan interaksi manusia', false)
on conflict (id) do nothing;
