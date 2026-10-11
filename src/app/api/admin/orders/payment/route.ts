import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/guards";
import { reconcileMidtransOrder } from "@/lib/midtrans/reconcile";

const schema = z.object({ id: z.string().uuid() });

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const { id } = schema.parse(await request.json());
    return NextResponse.json(await reconcileMidtransOrder(id, { admin: true }));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Pembayaran belum dapat diverifikasi.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
