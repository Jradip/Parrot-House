"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import {
  createAdminAccountSchema,
  type CreateAdminAccountInput,
} from "@/lib/validation/admin-account";

export function AdminAccountForm() {
  const router = useRouter();
  const [message, setMessage] = useState<string>();
  const [serverError, setServerError] = useState<string>();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateAdminAccountInput>({
    resolver: zodResolver(createAdminAccountSchema),
    defaultValues: { fullName: "", email: "", password: "" },
  });

  const submit = async (values: CreateAdminAccountInput) => {
    setMessage(undefined);
    setServerError(undefined);
    const response = await fetch("/api/admin/admins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const result = await response.json() as { error?: string; email?: string };

    if (!response.ok) {
      setServerError(result.error ?? "Akun admin belum dapat dibuat.");
      return;
    }

    reset();
    setMessage(`Admin ${result.email ?? values.email} berhasil dibuat.`);
    router.refresh();
  };

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="mb-8 grid gap-4 rounded-[var(--radius-md)] bg-warm-cream p-5 md:grid-cols-3"
      noValidate
    >
      <FormField label="Nama lengkap" autoComplete="name" error={errors.fullName?.message} {...register("fullName")} />
      <FormField label="Email admin" type="email" autoComplete="email" error={errors.email?.message} {...register("email")} />
      <FormField label="Kata sandi sementara" type="password" autoComplete="new-password" error={errors.password?.message} {...register("password")} />
      <div className="flex flex-wrap items-center gap-4 md:col-span-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <LoaderCircle className="animate-spin" size={17} /> : <UserPlus size={17} />}
          Tambah admin
        </Button>
        {serverError ? <p role="alert" className="text-sm font-medium text-danger">{serverError}</p> : null}
        {message ? <p role="status" className="text-sm font-medium text-success">{message}</p> : null}
      </div>
    </form>
  );
}
