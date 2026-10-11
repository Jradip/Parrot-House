import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/admin";
const schema=z.object({name:z.string().min(2),province:z.string().min(2),city:z.string().optional(),shipping_method:z.string().min(2),price:z.number().int().nonnegative(),notes:z.string().optional()});
export async function POST(request:Request){try{await requireAdmin();const input=schema.parse(await request.json());const{data,error}=await createAdminClient().from("shipping_zones").insert(input).select("id").single();if(error)return NextResponse.json({error:error.message},{status:400});return NextResponse.json(data);}catch(error){return NextResponse.json({error:error instanceof z.ZodError?"Data pengiriman belum valid.":"Zona belum dapat disimpan."},{status:400});}}
