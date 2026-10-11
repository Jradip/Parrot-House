import "server-only";
import { getServerEnv } from "@/lib/env";
import { getMidtransTransactionStatus } from "@/lib/midtrans/snap";
import { mapMidtransPaymentStatus } from "@/lib/midtrans/status";
import { createAdminClient } from "@/lib/supabase/admin";

type Scope = { admin: true } | { userId: string };

export async function reconcileMidtransOrder(orderId: string, scope: Scope) {
  const admin = createAdminClient();
  let query = admin
    .from("orders")
    .select("id,user_id,midtrans_order_id,total")
    .eq("id", orderId);

  if ("userId" in scope) query = query.eq("user_id", scope.userId);

  const { data: order } = await query.single();
  if (!order?.midtrans_order_id) throw new Error("Pesanan Midtrans tidak ditemukan.");

  const transaction = await getMidtransTransactionStatus(
    getServerEnv().MIDTRANS_SERVER_KEY,
    order.midtrans_order_id,
  );

  if (Number(transaction.gross_amount) !== Number(order.total)) {
    throw new Error("Nominal transaksi tidak sesuai dengan pesanan.");
  }

  const paymentStatus = mapMidtransPaymentStatus(
    transaction.transaction_status,
    transaction.fraud_status,
  );
  const { error: paymentError } = await admin.from("payments").upsert(
    {
      order_id: order.id,
      provider: "MIDTRANS",
      transaction_id: transaction.transaction_id ?? transaction.order_id,
      transaction_status: transaction.transaction_status,
      payment_type: transaction.payment_type,
      gross_amount: transaction.gross_amount,
      raw_response: transaction,
    },
    { onConflict: "provider,transaction_id" },
  );

  if (paymentError) throw paymentError;

  const { error } = await admin.rpc("apply_midtrans_payment", {
    p_order_id: order.id,
    p_status: paymentStatus,
  });
  if (error) throw error;

  return { paymentStatus, transactionStatus: transaction.transaction_status };
}
