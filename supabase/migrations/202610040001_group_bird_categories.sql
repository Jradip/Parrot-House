begin;

-- Kategori menyimpan kelompok utama. Nama jenis atau varian burung disimpan
-- pada tabel birds agar beberapa produk dapat berada dalam satu kategori.
insert into public.bird_categories (id, name, slug, description, active, sort_order)
values
  ('00000000-0000-4000-8000-000000000001', 'Parkit', 'parkit', 'Koleksi Parkit Lokal dan Parkit Australia.', true, 1),
  ('00000000-0000-4000-8000-000000000003', 'Lovebird', 'lovebird', 'Pilihan lovebird dengan warna dan karakter yang beragam.', true, 2),
  ('00000000-0000-4000-8000-000000000004', 'Nuri', 'nuri', 'Koleksi nuri seperti Nuri Ambon dan jenis nuri lainnya.', true, 3),
  ('00000000-0000-4000-8000-000000000005', 'Conure', 'conure', 'Sun Conure dan ragam Green Cheek Conure dalam satu kategori.', true, 4),
  ('00000000-0000-4000-8000-000000000009', 'Monk', 'monk', 'Koleksi Monk Parakeet dengan beragam warna.', true, 5)
on conflict (id) do update
set
  name = excluded.name,
  slug = excluded.slug,
  description = excluded.description,
  active = excluded.active,
  sort_order = excluded.sort_order,
  updated_at = now();

-- Satukan kategori lama tanpa mengubah data produk dan riwayat pesanan.
update public.birds
set category_id = '00000000-0000-4000-8000-000000000001'
where category_id = '00000000-0000-4000-8000-000000000002';

update public.birds
set category_id = '00000000-0000-4000-8000-000000000005'
where category_id in (
  '00000000-0000-4000-8000-000000000006',
  '00000000-0000-4000-8000-000000000007',
  '00000000-0000-4000-8000-000000000008'
);

delete from public.bird_categories
where id in (
  '00000000-0000-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000006',
  '00000000-0000-4000-8000-000000000007',
  '00000000-0000-4000-8000-000000000008'
);

-- Ubah nama data demo lama menjadi nama produk yang tampil pada katalog.
update public.birds
set name = 'Sun Conure', slug = 'sun-conure'
where id = '10000000-0000-4000-8000-000000000001' and name = 'Sora';

update public.birds
set name = 'Lovebird Hijau Peach', slug = 'lovebird-hijau-peach'
where id = '10000000-0000-4000-8000-000000000002' and name = 'Mori';

update public.birds
set name = 'Parkit Australia', slug = 'parkit-australia'
where id = '10000000-0000-4000-8000-000000000003' and name = 'Awan';

update public.birds
set name = 'Green Cheek Conure', slug = 'green-cheek-conure'
where id = '10000000-0000-4000-8000-000000000004' and name = 'Rimba';

commit;
