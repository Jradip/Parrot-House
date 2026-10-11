"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, LoaderCircle, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { createClient } from "@/lib/supabase/client";

const profileSchema = z.object({
  fullName: z.string().trim().min(2, "Nama minimal 2 karakter.").max(100, "Nama terlalu panjang."),
  phone: z.string().trim().min(9, "Nomor WhatsApp belum lengkap.").max(20, "Nomor WhatsApp terlalu panjang.").regex(/^[0-9+\s-]+$/, "Nomor WhatsApp belum valid."),
});

const passwordSchema = z.object({
  password: z.string().min(8, "Kata sandi minimal 8 karakter.").max(72, "Kata sandi terlalu panjang."),
  confirmation: z.string(),
}).refine((value) => value.password === value.confirmation, {
  message: "Konfirmasi kata sandi belum sama.",
  path: ["confirmation"],
});

type ProfileValues = z.infer<typeof profileSchema>;
type PasswordValues = z.infer<typeof passwordSchema>;

export function AccountSettingsForm({ userId, email, fullName, phone }: { userId: string; email: string; fullName: string; phone: string }) {
  const router = useRouter();
  const [profileMessage, setProfileMessage] = useState<string>();
  const [profileError, setProfileError] = useState<string>();
  const [passwordMessage, setPasswordMessage] = useState<string>();
  const [passwordError, setPasswordError] = useState<string>();

  const profileForm = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { fullName, phone },
  });
  const passwordForm = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: "", confirmation: "" },
  });

  const saveProfile = async (values: ProfileValues) => {
    setProfileMessage(undefined);
    setProfileError(undefined);
    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: values.fullName, phone: values.phone })
      .eq("id", userId);

    if (error) {
      setProfileError("Nama dan nomor WhatsApp belum dapat disimpan.");
      return;
    }

    await supabase.auth.updateUser({ data: { full_name: values.fullName } });
    setProfileMessage("Informasi akun berhasil diperbarui.");
    router.refresh();
  };

  const savePassword = async (values: PasswordValues) => {
    setPasswordMessage(undefined);
    setPasswordError(undefined);
    const { error } = await createClient().auth.updateUser({ password: values.password });
    if (error) {
      setPasswordError("Kata sandi belum dapat diperbarui. Silakan masuk kembali lalu coba lagi.");
      return;
    }
    passwordForm.reset();
    setPasswordMessage("Kata sandi berhasil diperbarui.");
  };

  return (
    <div className="grid gap-8 xl:grid-cols-2">
      <form onSubmit={profileForm.handleSubmit(saveProfile)} className="rounded-[var(--radius-md)] bg-off-white p-6" noValidate>
        <p className="section-kicker">Informasi pribadi</p>
        <h2 className="mt-2 font-serif text-3xl">Nama dan kontak</h2>
        <div className="mt-6 grid gap-5">
          <FormField label="Nama lengkap" error={profileForm.formState.errors.fullName?.message} {...profileForm.register("fullName")} />
          <FormField label="Email" type="email" value={email} disabled readOnly />
          <FormField label="Nomor WhatsApp" inputMode="tel" placeholder="08xxxxxxxxxx" error={profileForm.formState.errors.phone?.message} {...profileForm.register("phone")} />
        </div>
        {profileError ? <p role="alert" className="mt-4 rounded-lg bg-danger/10 p-3 text-sm text-danger">{profileError}</p> : null}
        {profileMessage ? <p role="status" className="mt-4 rounded-lg bg-success/10 p-3 text-sm text-success">{profileMessage}</p> : null}
        <Button type="submit" disabled={profileForm.formState.isSubmitting} className="mt-6">
          {profileForm.formState.isSubmitting ? <LoaderCircle className="animate-spin" size={17} /> : <Save size={17} />}
          Simpan informasi
        </Button>
      </form>

      <form onSubmit={passwordForm.handleSubmit(savePassword)} className="rounded-[var(--radius-md)] bg-warm-cream p-6" noValidate>
        <p className="section-kicker">Keamanan akun</p>
        <h2 className="mt-2 font-serif text-3xl">Ubah kata sandi</h2>
        <p className="mt-3 text-sm leading-6 text-muted-text">Gunakan minimal delapan karakter yang tidak mudah ditebak.</p>
        <div className="mt-6 grid gap-5">
          <FormField label="Kata sandi baru" type="password" autoComplete="new-password" error={passwordForm.formState.errors.password?.message} {...passwordForm.register("password")} />
          <FormField label="Ulangi kata sandi baru" type="password" autoComplete="new-password" error={passwordForm.formState.errors.confirmation?.message} {...passwordForm.register("confirmation")} />
        </div>
        {passwordError ? <p role="alert" className="mt-4 rounded-lg bg-danger/10 p-3 text-sm text-danger">{passwordError}</p> : null}
        {passwordMessage ? <p role="status" className="mt-4 rounded-lg bg-success/10 p-3 text-sm text-success">{passwordMessage}</p> : null}
        <Button type="submit" disabled={passwordForm.formState.isSubmitting} className="mt-6">
          {passwordForm.formState.isSubmitting ? <LoaderCircle className="animate-spin" size={17} /> : <KeyRound size={17} />}
          Ubah kata sandi
        </Button>
      </form>
    </div>
  );
}
