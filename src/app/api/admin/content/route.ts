import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/admin";
import { aboutContentSchema } from "@/lib/validation/site-content";

export async function PATCH(request: Request) {
  try {
    await requireAdmin();
    const value = aboutContentSchema.parse(await request.json());
    const { error } = await createAdminClient().from("site_settings").upsert({ key: "about_page", value, public: true }, { onConflict: "key" });
    if (error) throw error;
    return NextResponse.json({ updated: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof z.ZodError ? "Konten belum lengkap atau terlalu panjang." : "Konten belum dapat disimpan." }, { status: 400 });
  }
}
