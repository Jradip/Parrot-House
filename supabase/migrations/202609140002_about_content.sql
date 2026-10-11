insert into public.site_settings (key, value, public)
values (
  'about_page',
  '{"eyebrow":"About Parrot House","title":"Tempat yang membantu Anda memilih dengan lebih tenang.","description":"Parrot House menyatukan katalog, informasi, pemesanan, pembayaran, dan pengiriman dalam satu pengalaman yang tertata.","sectionTitle":"Mengapa kami membangun ruang ini","paragraphs":["Informasi stok, harga, kondisi burung, pembayaran, dan pengiriman sering tersebar di banyak percakapan. Parrot House menyusunnya menjadi satu sumber yang mudah dijelajahi.","Tujuan kami sederhana: membantu calon pemilik belajar, membangun kepercayaan, lalu mengambil keputusan dengan informasi yang cukup."],"highlights":["Informasi burung yang terarah","Proses pembelian yang terstruktur","Komunikasi langsung melalui WhatsApp"]}'::jsonb,
  true
)
on conflict (key) do nothing;
