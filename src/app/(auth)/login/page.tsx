import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { AuthForm } from "@/components/forms/auth-form";
import { getSessionRole } from "@/lib/auth/guards";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; reason?: string; intent?: string }> }) {
  const query = await searchParams;
  const session = await getSessionRole();

  if (session?.role === "ADMIN") redirect("/admin");
  if (session?.role === "CUSTOMER") {
    redirect(query.next?.startsWith("/") && !query.next.startsWith("//") ? query.next : "/account");
  }

  const description = query.reason === "setup"
    ? "Supabase perlu dikonfigurasi sebelum akun dapat diuji."
    : query.intent === "cart"
      ? "Silakan masuk terlebih dahulu untuk menambahkan burung ke keranjang."
      : "Lanjutkan pemesanan atau pantau pesanan melalui ruang pribadi Anda.";

  return (
    <AuthShell
      eyebrow="Selamat datang kembali"
      title="Masuk ke akun Anda."
      description={description}
      footer={<>Belum punya akun? <Link href="/register" className="font-bold text-deep-forest">Daftar sekarang</Link> · <Link href="/forgot-password" className="font-bold text-deep-forest">Lupa kata sandi</Link></>}
    >
      <AuthForm mode="login" next={query.next} />
    </AuthShell>
  );
}
