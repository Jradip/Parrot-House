import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { getServerEnv } from "@/lib/env";
import { mapMidtransPaymentStatus } from "@/lib/midtrans/status";

const notificationSchema = z.object({ order_id: z.string(), status_code: z.string(), gross_amount: z.string(), signature_key: z.string(), transaction_status: z.string(), transaction_id: z.string().optional(), payment_type: z.string().optional(), fraud_status: z.string().optional() }).passthrough();

export async function POST(request: Request) {
  try {
    const body = notificationSchema.parse(await request.json());
    const env = getServerEnv();
    const expected = createHash("sha512").update(`${body.order_id}${body.status_code}${body.gross_amount}${env.MIDTRANS_SERVER_KEY}`).digest();
    const received = Buffer.from(body.signature_key, "hex");
    if (received.length !== expected.length || !timingSafeEqual(received, expected)) return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
    const admin = createAdminClient();
    const { data: order } = await admin.from("orders").select("id,total").eq("midtrans_order_id", body.order_id).single();
    if (!order || Number(body.gross_amount) !== Number(order.total)) return NextResponse.json({ error: "Data pesanan tidak sesuai." }, { status: 400 });
    const status = mapMidtransPaymentStatus(body.transaction_status, body.fraud_status);
    await admin.from("payments").upsert({ order_id: order.id, provider: "MIDTRANS", transaction_id: body.transaction_id ?? body.order_id, transaction_status: body.transaction_status, payment_type: body.payment_type, gross_amount: body.gross_amount, raw_response: body }, { onConflict: "provider,transaction_id" });
    const { error } = await admin.rpc("apply_midtrans_payment", { p_order_id: order.id, p_status: status });
    if (error) throw error;
    return NextResponse.json({ received: true });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
    return NextResponse.json({ error: "Notification could not be processed." }, { status: 500 });
  }
}
