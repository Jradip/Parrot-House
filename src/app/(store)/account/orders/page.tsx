import Link from "next/link";
import { ArrowUpRight, PackageOpen } from "lucide-react";
import { OrderProgress } from "@/components/account/order-progress";
import { OrderAutoRefresh } from "@/components/account/order-auto-refresh";
import { requireUser } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";
import { getOrderStatusLabel, getPaymentStatusLabel, getShippingStatusLabel } from "@/lib/status-labels";
import { formatRupiah } from "@/lib/utils";

type OrderItem = { bird_name_snapshot: string; category_snapshot: string; quantity: number };
type OrderHistory = {
  id: string;
  order_number: string;
  total: number;
  payment_status: string;
  order_status: string;
  shipping_status: string;
  created_at: string;
  order_items: OrderItem[] | null;
};

export default async function OrdersPage() {
  const user = await requireUser();
  const supabase = await createClient();
  const { data } = await supabase
    .from("orders")
    .select("id,order_number,total,payment_status,order_status,shipping_status,created_at,order_items(bird_name_snapshot,category_snapshot,quantity)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  const orders = (data ?? []) as unknown as OrderHistory[];

  if (!orders.length) {
    return (
      <div className="grid min-h-72 place-items-center rounded-[var(--radius-md)] bg-warm-cream text-center">
        <div>
          <PackageOpen className="mx-auto text-deep-forest" />
          <h2 className="mt-5 font-serif text-3xl">Belum ada pesanan.</h2>
          <p className="mt-2 text-sm text-muted-text">Pesanan yang dibuat akan muncul di sini.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <OrderAutoRefresh />
      <h2 className="font-serif text-4xl font-medium">Riwayat pesanan</h2>
      <p className="mt-3 text-muted-text">Pantau pembayaran, proses pesanan, dan pengiriman dari satu tempat.</p>
      <div className="mt-8 grid gap-5">
        {orders.map((order) => (
          <article key={order.id} className="rounded-[var(--radius-md)] border border-line bg-off-white p-5 sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-text">
                  {new Intl.DateTimeFormat("id-ID", { dateStyle: "long" }).format(new Date(order.created_at))}
                </p>
                <Link href={`/account/orders/${order.id}`} className="mt-2 inline-flex items-center gap-2 font-serif text-2xl font-semibold text-deep-forest hover:underline">
                  {order.order_number} <ArrowUpRight size={17} />
                </Link>
                <p className="mt-2 text-sm text-muted-text">
                  {formatOrderItems(order.order_items)}
                </p>
              </div>
              <strong className="text-lg text-deep-forest">{formatRupiah(Number(order.total))}</strong>
            </div>

            <div className="mt-5 grid gap-3 border-y border-line py-4 text-sm sm:grid-cols-3">
              <Status label="Pembayaran" value={getPaymentStatusLabel(order.payment_status)} />
              <Status label="Pesanan" value={getOrderStatusLabel(order.order_status)} />
              <Status label="Pengiriman" value={getShippingStatusLabel(order.shipping_status)} />
            </div>
            <OrderProgress status={order.order_status} />
          </article>
        ))}
      </div>
    </div>
  );
}

function Status({ label, value }: { label: string; value: string }) {
  return <div><span className="text-xs font-bold uppercase tracking-wider text-muted-text">{label}</span><p className="mt-1 font-semibold">{value}</p></div>;
}

function formatOrderItems(items: OrderItem[] | null) {
  if (!items?.length) return "Informasi burung belum tersedia";
  return items.map((item) => `${item.bird_name_snapshot} (${item.category_snapshot}) × ${item.quantity}`).join(" · ");
}
