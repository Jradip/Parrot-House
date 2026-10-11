"use client";

import Link from "next/link";
import { CheckCircle2, LoaderCircle, PackageCheck, Truck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getPaymentStatusLabel, getShippingStatusLabel } from "@/lib/status-labels";

export type ShipmentListItem = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  birds: string[];
  address: string;
  paymentStatus: string;
  orderStatus: string;
  shippingStatus: string;
  method: string;
  trackingNumber: string;
  notes: string;
};

export function ShipmentList({ orders }: { orders: ShipmentListItem[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string>();
  const [error, setError] = useState<string>();

  const markAsShipped = async (order: ShipmentListItem) => {
    setBusyId(order.id);
    setError(undefined);
    const response = await fetch("/api/admin/orders/shipment", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: order.id,
        method: order.method,
        trackingNumber: order.trackingNumber,
        status: "SHIPPED",
        notes: order.notes,
      }),
    });
    const result = (await response.json()) as { error?: string };
    setBusyId(undefined);
    if (!response.ok) {
      setError(result.error ?? "Status pengiriman belum dapat diperbarui.");
      return;
    }
    router.refresh();
  };

  if (!orders.length) {
    return (
      <div className="grid min-h-44 place-items-center border-y border-line text-center">
        <div>
          <PackageCheck className="mx-auto text-deep-forest" size={24} />
          <p className="mt-3 font-serif text-2xl">Belum ada pesanan yang perlu dikirim.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {error ? <p role="alert" className="mb-4 rounded-lg bg-danger/10 p-3 text-sm text-danger">{error}</p> : null}
      <div className="border-t border-line">
        {orders.map((order) => {
          const finished = order.shippingStatus === "SHIPPED" || order.shippingStatus === "DELIVERED";
          const cancelled = order.shippingStatus === "CANCELLED";
          const canShip = order.paymentStatus === "PAID" && order.orderStatus === "READY_TO_SHIP" && !finished && !cancelled;

          return (
            <article key={order.id} className="grid gap-5 border-b border-line py-6 xl:grid-cols-[0.9fr_1fr_1.45fr_0.8fr] xl:items-start">
              <div>
                <Link href={`/admin/orders/${order.id}`} className="font-bold text-deep-forest hover:underline">
                  {order.orderNumber}
                </Link>
                <p className="mt-2 font-semibold">{order.customerName}</p>
                <p className="mt-1 text-xs text-muted-text">{order.customerPhone}</p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-text">Burung</p>
                <ul className="mt-2 grid gap-1 text-sm">
                  {order.birds.map((bird) => <li key={bird}>{bird}</li>)}
                </ul>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-text">Alamat penerima</p>
                <p className="mt-2 text-sm leading-6">{order.address}</p>
              </div>

              <div className="xl:text-right">
                <p className="inline-flex items-center gap-2 text-sm font-bold">
                  {finished ? <CheckCircle2 className="text-success" size={17} /> : <Truck className="text-warm-gold" size={17} />}
                  {getShippingStatusLabel(order.shippingStatus)}
                </p>
                <p className="mt-1 text-xs text-muted-text">Pembayaran: {getPaymentStatusLabel(order.paymentStatus)}</p>
                {canShip ? (
                  <Button type="button" variant="secondary" className="mt-4" disabled={busyId === order.id} onClick={() => markAsShipped(order)}>
                    {busyId === order.id ? <LoaderCircle className="animate-spin" size={16} /> : <Truck size={16} />}
                    Tandai sudah dikirim
                  </Button>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
