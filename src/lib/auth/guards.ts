import { redirect } from "next/navigation";
import { hasSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export async function requireUser() {
  if (!hasSupabaseEnv) redirect("/login?reason=setup");
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const subject = data?.claims?.sub;
  if (error || !subject) redirect("/login?next=/account");
  return { id: subject, claims: data.claims };
}

export type UserRole = "CUSTOMER" | "ADMIN";

export async function getSessionRole(): Promise<{ id: string; role: UserRole } | null> {
  if (!hasSupabaseEnv) return null;
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const id = data?.claims?.sub;
  if (error || !id) return null;
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", id).single();
  return { id, role: profile?.role === "ADMIN" ? "ADMIN" : "CUSTOMER" };
}

export async function requireCustomer() {
  const user = await requireUser();
  const supabase = await createClient();
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role === "ADMIN") redirect("/admin");
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  const supabase = await createClient();
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "ADMIN") redirect("/account?reason=forbidden");
  return user;
}
