import { Brand } from "@/components/layout/brand";
import { Container } from "@/components/ui/container";

export function SiteFooter() {
  return (
    <footer className="border-t border-soft-green/20 bg-forest-strong text-off-white">
      <Container className="py-4">
        <div className="flex items-center justify-between gap-4 sm:grid sm:grid-cols-[1fr_auto_1fr]">
          <div className="justify-self-start"><Brand inverse compact /></div>
          <p className="text-[10px] text-off-white/55 sm:justify-self-center sm:text-xs">© 2026 Parrot House</p>
          <span className="hidden sm:block" aria-hidden="true" />
        </div>
      </Container>
    </footer>
  );
}
