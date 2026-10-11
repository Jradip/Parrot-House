import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth/guards";
import { reconcileMidtransOrder } from "@/lib/midtrans/reconcile";

const paramsSchema = z.object({ id: z.string().uuid() });

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireUser();
    const { id } = paramsSchema.parse(await params);
    return NextResponse.json(await reconcileMidtransOrder(id, { userId: user.id }));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Pembayaran belum dapat diperiksa.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
