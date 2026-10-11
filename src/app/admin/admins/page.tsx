import { AdminAccountForm } from "@/components/admin/admin-account-form";
import { AdminHeading } from "@/components/admin/admin-heading";
import { DataTable } from "@/components/admin/data-table";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function AdminAccountsPage() {
  const { data } = await createAdminClient()
    .from("profiles")
    .select("id,full_name,email,created_at")
    .eq("role", "ADMIN")
    .order("created_at", { ascending: true });

  return (
    <>
      <AdminHeading
        title="Kelola Admin"
        description="Buat akun admin baru dan lihat siapa saja yang memiliki akses ke ruang admin. Kata sandi hanya digunakan saat pembuatan akun dan tidak ditampilkan kembali."
      />
      <AdminAccountForm />
      <DataTable headers={["Nama", "Email", "Dibuat"]} empty="Belum ada akun admin.">
        {data?.map((admin) => (
          <tr key={admin.id} className="border-t border-line">
            <td className="p-4 font-bold">{admin.full_name || "Belum diisi"}</td>
            <td className="p-4">{admin.email}</td>
            <td className="p-4">{new Intl.DateTimeFormat("id-ID").format(new Date(admin.created_at))}</td>
          </tr>
        ))}
      </DataTable>
    </>
  );
}
