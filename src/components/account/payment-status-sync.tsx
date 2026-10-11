"use client";

import { LoaderCircle, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { getPaymentStatusLabel } from "@/lib/status-labels";

export function PaymentStatusSync({ orderId }: { orderId: string }) {
  const router = useRouter();
  const checkedAutomatically = useRef(false);
  const [checking, setChecking] = useState(false);
  const [message, setMessage] = useState<string>();

  const checkPayment = useCallback(async (automatic = false) => {
    setChecking(true);
    if (!automatic) setMessage(undefined);

    try {
      const response = await fetch(`/api/orders/${orderId}/payment`, { method: "POST" });
      const result = (await response.json()) as { error?: string; paymentStatus?: string };

      if (!response.ok) {
        if (!automatic) setMessage(result.error ?? "Status pembayaran belum dapat diperiksa.");
        return;
      }

      if (result.paymentStatus === "PAID") {
        setMessage("Pembayaran sudah terverifikasi.");
        router.refresh();
        return;
      }

      if (!automatic) {
        setMessage(`Status pembayaran: ${getPaymentStatusLabel(result.paymentStatus)}.`);
      }
    } finally {
      setChecking(false);
    }
  }, [orderId, router]);

  useEffect(() => {
    if (checkedAutomatically.current) return;
    checkedAutomatically.current = true;
    void checkPayment(true);
  }, [checkPayment]);

  return (
    <div className="mt-7 rounded-[var(--radius-md)] border border-line bg-off-white p-5">
      <p className="text-sm leading-6 text-muted-text">
        Jika pembayaran baru saja diselesaikan, sistem akan memeriksa status resminya langsung ke Midtrans.
      </p>
      <Button
        type="button"
        variant="secondary"
        className="mt-4"
        disabled={checking}
        onClick={() => void checkPayment(false)}
      >
        {checking ? <LoaderCircle className="animate-spin" size={16} /> : <RefreshCw size={16} />}
        Periksa pembayaran
      </Button>
      {message ? <p role="status" className="mt-3 text-sm text-muted-text">{message}</p> : null}
    </div>
  );
}
