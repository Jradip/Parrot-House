"use client";

import { LoaderCircle, Plus, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";

type Category = { id: string; name: string; description: string | null; active: boolean; sort_order: number };

export function CategoryManager({ categories }: { categories: Category[] }) {
  return <div className="grid gap-8"><CreateCategory />{categories.length ? <div className="grid gap-3">{categories.map((category) => <CategoryEditor key={category.id} category={category} />)}</div> : <p className="rounded-[var(--radius-md)] bg-off-white p-8 text-muted-text">Belum ada kategori.</p>}</div>;
}

function CreateCategory() {
  const router = useRouter(); const [message, setMessage] = useState<string>(); const [busy, setBusy] = useState(false);
  return <form onSubmit={async(event) => { event.preventDefault(); setBusy(true); setMessage(undefined); const form = event.currentTarget; const data = new FormData(form); const response = await fetch("/api/admin/categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: data.get("name"), description: data.get("description"), sort_order: Number(data.get("sort_order")), active: true }) }); const result = await response.json() as { error?: string }; setBusy(false); if (!response.ok) return setMessage(result.error); form.reset(); setMessage("Kategori ditambahkan."); router.refresh(); }} className="grid gap-4 rounded-[var(--radius-md)] bg-warm-cream p-5 md:grid-cols-3">
    <FormField label="Nama kategori" name="name" required /><FormField label="Deskripsi" name="description" /><FormField label="Urutan tampilan" name="sort_order" type="number" defaultValue="0" />
    <div className="flex items-center gap-4 md:col-span-3"><Button disabled={busy}>{busy ? <LoaderCircle className="animate-spin" size={16} /> : <Plus size={16} />} Tambah kategori</Button>{message ? <span className="text-sm text-muted-text">{message}</span> : null}</div>
  </form>;
}

function CategoryEditor({ category }: { category: Category }) {
  const router = useRouter(); const [message, setMessage] = useState<string>(); const [busy, setBusy] = useState(false);
  return <form onSubmit={async(event) => { event.preventDefault(); setBusy(true); setMessage(undefined); const data = new FormData(event.currentTarget); const response = await fetch("/api/admin/categories", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: category.id, name: data.get("name"), description: data.get("description"), sort_order: Number(data.get("sort_order")), active: data.get("active") === "on" }) }); const result = await response.json() as { error?: string }; setBusy(false); if (!response.ok) return setMessage(result.error); setMessage("Perubahan disimpan."); router.refresh(); }} className="grid gap-4 rounded-[var(--radius-md)] border border-line bg-off-white p-5 md:grid-cols-[1fr_2fr_8rem_auto] md:items-end">
    <FormField label="Nama" name="name" defaultValue={category.name} required /><FormField label="Deskripsi" name="description" defaultValue={category.description ?? ""} /><FormField label="Urutan tampilan" name="sort_order" type="number" defaultValue={String(category.sort_order)} />
    <div className="flex flex-wrap items-center gap-3 pb-1"><label className="inline-flex items-center gap-2 text-sm font-bold"><input name="active" type="checkbox" defaultChecked={category.active} className="size-4 accent-deep-forest" />Aktif</label><Button disabled={busy} variant="secondary">{busy ? <LoaderCircle className="animate-spin" size={15} /> : <Save size={15} />} Simpan</Button></div>
    {message ? <p className="text-xs text-muted-text md:col-span-4">{message}</p> : null}
  </form>;
}
