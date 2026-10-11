import { AdminHeading } from "@/components/admin/admin-heading";
import { CategoryManager } from "@/components/admin/category-manager";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function CategoriesPage() {
  const { data } = await createAdminClient().from("bird_categories").select("id,name,description,active,sort_order").order("sort_order");
  return <><AdminHeading title="Kategori" description="Kelola kelompok utama seperti Parkit, Lovebird, Nuri, dan Conure. Nama serta deskripsinya tampil pada halaman koleksi." /><CategoryManager categories={data ?? []} /></>;
}
