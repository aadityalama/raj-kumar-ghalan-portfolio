"use client";

import { useActionState } from "react";
import { loginAction } from "@/lib/cms/actions";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string }, formData: FormData) => {
      const result = await loginAction(formData);
      return result ?? {};
    },
    {} as { error?: string },
  );

  return (
    <form action={formAction} className="mt-8 grid gap-4">
      <label className="grid gap-2 text-sm">
        Email
        <input className="admin-input" type="email" name="email" required autoComplete="username" />
      </label>
      <label className="grid gap-2 text-sm">
        Password
        <input className="admin-input" type="password" name="password" required autoComplete="current-password" />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-12 items-center justify-center rounded-full bg-accent text-sm font-medium text-[#04110c] disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Continue"}
      </button>
      {state?.error ? <p className="text-sm text-red-400">{state.error}</p> : null}
    </form>
  );
}
