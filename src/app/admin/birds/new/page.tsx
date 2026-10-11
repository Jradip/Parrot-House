import { AdminHeading } from "@/components/admin/admin-heading";
import { BirdForm } from "@/components/admin/bird-form";
import { createAdminClient } from "@/lib/supabase/admin";
export default async function NewBirdPage(){const {data}=await createAdminClient().from("bird_categories").select("id,name").eq("active",true).order("sort_order");return <><AdminHeading title="Tambah burung" description="Tambahkan produk burung dan pilih kategori induk yang sesuai."/><BirdForm categories={data??[]}/></>}
