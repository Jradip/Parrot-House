export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "EXPIRED" | "CANCELLED" | "REFUNDED";

export function mapMidtransPaymentStatus(transactionStatus: string, fraudStatus?: string): PaymentStatus {
  if (transactionStatus === "settlement" || (transactionStatus === "capture" && (!fraudStatus || fraudStatus.toLowerCase() === "accept"))) return "PAID";
  if (transactionStatus === "expire") return "EXPIRED";
  if (transactionStatus === "cancel") return "CANCELLED";
  if (transactionStatus === "deny") return "FAILED";
  if (transactionStatus === "refund" || transactionStatus === "partial_refund") return "REFUNDED";
  return "PENDING";
}
