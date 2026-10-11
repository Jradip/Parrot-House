import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { AuthForm } from "@/components/forms/auth-form";

export default function ResetPasswordPage() { return <AuthShell eyebrow="Amankan akun Anda" title="Buat kata sandi baru." description="Gunakan minimal delapan karakter yang tidak mudah ditebak." footer={<Link href="/login" className="font-bold text-deep-forest">Kembali ke halaman masuk</Link>}><AuthForm mode="reset" /></AuthShell>; }
