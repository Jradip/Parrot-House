import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = ["Dibuat", "Dibayar", "Dikemas", "Dikirim", "Selesai"];

const progressByStatus: Record<string, number> = {
  WAITING_PAYMENT: 0,
  PAID: 1,
  PROCESSING: 2,
  READY_TO_SHIP: 2,
  SHIPPED: 3,
  DELIVERED: 4,
  COMPLETED: 4,
};

export function OrderProgress({ status }: { status: string }) {
  if (status === "CANCELLED") {
    return <div className="mt-5 flex items-center gap-2 border-t border-line pt-4 text-sm font-bold text-danger"><X size={17} /> Pesanan dibatalkan</div>;
  }

  const progress = progressByStatus[status] ?? 0;

  return (
    <ol className="mt-6 grid sm:grid-cols-5" aria-label="Tahapan pesanan">
      {steps.map((step, index) => {
        const reached = index <= progress;
        return (
          <li key={step} className="relative grid grid-cols-[1.5rem_1fr] items-center pb-4 text-left last:pb-0 sm:grid-cols-1 sm:justify-items-center sm:pb-0 sm:text-center">
            {index > 0 ? <span className={cn("absolute bottom-1/2 left-[0.72rem] h-full w-px sm:bottom-auto sm:left-auto sm:right-1/2 sm:top-3 sm:h-px sm:w-full", index <= progress ? "bg-deep-forest" : "bg-line")} /> : null}
            <span className={cn("relative z-10 grid size-6 place-items-center rounded-full border text-[10px]", reached ? "border-deep-forest bg-deep-forest text-off-white" : "border-line bg-off-white text-muted-text")}>
              {reached ? <Check size={13} /> : index + 1}
            </span>
            <span className={cn("ml-3 text-xs font-bold sm:ml-0 sm:mt-2", reached ? "text-main-text" : "text-muted-text")}>{step}</span>
          </li>
        );
      })}
    </ol>
  );
}
