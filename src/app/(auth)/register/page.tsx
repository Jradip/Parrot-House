import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { AuthForm } from "@/components/forms/auth-form";

export default function RegisterPage() { return <AuthShell eyebrow="Buat akun" title="Mulai ruang pribadi Anda." description="Simpan alamat, lanjutkan pemesanan, dan lihat perjalanan pesanan." footer={<>Sudah punya akun? <Link href="/login" className="font-bold text-deep-forest">Masuk</Link></>}><AuthForm mode="register" /></AuthShell>; }
