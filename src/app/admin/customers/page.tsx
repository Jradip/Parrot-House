import { AdminHeading } from "@/components/admin/admin-heading";
import { DataTable } from "@/components/admin/data-table";
import { createAdminClient } from "@/lib/supabase/admin";
import { getRoleLabel } from "@/lib/status-labels";
export default async function AdminCustomersPage(){const{data}=await createAdminClient().from("profiles").select("id,full_name,email,phone,role,created_at").order("created_at",{ascending:false});return <><AdminHeading title="Pelanggan" description="Data akun pelanggan. Halaman ini hanya dapat diakses oleh admin."/><DataTable headers={["Nama","Email","WhatsApp","Peran","Bergabung"]}>{data?.map((item)=><tr key={item.id} className="border-t border-line"><td className="p-4 font-bold">{item.full_name||"—"}</td><td>{item.email}</td><td>{item.phone||"—"}</td><td>{getRoleLabel(item.role)}</td><td>{new Intl.DateTimeFormat("id-ID").format(new Date(item.created_at))}</td></tr>)}</DataTable></>}
