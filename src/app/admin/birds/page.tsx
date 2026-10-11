import Image from "next/image";
import Link from "next/link";
import { ImageIcon, Plus } from "lucide-react";
import { AdminHeading } from "@/components/admin/admin-heading";
import { ButtonLink } from "@/components/ui/button";
import { createAdminClient } from "@/lib/supabase/admin";
import { getBirdStatusLabel } from "@/lib/status-labels";
import { formatRupiah } from "@/lib/utils";

export default async function AdminBirdsPage() {
  const { data } = await createAdminClient()
    .from("birds")
    .select("id,name,price,stock,status,bird_categories(name),bird_images(image_url,sort_order)")
    .is("archived_at", null)
    .order("created_at", { ascending: false });

  return (
    <>
      <AdminHeading
        title="Burung"
        description="Kelola foto katalog, data burung, harga, stok, dan status ketersediaan."
        action={
          <ButtonLink href="/admin/birds/new">
            <Plus size={17} /> Tambah burung
          </ButtonLink>
        }
      />
      <div className="overflow-x-auto rounded-[var(--radius-md)] border border-line bg-off-white">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-warm-cream text-xs uppercase tracking-wider text-muted-text">
            <tr>
              <th className="p-4">Foto</th>
              <th>Nama</th>
              <th>Kategori</th>
              <th>Harga</th>
              <th>Stok</th>
              <th>Status</th>
              <th aria-label="Tindakan" />
            </tr>
          </thead>
          <tbody>
            {data?.map((bird) => {
              const imageUrl = readImageUrl(bird.bird_images);
              return (
                <tr key={bird.id} className="border-t border-line align-middle">
                  <td className="p-4">
                    <div className="relative aspect-[4/5] w-14 overflow-hidden rounded-md bg-warm-cream">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={`Foto ${bird.name}`}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      ) : (
                        <ImageIcon
                          size={18}
                          className="absolute inset-0 m-auto text-muted-text"
                          aria-label="Belum ada foto"
                        />
                      )}
                    </div>
                  </td>
                  <td className="font-bold">{bird.name}</td>
                  <td>{readCategoryName(bird.bird_categories)}</td>
                  <td>{formatRupiah(Number(bird.price))}</td>
                  <td>{bird.stock}</td>
                  <td>
                    <span className="rounded-full bg-warm-cream px-2.5 py-1 text-xs font-bold">
                      {getBirdStatusLabel(bird.status)}
                    </span>
                  </td>
                  <td className="pr-4 text-right">
                    <Link
                      href={`/admin/birds/${bird.id}`}
                      className="font-bold text-deep-forest"
                    >
                      Ubah
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

function readCategoryName(value: unknown) {
  if (Array.isArray(value)) {
    const first = value[0];
    return first && typeof first === "object" && "name" in first ? String(first.name) : "—";
  }
  return value && typeof value === "object" && "name" in value ? String(value.name) : "—";
}

function readImageUrl(value: unknown) {
  if (!Array.isArray(value)) return undefined;
  const sorted = [...value].sort((first, second) => {
    const firstOrder = readSortOrder(first);
    const secondOrder = readSortOrder(second);
    return firstOrder - secondOrder;
  });
  const first = sorted[0];
  return first && typeof first === "object" && "image_url" in first
    ? String(first.image_url)
    : undefined;
}

function readSortOrder(value: unknown) {
  return value && typeof value === "object" && "sort_order" in value
    ? Number(value.sort_order)
    : Number.MAX_SAFE_INTEGER;
}
