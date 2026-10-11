import { AccountSettingsForm } from "@/components/account/account-settings-form";
import { requireUser } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";

export default async function AccountSettingsPage() {
  const user = await requireUser();
  const supabase = await createClient();
  const { data } = await supabase.from("profiles").select("full_name,email,phone").eq("id", user.id).single();

  return (
    <div>
      <h2 className="font-serif text-4xl font-medium">Pengaturan akun</h2>
      <p className="mt-3 text-muted-text">Perbarui nama, nomor WhatsApp, atau kata sandi akun Anda.</p>
      <div className="mt-8">
        <AccountSettingsForm
          userId={user.id}
          email={data?.email ?? ""}
          fullName={data?.full_name ?? ""}
          phone={data?.phone ?? ""}
        />
      </div>
    </div>
  );
}
