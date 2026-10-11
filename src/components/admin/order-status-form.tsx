"use client";

import { LoaderCircle, PackageCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const nextStatus = {
  PAID: { value: "PROCESSING", label: "Mulai proses dan pengemasan" },
  PROCESSING: { value: "READY_TO_SHIP", label: "Tandai siap dikirim" },
} as const;

export function OrderStatusForm({
  id,
  current,
  paymentStatus,
}: {
  id: string;
  current: string;
  paymentStatus: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string>();
  const action = nextStatus[current as keyof typeof nextStatus];

  if (paymentStatus !== "PAID") {
    return <p className="mt-5 text-xs leading-5 text-muted-text">Pemrosesan tersedia setelah pembayaran terverifikasi.</p>;
  }

  if (!action) return null;

  const updateStatus = async () => {
    setBusy(true);
    setMessage(undefined);
    const response = await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: action.value }),
    });
    const result = (await response.json()) as { error?: string };
    setBusy(false);

    if (!response.ok) {
      setMessage(result.error ?? "Status pesanan belum dapat diperbarui.");
      return;
    }

    router.refresh();
  };

  return (
    <div className="mt-6 border-t border-line pt-5">
      <Button type="button" onClick={updateStatus} disabled={busy}>
        {busy ? <LoaderCircle className="animate-spin" size={16} /> : <PackageCheck size={16} />}
        {action.label}
      </Button>
      {message ? <p role="alert" className="mt-3 text-xs text-danger">{message}</p> : null}
    </div>
  );
}
