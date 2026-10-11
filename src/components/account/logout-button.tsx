"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { clearStoredCarts } from "@/components/cart/cart-provider";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export function LogoutButton({ inverse = false }: { inverse?: boolean }) { const router = useRouter(); return <button onClick={async () => { clearStoredCarts(); await createClient().auth.signOut(); router.replace("/"); router.refresh(); }} className={cn("inline-flex items-center gap-2 text-sm font-bold transition", inverse ? "text-off-white/75 hover:text-off-white" : "text-muted-text hover:text-danger")}><LogOut size={16} /> Keluar</button>; }
