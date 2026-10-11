"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Save } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { FormField, TextAreaField } from "@/components/ui/form-field";
import type { AboutContent } from "@/lib/validation/site-content";

const editorSchema = z.object({
  eyebrow: z.string().min(2, "Label wajib diisi."),
  title: z.string().min(5, "Judul terlalu pendek."),
  description: z.string().min(10, "Deskripsi terlalu pendek."),
  sectionTitle: z.string().min(3, "Judul bagian wajib diisi."),
  paragraphsText: z.string().min(10, "Isi informasi wajib diisi."),
  highlightsText: z.string(),
});
type EditorValues = z.infer<typeof editorSchema>;

export function AboutContentForm({ initial }: { initial: AboutContent }) {
  const [message, setMessage] = useState<string>(); const [serverError, setServerError] = useState<string>();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<EditorValues>({ resolver: zodResolver(editorSchema), defaultValues: { eyebrow: initial.eyebrow, title: initial.title, description: initial.description, sectionTitle: initial.sectionTitle, paragraphsText: initial.paragraphs.join("\n\n"), highlightsText: initial.highlights.join("\n") } });
  const submit = async (values: EditorValues) => { setMessage(undefined); setServerError(undefined); const payload = { eyebrow: values.eyebrow, title: values.title, description: values.description, sectionTitle: values.sectionTitle, paragraphs: values.paragraphsText.split(/\n\s*\n/).map((item) => item.trim()).filter(Boolean), highlights: values.highlightsText.split("\n").map((item) => item.trim()).filter(Boolean) }; const response = await fetch("/api/admin/content", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }); const result = await response.json() as { error?: string }; if (!response.ok) return setServerError(result.error ?? "Konten belum dapat disimpan."); setMessage("Konten Tentang berhasil diperbarui."); };
  return <form onSubmit={handleSubmit(submit)} className="grid gap-6 rounded-[var(--radius-md)] bg-off-white p-6" noValidate>
    <div className="grid gap-5 md:grid-cols-2"><FormField label="Label kecil" error={errors.eyebrow?.message} {...register("eyebrow")} /><FormField label="Judul bagian informasi" error={errors.sectionTitle?.message} {...register("sectionTitle")} /></div>
    <FormField label="Judul utama" error={errors.title?.message} {...register("title")} />
    <TextAreaField label="Deskripsi pembuka" error={errors.description?.message} {...register("description")} />
    <TextAreaField label="Isi informasi" error={errors.paragraphsText?.message} {...register("paragraphsText")} /><p className="-mt-4 text-xs text-muted-text">Pisahkan paragraf dengan satu baris kosong.</p>
    <TextAreaField label="Informasi tambahan" error={errors.highlightsText?.message} {...register("highlightsText")} /><p className="-mt-4 text-xs text-muted-text">Tulis satu informasi per baris. Baris baru akan menjadi poin baru.</p>
    {serverError ? <p role="alert" className="rounded-lg bg-danger/10 p-3 text-sm text-danger">{serverError}</p> : null}{message ? <p role="status" className="rounded-lg bg-success/10 p-3 text-sm text-success">{message}</p> : null}
    <Button type="submit" disabled={isSubmitting} className="w-fit">{isSubmitting ? <LoaderCircle className="animate-spin" size={17} /> : <Save size={17} />} Simpan konten</Button>
  </form>;
}
