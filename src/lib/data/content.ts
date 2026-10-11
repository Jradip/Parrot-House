import "server-only";
import { hasSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { aboutContentSchema, defaultAboutContent } from "@/lib/validation/site-content";

export async function getAboutContent() {
  if (!hasSupabaseEnv) return defaultAboutContent;
  const supabase = await createClient();
  const { data } = await supabase.from("site_settings").select("value").eq("key", "about_page").eq("public", true).maybeSingle();
  const parsed = aboutContentSchema.safeParse(data?.value);
  if (!parsed.success) return defaultAboutContent;
  return parsed.data.eyebrow === "About Parrot House"
    ? { ...parsed.data, eyebrow: "Tentang Parrot House" }
    : parsed.data;
}
