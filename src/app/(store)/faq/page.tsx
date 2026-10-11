import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { birdGuideFaqs, healthWarningSigns } from "@/lib/data/bird-guides";

export const metadata: Metadata = { title: "Pertanyaan Umum" };
const storeFaqs = [
  ["Apakah katalog dapat dilihat tanpa masuk ke akun?", "Ya. Anda dapat melihat katalog, detail burung, dan informasi toko tanpa membuat akun."],
  ["Kapan saya perlu masuk ke akun?", "Anda perlu masuk saat menambahkan burung ke keranjang, melanjutkan pemesanan, melakukan pembayaran, atau melihat riwayat pesanan."],
  ["Bagaimana status ketersediaan bekerja?", "Tersedia berarti burung dapat ditambahkan ke keranjang oleh pengguna yang sudah masuk. Status dipesan, terjual, atau tidak tersedia akan menonaktifkan pembelian."],
  ["Apakah pengiriman tersedia ke semua daerah?", "Belum tentu. Pengiriman burung hidup memerlukan pengecekan wilayah dan metode. Hubungi Parrot House jika tujuan Anda belum tersedia."],
  ["Apakah pembayaran dipastikan melalui WhatsApp?", "Tidak. WhatsApp hanya untuk komunikasi. Status pembayaran berasal dari verifikasi server melalui Midtrans."],
] as const;

export default function FAQPage() {
  return (
    <>
      <PageHero eyebrow="Pertanyaan umum" title="Jawaban ringkas untuk merawat dan memesan dengan tenang." description="Temukan jawaban dasar mengenai makanan, proses menjinakkan, pemesanan, pembayaran, dan pengiriman." />
      <Container className="max-w-4xl py-14 lg:py-20">
        <FaqGroup title="Perawatan burung" items={birdGuideFaqs} />
        <section className="mt-14 bg-warm-cream p-6 sm:p-8">
          <p className="section-kicker">Perhatikan perubahan</p>
          <h2 className="mt-3 font-serif text-3xl font-semibold">Tanda burung perlu diperiksa</h2>
          <ul className="mt-6 grid gap-3 text-sm leading-6 text-muted-text sm:grid-cols-2">{healthWarningSigns.map((item) => <li key={item} className="border-t border-line pt-3">{item}</li>)}</ul>
          <p className="mt-6 text-xs leading-6 text-muted-text">Jika terdapat perubahan yang mengkhawatirkan, hubungi dokter hewan yang berpengalaman menangani burung.</p>
        </section>
        <FaqGroup title="Pemesanan dan pengiriman" items={storeFaqs} className="mt-14" />
      </Container>
    </>
  );
}

function FaqGroup({ title, items, className = "" }: { title: string; items: ReadonlyArray<readonly [string, string]>; className?: string }) {
  return <section className={className}><p className="section-kicker">{title}</p><div className="mt-5 border-t border-line">{items.map(([question, answer]) => <details key={question} className="group border-b border-line py-2"><summary className="cursor-pointer list-none py-6 font-serif text-2xl font-semibold marker:hidden">{question}<span className="float-right font-sans text-lg text-deep-forest transition group-open:rotate-45">+</span></summary><p className="max-w-2xl pb-7 leading-8 text-muted-text">{answer}</p></details>)}</div></section>;
}
