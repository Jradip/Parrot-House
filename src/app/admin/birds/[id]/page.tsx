import { notFound } from "next/navigation";
import { AdminHeading } from "@/components/admin/admin-heading";
import { BirdForm } from "@/components/admin/bird-form";
import { createAdminClient } from "@/lib/supabase/admin";

type BirdImage = { image_url: string; sort_order: number };

export default async function EditBirdPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const admin = createAdminClient();
  const [{ data: bird }, { data: categories }] = await Promise.all([
    admin
      .from("birds")
      .select("*,bird_images(image_url,sort_order)")
      .eq("id", id)
      .single(),
    admin.from("bird_categories").select("id,name").eq("active", true).order("sort_order"),
  ]);

  if (!bird) notFound();

  const images = ((bird.bird_images ?? []) as BirdImage[]).sort(
    (first, second) => first.sort_order - second.sort_order,
  );

  return (
    <>
      <AdminHeading
        title={`Ubah ${bird.name}`}
        description="Perbarui data burung tanpa mengubah data pesanan lama."
      />
      <BirdForm
        categories={categories ?? []}
        initial={bird}
        initialImageUrl={images[0]?.image_url}
      />
    </>
  );
}
