import { CartProvider } from "@/components/cart/cart-provider";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getSessionRole } from "@/lib/auth/guards";

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const session = await getSessionRole();
  const customerId = session?.role === "CUSTOMER" ? session.id : null;
  return (
    <CartProvider userId={customerId}>
      <div className="flex min-h-screen flex-col">
        <SiteHeader userRole={session?.role ?? null} />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </div>
    </CartProvider>
  );
}
