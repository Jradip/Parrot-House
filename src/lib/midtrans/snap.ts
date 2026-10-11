import "server-only";

interface SnapRequest {
  orderId: string;
  grossAmount: number;
  customer: { firstName: string; email: string; phone: string };
  items: Array<{ id: string; price: number; quantity: number; name: string }>;
  paymentMethod: "QRIS" | "BANK_TRANSFER" | "SHOPEEPAY";
}

export interface SnapResponse { token: string; redirect_url: string }

export async function createSnapTransaction(serverKey: string, input: SnapRequest): Promise<SnapResponse> {
  const authorization = Buffer.from(`${serverKey}:`).toString("base64");
  const response = await fetch("https://app.sandbox.midtrans.com/snap/v1/transactions", {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json", Authorization: `Basic ${authorization}` },
    body: JSON.stringify({
      transaction_details: { order_id: input.orderId, gross_amount: input.grossAmount },
      customer_details: { first_name: input.customer.firstName, email: input.customer.email, phone: input.customer.phone },
      item_details: input.items.map((item) => ({ id: item.id, price: item.price, quantity: item.quantity, name: item.name.slice(0, 50) })),
      enabled_payments: enabledPayments[input.paymentMethod],
    }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Midtrans menolak transaksi (${response.status}).`);
  return response.json() as Promise<SnapResponse>;
}

const enabledPayments: Record<SnapRequest["paymentMethod"], string[]> = {
  QRIS: ["other_qris"],
  BANK_TRANSFER: ["bank_transfer"],
  SHOPEEPAY: ["shopeepay"],
};

export interface MidtransTransactionStatus {
  transaction_id?: string;
  transaction_status: string;
  fraud_status?: string;
  payment_type?: string;
  gross_amount: string;
  order_id: string;
  [key: string]: unknown;
}

export async function getMidtransTransactionStatus(serverKey: string, orderId: string): Promise<MidtransTransactionStatus> {
  const authorization = Buffer.from(`${serverKey}:`).toString("base64");
  const response = await fetch(`https://api.sandbox.midtrans.com/v2/${encodeURIComponent(orderId)}/status`, { headers: { Accept: "application/json", Authorization: `Basic ${authorization}` }, cache: "no-store" });
  if (!response.ok) throw new Error(`Midtrans belum dapat memverifikasi transaksi (${response.status}).`);
  return response.json() as Promise<MidtransTransactionStatus>;
}
