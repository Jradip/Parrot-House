import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/guards";
import { createSlug } from "@/lib/slug";
import { createAdminClient } from "@/lib/supabase/admin";
const schema=z.object({id:z.string().uuid().optional(),name:z.string().min(2),description:z.string().optional(),sort_order:z.number().int().nonnegative(),active:z.boolean().default(true)});
export async function POST(request:Request){try{await requireAdmin();const input=schema.parse(await request.json());const slug=`${createSlug(input.name)}-${crypto.randomUUID().slice(0,8)}`;const{data,error}=await createAdminClient().from("bird_categories").insert({...input,slug}).select("id").single();if(error)return NextResponse.json({error:"Kategori belum dapat disimpan."},{status:400});return NextResponse.json(data);}catch(error){return NextResponse.json({error:error instanceof z.ZodError?"Data kategori belum valid.":"Kategori belum dapat disimpan."},{status:400});}}
export async function PATCH(request:Request){try{await requireAdmin();const input=schema.parse(await request.json());if(!input.id)return NextResponse.json({error:"ID kategori wajib diisi."},{status:400});const{id,...values}=input;const{error}=await createAdminClient().from("bird_categories").update(values).eq("id",id);if(error)throw error;return NextResponse.json({updated:true});}catch(error){return NextResponse.json({error:error instanceof z.ZodError?"Data kategori belum valid.":"Kategori belum dapat diperbarui."},{status:400});}}
