import Link from "next/link";
import { ArrowRight, Clock3, Package, ShoppingBag, Truck } from "lucide-react";
import { requireUser } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";
import { getOrderStatusLabel, getPaymentStatusLabel, getShippingStatusLabel } from "@/lib/status-labels";
import { formatRupiah } from "@/lib/utils";

export default async function AccountPage() {
  const user = await requireUser();
  const supabase = await createClient();
  const [{ data: profile }, { count: total }, { count: waiting }, { count: shipped }, { data: latestOrder }] = await Promise.all([
    supabase.from("profiles").select("full_name,email").eq("id", user.id).single(),
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("order_status", "WAITING_PAYMENT"),
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("shipping_status", "SHIPPED"),
    supabase.from("orders").select("id,order_number,total,payment_status,order_status,shipping_status,created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
  ]);

  return (
    <div>
      <h2 className="font-serif text-4xl font-medium">Halo, {profile?.full_name || "Sahabat Parrot House"}.</h2>
      <p className="mt-3 text-muted-text">Pantau riwayat pesanan dan kelola informasi akun Anda di sini.</p>

      <div className="mt-9 grid gap-px overflow-hidden rounded-[var(--radius-md)] bg-line sm:grid-cols-3">
        <Summary icon={Package} label="Total pesanan" value={String(total ?? 0)} />
        <Summary icon={Clock3} label="Menunggu pembayaran" value={String(waiting ?? 0)} />
        <Summary icon={Truck} label="Sedang dikirim" value={String(shipped ?? 0)} />
      </div>

      {latestOrder ? (
        <section className="mt-8 border-y border-line py-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="section-kicker">Pesanan terbaru</p>
              <h2 className="mt-2 font-serif text-3xl">{latestOrder.order_number}</h2>
              <p className="mt-2 text-sm text-muted-text">{new Intl.DateTimeFormat("id-ID", { dateStyle: "long" }).format(new Date(latestOrder.created_at))}</p>
            </div>
            <strong className="text-lg text-deep-forest">{formatRupiah(Number(latestOrder.total))}</strong>
          </div>
          <div className="mt-6 grid gap-4 bg-warm-cream p-5 text-sm sm:grid-cols-3">
            <LatestStatus label="Pembayaran" value={getPaymentStatusLabel(latestOrder.payment_status)} />
            <LatestStatus label="Pesanan" value={getOrderStatusLabel(latestOrder.order_status)} />
            <LatestStatus label="Pengiriman" value={getShippingStatusLabel(latestOrder.shipping_status)} />
          </div>
          <Link href={`/account/orders/${latestOrder.id}`} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-deep-forest hover:underline">
            Lihat detail pesanan <ArrowRight size={16} />
          </Link>
        </section>
      ) : (
        <section className="mt-8 flex flex-col gap-5 border-y border-line py-7 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <ShoppingBag className="mt-1 shrink-0 text-deep-forest" size={22} />
            <div><h2 className="font-serif text-2xl font-semibold">Belum ada pesanan aktif.</h2><p className="mt-2 text-sm text-muted-text">Pesanan terbaru dan status pengirimannya akan tampil di bagian ini.</p></div>
          </div>
          <Link href="/birds" className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-deep-forest hover:underline">Lihat koleksi <ArrowRight size={16} /></Link>
        </section>
      )}
    </div>
  );
}

function Summary({ icon: Icon, label, value }: { icon: typeof Package; label: string; value: string }) {
  return <div className="bg-warm-cream p-6"><Icon className="text-deep-forest" size={20} /><p className="mt-8 text-xs font-bold uppercase tracking-wider text-muted-text">{label}</p><p className="mt-2 font-serif text-3xl font-semibold">{value}</p></div>;
}

function LatestStatus({ label, value }: { label: string; value: string }) {
  return <div><p className="text-xs font-bold uppercase tracking-wider text-muted-text">{label}</p><p className="mt-1 font-semibold">{value}</p></div>;
}
