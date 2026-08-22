import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function NotFound() {
  return (
    <Container className="flex min-h-dvh flex-col items-start justify-center py-24">
      <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">404</p>
      <h1 className="mt-4 text-4xl tracking-[-0.04em]">This page does not exist.</h1>
      <p className="mt-3 text-muted">Return to the homepage and continue from there.</p>
      <div className="mt-8">
        <ButtonLink href="/">Back home</ButtonLink>
      </div>
    </Container>
  );
}
