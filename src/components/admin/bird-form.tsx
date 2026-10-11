"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Save, Upload } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { FormField, TextAreaField } from "@/components/ui/form-field";

const schema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2, "Nama burung wajib diisi."),
  category_id: z.string().uuid("Pilih kategori burung."),
  description: z.string().optional(),
  age_value: z.number().int().nonnegative().optional(),
  age_unit: z.enum(["DAYS", "WEEKS", "MONTHS", "YEARS"]),
  gender: z.enum(["MALE", "FEMALE", "UNKNOWN"]),
  color: z.string().optional(),
  price: z.number().int().nonnegative("Harga tidak boleh negatif."),
  inventory_type: z.enum(["INDIVIDUAL", "QUANTITY"]),
  stock: z.number().int().nonnegative("Jumlah stok tidak boleh negatif."),
  status: z.enum(["AVAILABLE", "RESERVED", "SOLD", "UNAVAILABLE"]),
  tame_status: z.string().optional(),
  featured: z.boolean(),
});

type Values = z.infer<typeof schema>;
type Category = { id: string; name: string };
type Initial = Partial<Values>;

const selectClassName = "min-h-12 rounded-lg border border-line bg-off-white px-4";

export function BirdForm({
  categories,
  initial,
  initialImageUrl,
}: {
  categories: Category[];
  initial?: Initial;
  initialImageUrl?: string;
}) {
  const router = useRouter();
  const [message, setMessage] = useState<string>();
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(initialImageUrl);
  const [imageChanged, setImageChanged] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: initial?.id,
      name: initial?.name ?? "",
      category_id: initial?.category_id ?? categories[0]?.id,
      description: initial?.description ?? "",
      age_value: initial?.age_value ?? 0,
      age_unit: initial?.age_unit ?? "MONTHS",
      gender: initial?.gender ?? "UNKNOWN",
      color: initial?.color ?? "",
      price: initial?.price ?? 0,
      inventory_type: initial?.inventory_type ?? "INDIVIDUAL",
      stock: initial?.stock ?? 1,
      status: initial?.status ?? "AVAILABLE",
      tame_status: initial?.tame_status ?? "",
      featured: initial?.featured ?? false,
    },
  });

  const submit = async (values: Values) => {
    setMessage(undefined);
    if (!imageUrl) {
      setMessage("Unggah satu foto utama sebelum menyimpan burung.");
      return;
    }

    const response = await fetch("/api/admin/birds", {
      method: values.id ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        image_url: !values.id || imageChanged ? imageUrl : undefined,
      }),
    });
    const result = (await response.json()) as { error?: string };
    if (!response.ok) {
      setMessage(result.error ?? "Data burung belum dapat disimpan.");
      return;
    }
    router.push("/admin/birds");
    router.refresh();
  };

  const upload = async (file?: File) => {
    if (!file) return;
    setMessage(undefined);
    setUploading(true);
    const data = new FormData();
    data.set("file", file);
    const response = await fetch("/api/admin/birds/image", { method: "POST", body: data });
    const result = (await response.json()) as { url?: string; error?: string };
    setUploading(false);
    if (response.ok && result.url) {
      setImageUrl(result.url);
      setImageChanged(true);
    } else {
      setMessage(result.error ?? "Foto belum dapat diunggah.");
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="grid gap-8" noValidate>
      <div className="grid gap-5 rounded-[var(--radius-md)] bg-off-white p-6 sm:grid-cols-2">
        <FormField label="Nama burung" error={errors.name?.message} {...register("name")} />
        <label className="grid gap-2 text-sm font-bold">
          Kategori induk
          <select className={selectClassName} disabled={!categories.length} {...register("category_id")}>
            {!categories.length ? <option value="">Tambahkan kategori terlebih dahulu</option> : null}
            {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select>
          <span className="text-xs font-normal leading-5 text-muted-text">Pilih kelompok utama seperti Parkit, Lovebird, Nuri, atau Conure. Pilihan ini dapat diubah kembali saat produk diedit.</span>
          {errors.category_id ? <span className="text-xs font-normal text-danger">{errors.category_id.message}</span> : null}
        </label>
        <FormField label="Harga" type="number" error={errors.price?.message} {...register("price", { valueAsNumber: true })} />
        <label className="grid gap-2 text-sm font-bold">
          Jenis stok
          <select className={selectClassName} {...register("inventory_type")}>
            <option value="INDIVIDUAL">Satu ekor</option>
            <option value="QUANTITY">Beberapa ekor</option>
          </select>
        </label>
        <FormField label="Jumlah stok" type="number" error={errors.stock?.message} {...register("stock", { valueAsNumber: true })} />
        <label className="grid gap-2 text-sm font-bold">
          Status ketersediaan
          <select className={selectClassName} {...register("status")}>
            <option value="AVAILABLE">Tersedia</option>
            <option value="RESERVED">Dipesan</option>
            <option value="SOLD">Terjual</option>
            <option value="UNAVAILABLE">Tidak tersedia</option>
          </select>
        </label>
        <FormField label="Usia" type="number" {...register("age_value", { valueAsNumber: true })} />
        <label className="grid gap-2 text-sm font-bold">
          Satuan usia
          <select className={selectClassName} {...register("age_unit")}>
            <option value="DAYS">Hari</option>
            <option value="WEEKS">Minggu</option>
            <option value="MONTHS">Bulan</option>
            <option value="YEARS">Tahun</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm font-bold">
          Jenis kelamin
          <select className={selectClassName} {...register("gender")}>
            <option value="UNKNOWN">Belum diketahui</option>
            <option value="MALE">Jantan</option>
            <option value="FEMALE">Betina</option>
          </select>
        </label>
        <FormField label="Warna" {...register("color")} />
        <FormField label="Karakter" placeholder="Contoh: Jinak atau ramah" {...register("tame_status")} />
        <TextAreaField label="Deskripsi" className="sm:col-span-2" {...register("description")} />
        <label className="flex items-center gap-3 text-sm font-bold sm:col-span-2">
          <input type="checkbox" className="size-4 accent-deep-forest" {...register("featured")} />
          Tampilkan sebagai pilihan utama di beranda
        </label>
      </div>

      <div className="grid gap-6 rounded-[var(--radius-md)] border border-line bg-off-white p-5 sm:grid-cols-[180px_1fr] sm:p-6">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-sm)] bg-warm-cream">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt="Pratinjau foto katalog"
              fill
              sizes="180px"
              className="object-cover"
            />
          ) : (
            <div className="grid h-full place-items-center px-5 text-center text-xs leading-5 text-muted-text">
              Pratinjau foto katalog
            </div>
          )}
        </div>

        <div className="self-center">
          <p className="text-sm font-bold text-main-text">Foto utama katalog</p>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-text">
            Gunakan JPG, PNG, atau WebP maksimal 5 MB. Foto akan disesuaikan otomatis ke rasio 4:5 dan disimpan sebagai WebP 1200 × 1500 piksel agar seluruh katalog terlihat seragam.
          </p>
          <label className="mt-5 inline-flex min-h-11 cursor-pointer items-center gap-3 rounded-full border border-deep-forest px-5 text-sm font-bold text-deep-forest transition hover:bg-warm-cream">
            {uploading ? <LoaderCircle className="animate-spin" size={18} /> : <Upload size={18} />}
            {uploading ? "Memproses foto…" : imageUrl ? "Ganti foto" : "Unggah foto"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              disabled={uploading}
              onChange={(event) => upload(event.target.files?.[0])}
            />
          </label>
          {imageUrl ? (
            <p className="mt-3 text-sm text-success" role="status">
              Foto siap digunakan dan tampil sesuai pratinjau.
            </p>
          ) : null}
        </div>
      </div>

      {message ? <p className="text-sm text-danger">{message}</p> : null}
      <Button type="submit" disabled={isSubmitting || uploading} className="w-fit">
        {isSubmitting ? <LoaderCircle className="animate-spin" size={17} /> : <Save size={17} />}
        Simpan burung
      </Button>
    </form>
  );
}
