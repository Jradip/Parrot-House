import { LogoutButton } from "@/components/account/logout-button";
import { AccountNavigation } from "@/components/account/account-navigation";
import { Container } from "@/components/ui/container";
import { requireCustomer } from "@/lib/auth/guards";

export const dynamic = "force-dynamic";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  await requireCustomer();

  return (
    <Container className="py-8 sm:py-10 lg:py-14">
      <div className="mb-8 flex flex-col gap-6 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="section-kicker">Akun pelanggan</p>
          <h1 className="mt-2 font-serif text-4xl font-medium sm:text-5xl">Akun saya</h1>
        </div>
        <LogoutButton />
      </div>
      <div className="grid min-w-0 gap-7 sm:gap-8 lg:grid-cols-[13rem_1fr] lg:gap-12">
        <AccountNavigation />
        <div className="min-w-0">{children}</div>
      </div>
    </Container>
  );
}
