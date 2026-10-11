import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import sharp from "sharp";
import { requireAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const maxBytes = 5 * 1024 * 1024;
const outputWidth = 1200;
const outputHeight = 1500;

export async function POST(request: Request) {
  try {
    await requireAdmin();

    const form = await request.formData();
    const file = form.get("file");

    if (!(file instanceof File) || !allowedTypes.has(file.type) || file.size > maxBytes) {
      return NextResponse.json(
        { error: "Gunakan foto JPG, PNG, atau WebP maksimal 5 MB." },
        { status: 400 },
      );
    }

    const input = Buffer.from(await file.arrayBuffer());
    const optimizedImage = await sharp(input, {
      failOn: "error",
      limitInputPixels: 40_000_000,
    })
      .rotate()
      .resize(outputWidth, outputHeight, { fit: "cover", position: "attention" })
      .webp({ quality: 84, effort: 4 })
      .toBuffer();

    const path = `birds/${randomUUID()}.webp`;
    const admin = createAdminClient();
    const { error } = await admin.storage.from("bird-images").upload(path, optimizedImage, {
      contentType: "image/webp",
      cacheControl: "31536000",
      upsert: false,
    });

    if (error) throw error;

    const { data } = admin.storage.from("bird-images").getPublicUrl(path);
    return NextResponse.json({ url: data.publicUrl, width: outputWidth, height: outputHeight });
  } catch {
    return NextResponse.json(
      { error: "Foto belum dapat diproses. Pastikan berkas gambar tidak rusak." },
      { status: 500 },
    );
  }
}
