import { z } from "zod";

export const aboutContentSchema = z.object({
  eyebrow: z.string().min(2).max(80),
  title: z.string().min(5).max(160),
  description: z.string().min(10).max(500),
  sectionTitle: z.string().min(3).max(160),
  paragraphs: z.array(z.string().min(10).max(1000)).min(1).max(5),
  highlights: z.array(z.string().min(3).max(240)).max(8),
});

export type AboutContent = z.infer<typeof aboutContentSchema>;

export const defaultAboutContent: AboutContent = {
  eyebrow: "Tentang Parrot House",
  title: "Tempat yang membantu Anda memilih dengan lebih tenang.",
  description: "Parrot House menyatukan katalog, informasi, pemesanan, pembayaran, dan pengiriman dalam satu pengalaman yang tertata.",
  sectionTitle: "Mengapa kami membangun ruang ini",
  paragraphs: [
    "Informasi stok, harga, kondisi burung, pembayaran, dan pengiriman sering tersebar di banyak percakapan. Parrot House menyusunnya menjadi satu sumber yang mudah dijelajahi.",
    "Tujuan kami sederhana: membantu calon pemilik belajar, membangun kepercayaan, lalu mengambil keputusan dengan informasi yang cukup.",
  ],
  highlights: ["Informasi burung yang terarah", "Proses pembelian yang terstruktur", "Komunikasi langsung melalui WhatsApp"],
};
