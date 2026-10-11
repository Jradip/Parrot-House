import { NextResponse } from "next/server";
import { hasSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  if (!hasSupabaseEnv) return NextResponse.json({ zones: [], setupRequired: true });
  const supabase = await createClient();
  const { data, error } = await supabase.from("shipping_zones").select("id,name,province,city,area,shipping_method,price,notes").eq("active", true).order("province");
  if (error) return NextResponse.json({ error: "Zona pengiriman belum dapat dimuat." }, { status: 500 });
  return NextResponse.json({ zones: data });
}
