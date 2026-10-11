"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { hasSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/client";

type Mode = "login" | "register" | "forgot" | "reset";
const schema = z.object({ fullName: z.string().optional(), email: z.string().email("Masukkan alamat email yang valid."), password: z.string().optional() });
type Values = z.infer<typeof schema>;

export function AuthForm({ mode, next = "/account" }: { mode: Mode; next?: string }) {
  const router = useRouter();
  const [message, setMessage] = useState<string>();
  const [error, setError] = useState<string>();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { fullName: "", email: "", password: "" } });

  const submit = async (values: Values) => {
    setError(undefined); setMessage(undefined);
    if (!hasSupabaseEnv) { setError("Supabase belum dikonfigurasi. Lengkapi .env.local untuk menguji autentikasi."); return; }
    if ((mode === "login" || mode === "register" || mode === "reset") && (!values.password || values.password.length < 8)) { setError("Kata sandi minimal 8 karakter."); return; }
    const supabase = createClient();
    if (mode === "login") {
      const { error: authError } = await supabase.auth.signInWithPassword({ email: values.email, password: values.password! });
      if (authError) return setError("Email atau kata sandi tidak sesuai.");
      const { data: userData } = await supabase.auth.getUser();
      const { data: profile } = userData.user
        ? await supabase.from("profiles").select("role").eq("id", userData.user.id).single()
        : { data: null };
      if (profile?.role === "ADMIN") {
        router.replace("/admin");
        router.refresh();
        return;
      }
      router.replace(next.startsWith("/") && !next.startsWith("//") ? next : "/account");
      router.refresh();
    } else if (mode === "register") {
      if (!values.fullName || values.fullName.length < 2) return setError("Nama minimal 2 karakter.");
      const { data, error: authError } = await supabase.auth.signUp({ email: values.email, password: values.password!, options: { data: { full_name: values.fullName }, emailRedirectTo: `${window.location.origin}/auth/callback` } });
      if (authError) return setError(authError.message);
      if (data.session) {
        router.push(next.startsWith("/") && !next.startsWith("//") ? next : "/account");
        router.refresh();
        return;
      }
      setMessage("Akun dibuat. Periksa email Anda jika konfirmasi email diaktifkan.");
    } else if (mode === "forgot") {
      const { error: authError } = await supabase.auth.resetPasswordForEmail(values.email, { redirectTo: `${window.location.origin}/auth/callback?next=/reset-password` });
      if (authError) return setError(authError.message);
      setMessage("Tautan untuk mengatur ulang kata sandi telah dikirim jika email terdaftar.");
    } else {
      const { error: authError } = await supabase.auth.updateUser({ password: values.password! });
      if (authError) return setError(authError.message);
      setMessage("Kata sandi berhasil diperbarui. Anda dapat kembali ke akun.");
    }
  };

  return <form onSubmit={handleSubmit(submit)} className="mt-8 grid gap-5" noValidate>{mode === "register" ? <FormField label="Nama lengkap" autoComplete="name" error={errors.fullName?.message} {...register("fullName")} /> : null}<FormField label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register("email")} />{mode !== "forgot" ? <FormField label={mode === "reset" ? "Kata sandi baru" : "Kata sandi"} type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} error={errors.password?.message} {...register("password")} /> : null}{error ? <p role="alert" className="rounded-lg bg-danger/10 p-3 text-sm leading-6 text-danger">{error}</p> : null}{message ? <p role="status" className="rounded-lg bg-success/10 p-3 text-sm leading-6 text-success">{message}</p> : null}<Button type="submit" disabled={isSubmitting}>{isSubmitting ? <LoaderCircle className="animate-spin" size={17} /> : <ArrowRight size={17} />}{mode === "login" ? "Masuk" : mode === "register" ? "Buat akun" : mode === "forgot" ? "Kirim tautan pemulihan" : "Simpan kata sandi"}</Button></form>;
}
