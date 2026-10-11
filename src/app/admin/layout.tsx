import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { requireAdmin } from "@/lib/auth/guards";

export const dynamic="force-dynamic";
export default async function AdminLayout({children}:{children:React.ReactNode}){await requireAdmin();return <div className="min-h-screen bg-soft-background lg:grid lg:grid-cols-[16rem_1fr]"><AdminSidebar/><main className="mx-auto w-full min-w-0 max-w-[1600px] p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12">{children}</main></div>}
