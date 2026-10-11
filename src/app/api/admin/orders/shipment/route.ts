import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/admin";

const schema = z.object({ id: z.string().uuid(), method: z.string().min(2), trackingNumber: z.string().max(100).optional(), status: z.enum(["SHIPPED", "DELIVERED"]), notes: z.string().max(500).optional() });

export async function PATCH(request: Request) {
  try {
    await requireAdmin();
    const input = schema.parse(await request.json());
    const admin = createAdminClient();
    const { data: order } = await admin.from("orders").select("payment_status,order_status").eq("id", input.id).single();
    if (!order) return NextResponse.json({ error: "Pesanan tidak ditemukan." }, { status: 404 });
    if (order.payment_status !== "PAID") return NextResponse.json({ error: "Pesanan hanya dapat dikirim setelah pembayaran dinyatakan lunas." }, { status: 409 });
    const expectedStatus = order.order_status === "READY_TO_SHIP" ? "SHIPPED" : order.order_status === "SHIPPED" ? "DELIVERED" : undefined;
    if (input.status !== expectedStatus) return NextResponse.json({ error: "Tahapan pengiriman harus diperbarui secara berurutan." }, { status: 409 });
    const now = new Date().toISOString();
    const shipment = { order_id: input.id, method: input.method, tracking_number: input.trackingNumber || null, status: input.status, notes: input.notes || null, shipped_at: input.status === "SHIPPED" ? now : undefined, delivered_at: input.status === "DELIVERED" ? now : undefined };
    const { error: shipmentError } = await admin.from("shipments").upsert(shipment, { onConflict: "order_id" });
    if (shipmentError) throw shipmentError;
    const orderStatus = input.status === "SHIPPED" ? "SHIPPED" : "DELIVERED";
    const values = { shipping_status: input.status, order_status: orderStatus };
    const { error } = await admin.from("orders").update(values).eq("id", input.id);
    if (error) throw error;
    return NextResponse.json({ updated: true, shippingStatus: input.status });
  } catch (error) {
    return NextResponse.json({ error: error instanceof z.ZodError ? "Informasi pengiriman belum lengkap." : "Pengiriman belum dapat diperbarui." }, { status: 400 });
  }
}
