import { notFound } from "next/navigation";
import { CheckCircle2, Clock3, MessageCircle, Truck } from "lucide-react";
import { OrderProgress } from "@/components/account/order-progress";
import { OrderAutoRefresh } from "@/components/account/order-auto-refresh";
import { PaymentStatusSync } from "@/components/account/payment-status-sync";
import { ButtonLink } from "@/components/ui/button";
import { requireUser } from "@/lib/auth/guards";
import {
  getOrderStatusLabel,
  getPaymentMethodLabel,
  getPaymentStatusLabel,
  getShippingStatusLabel,
} from "@/lib/status-labels";
import { createClient } from "@/lib/supabase/server";
import { formatRupiah } from "@/lib/utils";
import { createWhatsAppUrl } from "@/lib/whatsapp";

type Payment = {
  payment_type: string | null;
  transaction_status: string;
  created_at: string;
};

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const { id } = await params;
  const supabase = await createClient();
  const { data: order } = await supabase
    .from("orders")
    .select("*,order_items(*),payments(*),shipments(*)")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!order) notFound();

  const payments = ((order.payments ?? []) as Payment[]).sort(
    (first, second) => Date.parse(second.created_at) - Date.parse(first.created_at),
  );
  const payment = payments.find((item) => item.transaction_status !== "INITIATED") ?? payments[0];
  const whatsappHref = createWhatsAppUrl(
    `Halo Parrot House,\n\nSaya ingin mengonfirmasi pesanan saya.\n\nNomor pesanan: ${order.order_number}\nTotal: ${formatRupiah(Number(order.total))}\nStatus pembayaran: ${getPaymentStatusLabel(order.payment_status)}\n\nTerima kasih.`,
  );
  const shipping = shippingSummary(order.shipping_status);
  const ShippingIcon = shipping.icon;

  return (
    <div>
      <OrderAutoRefresh />
      <p className="section-kicker">Detail pesanan</p>
      <h2 className="mt-3 font-serif text-4xl font-medium">{order.order_number}</h2>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <Status label="Pembayaran" value={getPaymentStatusLabel(order.payment_status)} />
        <Status label="Metode" value={getPaymentMethodLabel(payment?.payment_type)} />
        <Status label="Pesanan" value={getOrderStatusLabel(order.order_status)} />
        <Status label="Pengiriman" value={getShippingStatusLabel(order.shipping_status)} />
      </div>

      <div className="mt-8 rounded-[var(--radius-md)] border border-line bg-off-white p-5">
        <OrderProgress status={order.order_status} />
      </div>

      {order.payment_status === "PENDING" ? <PaymentStatusSync orderId={order.id} /> : null}

      <section className="mt-8 flex gap-4 rounded-[var(--radius-md)] bg-warm-cream p-6">
        <ShippingIcon className="mt-1 shrink-0 text-deep-forest" size={24} />
        <div>
          <p className="section-kicker">Status pengiriman</p>
          <h3 className="mt-2 font-serif text-2xl">{shipping.title}</h3>
          <p className="mt-2 text-sm leading-6 text-muted-text">{shipping.description}</p>
        </div>
      </section>

      <div className="mt-8 rounded-[var(--radius-md)] bg-warm-cream p-6">
        <h3 className="font-serif text-2xl">Isi pesanan</h3>
        <div className="mt-5 grid gap-3">
          {order.order_items?.map((item: { id: string; bird_name_snapshot: string; category_snapshot: string; quantity: number; price_snapshot: number }) => (
            <div key={item.id} className="flex justify-between gap-4 border-b border-line pb-3">
              <span><strong className="block">{item.bird_name_snapshot} × {item.quantity}</strong><span className="mt-1 block text-xs text-muted-text">Kategori {item.category_snapshot}</span></span>
              <strong>{formatRupiah(Number(item.price_snapshot) * item.quantity)}</strong>
            </div>
          ))}
        </div>
        <div className="mt-5 flex justify-between text-lg">
          <span>Total</span>
          <strong className="text-deep-forest">{formatRupiah(Number(order.total))}</strong>
        </div>
      </div>

      {order.payment_status === "PAID" ? (
        <ButtonLink href={whatsappHref} className="mt-7">
          <MessageCircle size={17} /> Konfirmasi melalui WhatsApp
        </ButtonLink>
      ) : null}
    </div>
  );
}

function Status({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-deep-forest pt-4">
      <p className="text-xs font-bold uppercase tracking-wider text-muted-text">{label}</p>
      <p className="mt-2 font-bold">{value}</p>
    </div>
  );
}

function shippingSummary(status: string) {
  if (status === "DELIVERED") {
    return { icon: CheckCircle2, title: "Pesanan sudah diterima.", description: "Pengiriman telah dikonfirmasi sampai ke alamat penerima." };
  }
  if (status === "SHIPPED") {
    return { icon: Truck, title: "Pesanan sudah dikirim.", description: "Pesanan sedang dalam perjalanan menuju alamat penerima." };
  }
  if (status === "READY") {
    return { icon: Truck, title: "Pesanan siap dikirim.", description: "Admin sudah menyiapkan pesanan dan akan segera mengirimkannya." };
  }
  if (status === "CANCELLED") {
    return { icon: Clock3, title: "Pengiriman dibatalkan.", description: "Hubungi Parrot House jika Anda memerlukan informasi lebih lanjut." };
  }
  return { icon: Clock3, title: "Pesanan belum dikirim.", description: "Status akan diperbarui setelah admin mengonfirmasi pengiriman." };
}
