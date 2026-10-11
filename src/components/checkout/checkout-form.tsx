"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Landmark, LoaderCircle, MessageCircle, QrCode, ShieldCheck, WalletCards } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useCart } from "@/components/cart/cart-provider";
import { Button, ButtonLink } from "@/components/ui/button";
import { FormField, TextAreaField } from "@/components/ui/form-field";
import { formatRupiah } from "@/lib/utils";
import { createWhatsAppUrl } from "@/lib/whatsapp";
import type { Bird } from "@/types/domain";

const formSchema = z.object({
  fullName: z.string().min(2, "Nama wajib diisi."), email: z.string().email("Email tidak valid."), phone: z.string().min(9, "Nomor WhatsApp belum lengkap."),
  receiverName: z.string().min(2, "Nama penerima wajib diisi."), receiverPhone: z.string().min(9, "Nomor penerima belum lengkap."), province: z.string().min(2, "Provinsi wajib diisi."), city: z.string().min(2, "Kota wajib diisi."), district: z.string().min(2, "Kecamatan wajib diisi."), postalCode: z.string().min(4, "Kode pos belum lengkap."), address: z.string().min(8, "Alamat lengkap wajib diisi."),
  shippingZoneId: z.string().uuid("Pilih pengiriman yang tersedia."), notes: z.string().max(500).optional(), paymentMethod: z.enum(["QRIS", "BANK_TRANSFER", "SHOPEEPAY"]),
});
type FormValues = z.infer<typeof formSchema>;
interface ShippingZone { id: string; name: string; province: string; city?: string; shipping_method: string; price: number; notes?: string }

export function CheckoutForm({ birds }: { birds: Bird[] }) {
  const router = useRouter();
  const { items, clear } = useCart();
  const [zones, setZones] = useState<ShippingZone[]>([]); const [setupRequired, setSetupRequired] = useState(false); const [serverError, setServerError] = useState<string>();
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<FormValues>({ resolver: zodResolver(formSchema), defaultValues: { fullName: "", email: "", phone: "", receiverName: "", receiverPhone: "", province: "", city: "", district: "", postalCode: "", address: "", shippingZoneId: "", notes: "", paymentMethod: "QRIS" } });

  useEffect(() => { fetch("/api/shipping-zones").then((response) => response.json()).then((result: { zones?: ShippingZone[]; setupRequired?: boolean }) => { setZones(result.zones ?? []); setSetupRequired(Boolean(result.setupRequired)); }).catch(() => setZones([])); }, []);
  const rows = items.flatMap((item) => { const bird = birds.find((entry) => entry.id === item.birdId); return bird ? [{ bird, quantity: item.quantity }] : []; });
  const shippingZoneId = useWatch({ control, name: "shippingZoneId" });
  const paymentMethod = useWatch({ control, name: "paymentMethod" });
  const selectedZone = zones.find((zone) => zone.id === shippingZoneId);
  const subtotal = useMemo(() => rows.reduce((total, row) => total + row.bird.price * row.quantity, 0), [rows]);
  const shippingWhatsappHref = createWhatsAppUrl("Halo Parrot House, saya ingin menanyakan ketersediaan pengiriman burung ke wilayah saya.");

  const submit = async (values: FormValues) => {
    setServerError(undefined);
    const response = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ items: items.map(({ birdId, quantity }) => ({ birdId, quantity })), shippingZoneId: values.shippingZoneId, customer: { fullName: values.fullName, email: values.email, phone: values.phone }, address: { receiverName: values.receiverName, receiverPhone: values.receiverPhone, province: values.province, city: values.city, district: values.district, postalCode: values.postalCode, address: values.address }, notes: values.notes, paymentMethod: values.paymentMethod }) });
    const result = await response.json() as { error?: string; token?: string; redirectUrl?: string; orderId?: string };
    if (!response.ok || !result.token || !result.orderId) { setServerError(result.error ?? "Pemesanan belum dapat diproses."); return; }
    clear(); const destination = `/account/orders/${result.orderId}`;
    const verifyAndOpenOrder = async () => {
      await fetch(`/api/orders/${result.orderId}/payment`, { method: "POST" }).catch(() => undefined);
      router.push(destination);
      router.refresh();
    };
    if (window.snap) window.snap.pay(result.token, { onSuccess: () => void verifyAndOpenOrder(), onPending: () => void verifyAndOpenOrder(), onError: () => router.push(destination), onClose: () => router.push(destination) });
    else if (result.redirectUrl) window.location.assign(result.redirectUrl);
  };

  if (!rows.length) return <div className="rounded-[var(--radius-md)] bg-warm-cream p-8 text-center"><h2 className="font-serif text-3xl">Keranjang Anda kosong.</h2><ButtonLink href="/birds" className="mt-6">Kembali ke koleksi</ButtonLink></div>;

  return <form onSubmit={handleSubmit(submit)} className="grid gap-8 sm:gap-10 lg:grid-cols-[1fr_23rem] lg:gap-16" noValidate>
    <div className="grid gap-10">
      <FormSection number="01" title="Informasi pelanggan"><div className="grid gap-5 sm:grid-cols-2"><FormField label="Nama lengkap" error={errors.fullName?.message} {...register("fullName")} /><FormField label="Email" type="email" error={errors.email?.message} {...register("email")} /><FormField label="Nomor WhatsApp" className="sm:col-span-2" error={errors.phone?.message} {...register("phone")} /></div></FormSection>
      <FormSection number="02" title="Alamat penerima"><div className="grid gap-5 sm:grid-cols-2"><FormField label="Nama penerima" error={errors.receiverName?.message} {...register("receiverName")} /><FormField label="Nomor penerima" error={errors.receiverPhone?.message} {...register("receiverPhone")} /><FormField label="Provinsi" error={errors.province?.message} {...register("province")} /><FormField label="Kota/Kabupaten" error={errors.city?.message} {...register("city")} /><FormField label="Kecamatan" error={errors.district?.message} {...register("district")} /><FormField label="Kode pos" inputMode="numeric" error={errors.postalCode?.message} {...register("postalCode")} /><TextAreaField label="Alamat lengkap" className="sm:col-span-2" error={errors.address?.message} {...register("address")} /></div></FormSection>
      <FormSection number="03" title="Pengiriman"><label className="grid gap-2 text-sm font-bold">Metode yang tersedia<select className="min-h-12 rounded-lg border border-line bg-off-white px-4" {...register("shippingZoneId")}><option value="">Pilih zona pengiriman</option>{zones.map((zone) => <option key={zone.id} value={zone.id}>{zone.name} · {zone.shipping_method} · {formatRupiah(Number(zone.price))}</option>)}</select>{errors.shippingZoneId ? <span className="text-xs text-danger">{errors.shippingZoneId.message}</span> : null}</label>{!zones.length ? <div className="rounded-lg bg-warm-cream p-5 text-sm leading-6 text-muted-text">{setupRequired ? "Supabase belum dikonfigurasi. Zona pengiriman akan muncul setelah .env.local dan basis data disiapkan." : "Belum ada pengiriman yang mendukung tujuan ini."}<ButtonLink href={shippingWhatsappHref} variant="quiet" className="mt-3"><MessageCircle size={16} /> Hubungi Parrot House untuk memastikan pengiriman</ButtonLink></div> : null}<TextAreaField label="Catatan (opsional)" {...register("notes")} /></FormSection>
      <FormSection number="04" title="Metode pembayaran"><div className="grid gap-3"><label className="flex cursor-pointer items-start gap-4 rounded-[var(--radius-md)] border border-line bg-off-white p-5 has-[:checked]:border-deep-forest has-[:checked]:bg-warm-cream"><input type="radio" value="QRIS" className="mt-1 size-4 accent-deep-forest" {...register("paymentMethod")} /><QrCode className="shrink-0 text-deep-forest" size={25} /><span><strong className="block">QRIS</strong><span className="mt-1 block text-sm leading-6 text-muted-text">Bayar dengan DANA, GoPay, ShopeePay, atau aplikasi perbankan yang mendukung pemindaian QRIS.</span></span></label><label className="flex cursor-pointer items-start gap-4 rounded-[var(--radius-md)] border border-line bg-off-white p-5 has-[:checked]:border-deep-forest has-[:checked]:bg-warm-cream"><input type="radio" value="BANK_TRANSFER" className="mt-1 size-4 accent-deep-forest" {...register("paymentMethod")} /><Landmark className="shrink-0 text-deep-forest" size={25} /><span><strong className="block">Transfer bank</strong><span className="mt-1 block text-sm leading-6 text-muted-text">Midtrans akan menampilkan nomor virtual account bank yang tersedia.</span></span></label><label className="flex cursor-pointer items-start gap-4 rounded-[var(--radius-md)] border border-line bg-off-white p-5 has-[:checked]:border-deep-forest has-[:checked]:bg-warm-cream"><input type="radio" value="SHOPEEPAY" className="mt-1 size-4 accent-deep-forest" {...register("paymentMethod")} /><WalletCards className="shrink-0 text-deep-forest" size={25} /><span><strong className="block">ShopeePay</strong><span className="mt-1 block text-sm leading-6 text-muted-text">Buka ShopeePay melalui aplikasi pada ponsel atau pindai kode pada desktop.</span></span></label></div><div className="mt-3 flex items-center gap-2 text-xs text-muted-text"><ShieldCheck size={15} /> Pembayaran menggunakan Midtrans Sandbox dan tidak memindahkan uang sungguhan.</div></FormSection>
    </div>
    <aside className="h-fit rounded-[var(--radius-md)] bg-warm-cream p-5 sm:p-6 lg:sticky lg:top-28"><h2 className="font-serif text-3xl">Ringkasan pesanan</h2><div className="mt-6 grid gap-4">{rows.map(({ bird, quantity }) => <div key={bird.id} className="flex justify-between gap-4 border-b border-line pb-3 text-sm"><span className="min-w-0"><strong className="block text-balance">{bird.name} × {quantity}</strong><span className="mt-1 block text-xs text-muted-text">Kategori {bird.category}</span></span><strong className="shrink-0">{formatRupiah(bird.price * quantity)}</strong></div>)}</div><div className="mt-5 grid gap-3 text-sm"><div className="flex justify-between gap-4"><span>Jumlah sementara</span><strong>{formatRupiah(subtotal)}</strong></div><div className="flex justify-between gap-4"><span>Pengiriman</span><strong>{selectedZone ? formatRupiah(Number(selectedZone.price)) : "—"}</strong></div><div className="flex justify-between gap-4 border-t border-line pt-4 text-lg"><span>Total</span><strong className="text-right text-deep-forest">{formatRupiah(subtotal + Number(selectedZone?.price ?? 0))}</strong></div></div>{serverError ? <p role="alert" className="mt-5 rounded-lg bg-danger/10 p-3 text-sm leading-6 text-danger">{serverError}</p> : null}<Button type="submit" disabled={isSubmitting || !zones.length} className="mt-6 w-full">{isSubmitting ? <LoaderCircle className="animate-spin" size={17} /> : <WalletCards size={17} />} Lanjutkan pembayaran {paymentMethodLabel[paymentMethod]}</Button><p className="mt-4 text-xs leading-5 text-muted-text">Total akhir dihitung ulang oleh sistem. Status pembayaran hanya berubah melalui pemberitahuan atau pemeriksaan langsung ke Midtrans.</p></aside>
  </form>;
}

function FormSection({ number, title, children }: { number: string; title: string; children: React.ReactNode }) { return <section><div className="mb-5 flex items-center gap-3 sm:mb-6 sm:gap-4"><span className="text-xs font-bold text-warm-gold">{number}</span><h2 className="font-serif text-[1.7rem] font-semibold leading-tight sm:text-3xl">{title}</h2></div>{children}</section>; }

const paymentMethodLabel = {
  QRIS: "QRIS",
  BANK_TRANSFER: "transfer bank",
  SHOPEEPAY: "ShopeePay",
} as const;
