import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerEnv } from "@/lib/env";
import { createSnapTransaction } from "@/lib/midtrans/snap";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { checkoutSchema } from "@/lib/validation/checkout";

const createdOrderSchema = z.object({ created_order_id: z.string().uuid(), created_order_number: z.string(), created_subtotal: z.coerce.number(), created_shipping_cost: z.coerce.number(), created_total: z.coerce.number() });

export async function POST(request: Request) {
  try {
    const env = getServerEnv();
    const input = checkoutSchema.parse(await request.json());
    const supabase = await createClient();
    const { data: claimsData, error: authError } = await supabase.auth.getClaims();
    if (authError || !claimsData?.claims?.sub) return NextResponse.json({ error: "Silakan masuk sebelum melanjutkan pemesanan." }, { status: 401 });
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", claimsData.claims.sub).single();
    if (profile?.role === "ADMIN") return NextResponse.json({ error: "Pemesanan hanya tersedia untuk akun pengguna." }, { status: 403 });

    const { data, error } = await supabase.rpc("create_checkout_order", {
      p_items: input.items,
      p_shipping_zone_id: input.shippingZoneId,
      p_customer_snapshot: input.customer,
      p_address_snapshot: input.address,
      p_notes: input.notes ?? null,
    });
    if (error) return NextResponse.json({ error: mapCheckoutError(error.message) }, { status: 409 });
    const order = createdOrderSchema.parse(data?.[0]);
    const admin = createAdminClient();
    const { data: orderItems } = await admin.from("order_items").select("bird_id,bird_name_snapshot,price_snapshot,quantity").eq("order_id", order.created_order_id);
    const snapItems = (orderItems ?? []).map((item) => ({ id: item.bird_id ?? order.created_order_id, name: item.bird_name_snapshot, price: Number(item.price_snapshot), quantity: item.quantity }));
    snapItems.push({ id: `shipping-${input.shippingZoneId}`, name: "Pengiriman", price: order.created_shipping_cost, quantity: 1 });
    try {
      const snap = await createSnapTransaction(env.MIDTRANS_SERVER_KEY, { orderId: order.created_order_number, grossAmount: order.created_total, customer: { firstName: input.customer.fullName, email: input.customer.email, phone: input.customer.phone }, items: snapItems, paymentMethod: input.paymentMethod });
      await admin.from("payments").insert({ order_id: order.created_order_id, provider: "MIDTRANS", transaction_status: "INITIATED", payment_type: paymentTypeByMethod[input.paymentMethod], gross_amount: order.created_total, raw_response: { snap_token_created: true, requested_method: input.paymentMethod } });
      return NextResponse.json({ token: snap.token, redirectUrl: snap.redirect_url, orderId: order.created_order_id, orderNumber: order.created_order_number });
    } catch (midtransError) {
      await admin.rpc("apply_midtrans_payment", { p_order_id: order.created_order_id, p_status: "CANCELLED" });
      throw midtransError;
    }
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: "Data pemesanan belum lengkap atau tidak valid.", fields: error.flatten().fieldErrors }, { status: 400 });
    const message = error instanceof Error ? error.message : "Pemesanan belum dapat diproses.";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}

const paymentTypeByMethod = {
  QRIS: "other_qris",
  BANK_TRANSFER: "bank_transfer",
  SHOPEEPAY: "shopeepay",
} as const;

function mapCheckoutError(message: string) {
  if (message.includes("SHIPPING_UNAVAILABLE")) return "Pengiriman belum tersedia untuk pilihan ini.";
  if (message.includes("BIRD_UNAVAILABLE") || message.includes("INSUFFICIENT_STOCK")) return "Salah satu burung tidak lagi tersedia dalam jumlah yang dipilih.";
  if (message.includes("INDIVIDUAL_QUANTITY_INVALID")) return "Burung individual hanya dapat dipesan satu ekor.";
  return "Pesanan belum dapat dibuat. Periksa kembali cart dan pengiriman.";
}
