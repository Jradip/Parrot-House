import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/admin";

const schema = z.object({
  id: z.string().uuid(),
  status: z.enum(["PROCESSING", "READY_TO_SHIP"]),
});

const allowedTransition: Record<string, string> = {
  PAID: "PROCESSING",
  PROCESSING: "READY_TO_SHIP",
};

export async function PATCH(request: Request) {
  try {
    await requireAdmin();
    const input = schema.parse(await request.json());
    const admin = createAdminClient();
    const { data: order } = await admin
      .from("orders")
      .select("payment_status,order_status")
      .eq("id", input.id)
      .single();

    if (!order) {
      return NextResponse.json({ error: "Pesanan tidak ditemukan." }, { status: 404 });
    }
    if (order.payment_status !== "PAID") {
      return NextResponse.json(
        { error: "Pesanan hanya dapat diproses setelah pembayaran terverifikasi." },
        { status: 409 },
      );
    }
    if (allowedTransition[order.order_status] !== input.status) {
      return NextResponse.json(
        { error: "Tahapan pesanan harus diperbarui secara berurutan." },
        { status: 409 },
      );
    }

    const values: { order_status: typeof input.status; shipping_status?: "READY" } = {
      order_status: input.status,
    };
    if (input.status === "READY_TO_SHIP") values.shipping_status = "READY";

    const { error } = await admin.from("orders").update(values).eq("id", input.id);
    if (error) throw error;

    return NextResponse.json({ updated: true, orderStatus: input.status });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof z.ZodError ? "Status pesanan tidak valid." : "Status belum dapat diperbarui." },
      { status: 400 },
    );
  }
}
