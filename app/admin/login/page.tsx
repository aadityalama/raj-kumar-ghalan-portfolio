import { LoginForm } from "@/app/admin/_components/login-form";
import { hasSupabaseEnv } from "@/lib/supabase/env";

export default function AdminLoginPage() {
  const configured = hasSupabaseEnv();

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-5">
      <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">Admin</p>
      <h1 className="mt-4 text-4xl tracking-[-0.04em]">Sign in</h1>
      <p className="mt-3 text-sm text-muted">
        Only the designated admin account can manage this portfolio.
      </p>
      {!configured ? (
        <p className="admin-notice mt-8 text-sm text-muted">
          Add NEXT_PUBLIC_SUPABASE_URL and the public anon or publishable key from this
          portfolio’s Supabase project before signing in. Admin access is limited to the
          server-only ADMIN_EMAIL account.
        </p>
      ) : (
        <LoginForm />
      )}
    </main>
  );
}
