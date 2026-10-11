import Link from "next/link";
import { Banknote, Bird, Clock3, PackageCheck, ShoppingBag } from "lucide-react";
import { AdminHeading } from "@/components/admin/admin-heading";
import { OrderAutoRefresh } from "@/components/admin/order-auto-refresh";
import { createAdminClient } from "@/lib/supabase/admin";
import { getOrderStatusLabel, getPaymentStatusLabel } from "@/lib/status-labels";
import { formatRupiah } from "@/lib/utils";

type OrderSummary = {
  id: string;
  order_number: string;
  total: number;
  payment_status: string;
  order_status: string;
  created_at: string;
};

export default async function AdminPage() {
  const admin = createAdminClient();
  const [available, reserved, sold, orderResult] = await Promise.all([
    admin.from("birds").select("id", { count: "exact", head: true }).eq("status", "AVAILABLE").is("archived_at", null),
    admin.from("birds").select("id", { count: "exact", head: true }).eq("status", "RESERVED"),
    admin.from("birds").select("id", { count: "exact", head: true }).eq("status", "SOLD"),
    admin.from("orders").select("id,order_number,total,payment_status,order_status,created_at").order("created_at", { ascending: false }),
  ]);
  const orders = (orderResult.data ?? []) as OrderSummary[];
  const paidOrders = orders.filter((order) => order.payment_status === "PAID");
  const revenue = paidOrders.reduce((total, order) => total + Number(order.total), 0);
  const waiting = orders.filter((order) => order.order_status === "WAITING_PAYMENT").length;
  const processing = orders.filter((order) => ["PAID", "PROCESSING", "READY_TO_SHIP"].includes(order.order_status)).length;
  const months = monthlySales(paidOrders);
  const maxMonth = Math.max(...months.map((month) => month.total), 1);

  return (
    <>
      <OrderAutoRefresh />
      <AdminHeading title="Ringkasan Penjualan" description="Pantau pembayaran, pesanan, stok, dan perkembangan pengiriman dari satu ruang admin." />
      <div className="grid gap-px overflow-hidden rounded-[var(--radius-md)] bg-line sm:grid-cols-2 xl:grid-cols-4">
        <Metric icon={Banknote} label="Penjualan terverifikasi" value={formatRupiah(revenue)} />
        <Metric icon={ShoppingBag} label="Pesanan dibayar" value={String(paidOrders.length)} />
        <Metric icon={Clock3} label="Menunggu pembayaran" value={String(waiting)} />
        <Metric icon={PackageCheck} label="Perlu diproses" value={String(processing)} />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-[var(--radius-md)] bg-off-white p-6">
          <div className="flex items-end justify-between gap-4"><div><p className="section-kicker">Laporan penjualan</p><h2 className="mt-2 font-serif text-3xl">Enam bulan terakhir</h2></div><strong className="text-deep-forest">{formatRupiah(revenue)}</strong></div>
          <div className="mt-8 grid h-56 grid-cols-6 items-end gap-3 border-b border-line px-1">
            {months.map((month) => <div key={month.key} className="flex h-full flex-col justify-end gap-2 text-center"><span className="text-[10px] font-bold text-muted-text">{month.total ? formatCompact(month.total) : "0"}</span><div className="min-h-1 rounded-t bg-deep-forest" style={{ height: `${Math.max(3, (month.total / maxMonth) * 100)}%` }} /><span className="pb-2 text-[10px] font-bold uppercase text-muted-text">{month.label}</span></div>)}
          </div>
          <p className="mt-4 text-xs leading-5 text-muted-text">Laporan hanya menghitung pesanan dengan pembayaran yang sudah diperiksa oleh Midtrans.</p>
        </section>

        <section className="rounded-[var(--radius-md)] bg-warm-cream p-6">
          <p className="section-kicker">Stok burung</p><h2 className="mt-2 font-serif text-3xl">Status koleksi</h2>
          <div className="mt-7 grid gap-3"><InventoryRow icon={Bird} label="Tersedia" value={available.count ?? 0} /><InventoryRow icon={Clock3} label="Dipesan" value={reserved.count ?? 0} /><InventoryRow icon={PackageCheck} label="Terjual" value={sold.count ?? 0} /></div>
          <Link href="/admin/birds" className="mt-6 inline-flex text-sm font-bold text-deep-forest">Kelola stok →</Link>
        </section>
      </div>

      <section className="mt-8 overflow-hidden rounded-[var(--radius-md)] border border-line bg-off-white">
        <div className="flex items-center justify-between gap-4 p-6"><div><p className="section-kicker">Aktivitas terbaru</p><h2 className="mt-2 font-serif text-3xl">Pesanan terbaru</h2></div><Link href="/admin/orders" className="text-sm font-bold text-deep-forest">Lihat semua</Link></div>
        {orders.length ? <div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left text-sm"><thead className="bg-warm-cream text-xs uppercase tracking-wider text-muted-text"><tr><th className="p-4">Pesanan</th><th>Tanggal</th><th>Total</th><th>Pembayaran</th><th>Pemrosesan</th></tr></thead><tbody>{orders.slice(0, 6).map((order) => <tr key={order.id} className="border-t border-line"><td className="p-4"><Link href={`/admin/orders/${order.id}`} className="font-bold text-deep-forest">{order.order_number}</Link></td><td>{new Intl.DateTimeFormat("id-ID").format(new Date(order.created_at))}</td><td>{formatRupiah(Number(order.total))}</td><td>{getPaymentStatusLabel(order.payment_status)}</td><td>{getOrderStatusLabel(order.order_status)}</td></tr>)}</tbody></table></div> : <p className="border-t border-line p-8 text-sm text-muted-text">Belum ada pesanan. Pesanan pelanggan akan muncul di sini.</p>}
      </section>
    </>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof Bird; label: string; value: string }) { return <div className="bg-off-white p-6"><Icon className="text-deep-forest" size={20} /><p className="mt-8 text-xs font-bold uppercase tracking-wider text-muted-text">{label}</p><p className="mt-2 font-serif text-3xl font-semibold">{value}</p></div>; }
function InventoryRow({ icon: Icon, label, value }: { icon: typeof Bird; label: string; value: number }) { return <div className="flex items-center justify-between border-b border-line pb-3"><span className="inline-flex items-center gap-2 text-sm text-muted-text"><Icon size={16} />{label}</span><strong>{value}</strong></div>; }
function formatCompact(value: number) { return new Intl.NumberFormat("id-ID", { notation: "compact", maximumFractionDigits: 1 }).format(value); }
function monthlySales(orders: OrderSummary[]) { const now = new Date(); return Array.from({ length: 6 }, (_, index) => { const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1); const key = `${date.getFullYear()}-${date.getMonth()}`; const total = orders.filter((order) => { const created = new Date(order.created_at); return created.getFullYear() === date.getFullYear() && created.getMonth() === date.getMonth(); }).reduce((sum, order) => sum + Number(order.total), 0); return { key, label: new Intl.DateTimeFormat("id-ID", { month: "short" }).format(date), total }; }); }
