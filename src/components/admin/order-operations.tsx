"use client";

import { LoaderCircle, RefreshCw, Save, Truck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormField, TextAreaField } from "@/components/ui/form-field";
import { getPaymentStatusLabel } from "@/lib/status-labels";

type Shipment = {
  method?: string | null;
  tracking_number?: string | null;
  status?: string | null;
  notes?: string | null;
};

export function OrderOperations({
  id,
  paymentStatus,
  orderStatus,
  shipment,
}: {
  id: string;
  paymentStatus: string;
  orderStatus: string;
  shipment?: Shipment | null;
}) {
  const router = useRouter();
  const [paymentMessage, setPaymentMessage] = useState<string>();
  const [checking, setChecking] = useState(false);
  const [shippingMessage, setShippingMessage] = useState<string>();
  const [saving, setSaving] = useState(false);
  const nextShippingStatus = orderStatus === "READY_TO_SHIP"
    ? "SHIPPED"
    : orderStatus === "SHIPPED"
      ? "DELIVERED"
      : undefined;
  const nextShippingLabel = nextShippingStatus === "SHIPPED"
    ? "Sudah dikirim"
    : nextShippingStatus === "DELIVERED"
      ? "Sudah diterima"
      : "Menunggu pesanan siap dikirim";

  const verifyPayment = async () => {
    setChecking(true);
    setPaymentMessage(undefined);
    const response = await fetch("/api/admin/orders/payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const result = (await response.json()) as { error?: string; paymentStatus?: string };
    setChecking(false);

    if (!response.ok) {
      setPaymentMessage(result.error ?? "Pembayaran belum dapat diperiksa.");
      return;
    }

    setPaymentMessage(`Status Midtrans: ${getPaymentStatusLabel(result.paymentStatus)}.`);
    router.refresh();
  };

  return (
    <div className="mt-6 grid gap-5 lg:grid-cols-2">
      <section className="rounded-[var(--radius-md)] bg-warm-cream p-6">
        <p className="section-kicker">Konfirmasi pembayaran</p>
        <h2 className="mt-2 font-serif text-3xl">Pemeriksaan Midtrans</h2>
        <p className="mt-3 text-sm leading-6 text-muted-text">
          Status lunas diterapkan otomatis dari Midtrans. Tombol ini menjadi pemeriksaan cadangan selama pengembangan lokal.
        </p>
        <Button
          type="button"
          variant="secondary"
          onClick={verifyPayment}
          disabled={checking}
          className="mt-5"
        >
          {checking ? <LoaderCircle className="animate-spin" size={16} /> : <RefreshCw size={16} />}
          Periksa pembayaran
        </Button>
        {paymentMessage ? <p role="status" className="mt-3 text-sm text-muted-text">{paymentMessage}</p> : null}
      </section>

      <form
        onSubmit={async (event) => {
          event.preventDefault();
          if (!nextShippingStatus) return;
          setSaving(true);
          setShippingMessage(undefined);
          const data = new FormData(event.currentTarget);
          const response = await fetch("/api/admin/orders/shipment", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id,
              method: data.get("method"),
              trackingNumber: data.get("trackingNumber"),
              status: nextShippingStatus,
              notes: data.get("notes"),
            }),
          });
          const result = (await response.json()) as { error?: string };
          setSaving(false);
          if (!response.ok) {
            setShippingMessage(result.error ?? "Pengiriman belum dapat disimpan.");
            return;
          }
          setShippingMessage("Status pengiriman berhasil diperbarui.");
          router.refresh();
        }}
        className="rounded-[var(--radius-md)] bg-off-white p-6"
      >
        <p className="section-kicker">Konfirmasi pengiriman</p>
        <h2 className="mt-2 font-serif text-3xl">Perkembangan kiriman</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <FormField
            label="Metode"
            name="method"
            defaultValue={shipment?.method ?? "Pengiriman khusus burung"}
            required
          />
          <FormField
            label="Nomor referensi"
            name="trackingNumber"
            defaultValue={shipment?.tracking_number ?? ""}
          />
          <div className="sm:col-span-2">
            <p className="text-sm font-bold">Tahap berikutnya</p>
            <p className="mt-2 rounded-lg border border-line bg-warm-cream px-4 py-3 text-sm font-semibold">
              {nextShippingLabel}
            </p>
          </div>
          <TextAreaField
            label="Catatan pengiriman"
            name="notes"
            defaultValue={shipment?.notes ?? ""}
            className="sm:col-span-2"
          />
        </div>
        {paymentStatus !== "PAID" ? (
          <p className="mt-4 text-xs leading-5 text-muted-text">
            Pesanan dapat disiapkan setelah pembayaran dinyatakan lunas.
          </p>
        ) : !nextShippingStatus ? (
          <p className="mt-4 text-xs leading-5 text-muted-text">
            Selesaikan tahap pemrosesan dan pengemasan sebelum mengonfirmasi pengiriman.
          </p>
        ) : null}
        <Button disabled={saving || paymentStatus !== "PAID" || !nextShippingStatus} className="mt-5">
          {saving ? <LoaderCircle className="animate-spin" size={16} /> : <><Truck size={16} /><Save size={14} /></>}
          Simpan pengiriman
        </Button>
        {shippingMessage ? <p role="status" className="mt-3 text-sm text-muted-text">{shippingMessage}</p> : null}
      </form>
    </div>
  );
}
