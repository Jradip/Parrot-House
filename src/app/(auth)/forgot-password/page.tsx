import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { AuthForm } from "@/components/forms/auth-form";

export default function ForgotPasswordPage() { return <AuthShell eyebrow="Pemulihan akun" title="Atur ulang kata sandi." description="Masukkan email akun Anda untuk menerima tautan pemulihan." footer={<Link href="/login" className="font-bold text-deep-forest">Kembali ke halaman masuk</Link>}><AuthForm mode="forgot" /></AuthShell>; }
