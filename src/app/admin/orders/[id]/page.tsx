import { notFound } from "next/navigation";
import { AdminHeading } from "@/components/admin/admin-heading";
import { OrderAutoRefresh } from "@/components/admin/order-auto-refresh";
import { OrderOperations } from "@/components/admin/order-operations";
import { OrderStatusForm } from "@/components/admin/order-status-form";
import { createAdminClient } from "@/lib/supabase/admin";
import { getOrderStatusLabel, getPaymentMethodLabel, getPaymentStatusLabel, getShippingStatusLabel } from "@/lib/status-labels";
import { formatRupiah } from "@/lib/utils";

type Snapshot = Record<string, string | undefined>;
type Shipment = { method?: string | null; tracking_number?: string | null; status?: string | null; notes?: string | null };
type Payment = { payment_type?: string | null; transaction_status?: string | null; created_at?: string | null };

export default async function AdminOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data } = await createAdminClient().from("orders").select("*,order_items(*),payments(*),shipments(*)").eq("id", id).single();
  if (!data) notFound();
  const customer = (data.customer_snapshot ?? {}) as Snapshot; const address = (data.address_snapshot ?? {}) as Snapshot; const shipment = (Array.isArray(data.shipments) ? data.shipments[0] : data.shipments) as Shipment | null; const payments = (Array.isArray(data.payments) ? data.payments : data.payments ? [data.payments] : []) as Payment[]; const payment = [...payments].sort((first, second) => Date.parse(second.created_at ?? "") - Date.parse(first.created_at ?? "")).find((item) => item.transaction_status !== "INITIATED") ?? payments[0];
  return <><OrderAutoRefresh/><AdminHeading title={data.order_number} description="Kelola verifikasi pembayaran, pemrosesan pesanan, dan konfirmasi pengiriman." />
    <div className="grid gap-5 lg:grid-cols-3">
      <Panel title="Status"><Row label="Pembayaran" value={getPaymentStatusLabel(data.payment_status)} /><Row label="Metode" value={getPaymentMethodLabel(payment?.payment_type)} /><Row label="Pesanan" value={getOrderStatusLabel(data.order_status)} /><Row label="Pengiriman" value={getShippingStatusLabel(data.shipping_status)} /><OrderStatusForm id={data.id} current={data.order_status} paymentStatus={data.payment_status} /></Panel>
      <Panel title="Pelanggan"><Row label="Nama" value={customer.fullName ?? "—"} /><Row label="Email" value={customer.email ?? "—"} /><Row label="WhatsApp" value={customer.phone ?? "—"} /></Panel>
      <Panel title="Alamat penerima"><Row label="Penerima" value={address.receiverName ?? "—"} /><Row label="Telepon" value={address.receiverPhone ?? "—"} /><p className="text-sm leading-6 text-muted-text">{[address.address, address.district, address.city, address.province, address.postalCode].filter(Boolean).join(", ") || "Alamat belum tersedia."}</p></Panel>
    </div>
    <OrderOperations id={data.id} paymentStatus={data.payment_status} orderStatus={data.order_status} shipment={shipment} />
    <div className="mt-6 rounded-[var(--radius-md)] bg-off-white p-6"><div className="flex items-end justify-between"><h2 className="font-serif text-3xl">Isi pesanan</h2><strong className="text-deep-forest">{formatRupiah(Number(data.total))}</strong></div><div className="mt-5 border-t border-line">{data.order_items?.map((item: { id: string; bird_name_snapshot: string; category_snapshot: string; quantity: number; price_snapshot: number }) => <div key={item.id} className="flex justify-between gap-5 border-b border-line py-4"><div><strong>{item.bird_name_snapshot}</strong><p className="text-xs text-muted-text">Kategori {item.category_snapshot} · {item.quantity} burung · data saat pemesanan</p></div><strong>{formatRupiah(Number(item.price_snapshot) * item.quantity)}</strong></div>)}</div></div>
  </>;
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) { return <section className="rounded-[var(--radius-md)] bg-off-white p-6"><h2 className="font-serif text-2xl">{title}</h2><div className="mt-5 grid gap-3">{children}</div></section>; }
function Row({ label, value }: { label: string; value: string }) { return <div className="flex justify-between gap-4 text-sm"><span className="text-muted-text">{label}</span><strong className="text-right">{value}</strong></div>; }
