import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/guards";
import { createSlug } from "@/lib/slug";
import { createAdminClient } from "@/lib/supabase/admin";

const schema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2),
  category_id: z.string().uuid(),
  description: z.string().nullish(),
  age_value: z.coerce.number().int().nonnegative().nullish(),
  age_unit: z.enum(["DAYS", "WEEKS", "MONTHS", "YEARS"]),
  gender: z.enum(["MALE", "FEMALE", "UNKNOWN"]),
  color: z.string().nullish(),
  price: z.coerce.number().int().nonnegative(),
  inventory_type: z.enum(["INDIVIDUAL", "QUANTITY"]),
  stock: z.coerce.number().int().nonnegative(),
  status: z.enum(["AVAILABLE", "RESERVED", "SOLD", "UNAVAILABLE"]),
  tame_status: z.string().nullish(),
  featured: z.boolean(),
  image_url: z.string().url().optional(),
});

type AdminClient = ReturnType<typeof createAdminClient>;

export async function POST(request: Request) {
  return save(request, false);
}

export async function PATCH(request: Request) {
  return save(request, true);
}

async function save(request: Request, update: boolean) {
  try {
    await requireAdmin();
    const input = schema.parse(await request.json());

    if (input.inventory_type === "INDIVIDUAL" && input.stock > 1) {
      return NextResponse.json(
        { error: "Stok untuk satu ekor maksimum 1." },
        { status: 400 },
      );
    }

    if (!update && !input.image_url) {
      return NextResponse.json(
        { error: "Foto utama wajib diunggah sebelum data burung disimpan." },
        { status: 400 },
      );
    }

    const { id, image_url: imageUrl, ...values } = input;
    const admin = createAdminClient();

    if (update && !id) {
      return NextResponse.json({ error: "Data burung tidak ditemukan." }, { status: 400 });
    }

    const { data: category, error: categoryError } = await admin
      .from("bird_categories")
      .select("id")
      .eq("id", input.category_id)
      .eq("active", true)
      .maybeSingle();

    if (categoryError || !category) {
      return NextResponse.json(
        { error: "Kategori yang dipilih tidak tersedia. Pilih kategori aktif lainnya." },
        { status: 400 },
      );
    }

    const createValues = {
      ...values,
      slug: `${createSlug(input.name)}-${crypto.randomUUID().slice(0, 8)}`,
    };
    const query = update
      ? admin.from("birds").update(values).eq("id", id!).select("id").single()
      : admin.from("birds").insert(createValues).select("id").single();
    const { data, error } = await query;

    if (error || !data) {
      return NextResponse.json(
        { error: "Data burung belum dapat disimpan." },
        { status: 400 },
      );
    }

    if (imageUrl) {
      const imageError = await setPrimaryImage(admin, data.id, input.name, imageUrl);
      if (imageError) {
        return NextResponse.json(
          { error: "Data burung tersimpan, tetapi foto belum dapat diperbarui." },
          { status: 500 },
        );
      }
    }

    return NextResponse.json({ id: data.id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Data burung belum valid." }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Data burung belum dapat disimpan." },
      { status: 500 },
    );
  }
}

async function setPrimaryImage(
  admin: AdminClient,
  birdId: string,
  birdName: string,
  imageUrl: string,
) {
  const { data: currentImages, error: readError } = await admin
    .from("bird_images")
    .select("id,image_url,sort_order")
    .eq("bird_id", birdId)
    .order("sort_order");

  if (readError) return readError;

  const [primaryImage, ...extraImages] = currentImages ?? [];
  const imageValues = {
    image_url: imageUrl,
    alt_text: `Foto ${birdName}`,
    sort_order: 0,
  };

  const { error: writeError } = primaryImage
    ? await admin.from("bird_images").update(imageValues).eq("id", primaryImage.id)
    : await admin.from("bird_images").insert({ bird_id: birdId, ...imageValues });

  if (writeError) return writeError;

  if (extraImages.length > 0) {
    const { error: deleteError } = await admin
      .from("bird_images")
      .delete()
      .in("id", extraImages.map((image) => image.id));
    if (deleteError) return deleteError;
  }

  const previousUrls = (currentImages ?? [])
    .map((image) => image.image_url)
    .filter((url) => url !== imageUrl);
  const previousPaths = previousUrls.flatMap(storagePathFromPublicUrl);

  if (previousPaths.length > 0) {
    await admin.storage.from("bird-images").remove(previousPaths);
  }

  return null;
}

function storagePathFromPublicUrl(url: string) {
  const marker = "/storage/v1/object/public/bird-images/";
  const markerIndex = url.indexOf(marker);
  if (markerIndex === -1) return [];

  const path = url.slice(markerIndex + marker.length).split("?")[0];
  return path ? [decodeURIComponent(path)] : [];
}
