"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { saveSkillAction } from "@/lib/cms/actions";

type ActionResult = { error?: string; ok?: boolean };

/**
 * Skills save form that binds the row id into the Server Action and wires
 * useActionState directly (same pattern as login). Avoids relying only on a
 * hidden id field through ActionForm's client wrapper, which can miss the id
 * and silently insert instead of update.
 */
export function SkillActionForm({
  skillId = null,
  children,
  className,
  submitLabel = "Save",
}: {
  skillId?: string | null;
  children: React.ReactNode;
  className?: string;
  submitLabel?: string;
}) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const boundAction = saveSkillAction.bind(null, skillId);
  const [state, formAction, pending] = useActionState(boundAction, {} as ActionResult);

  useEffect(() => {
    if (state?.ok) router.refresh();
  }, [router, state?.ok]);

  return (
    <form
      action={formAction}
      className={className}
      onSubmit={(event) => {
        const data = new FormData(event.currentTarget);
        const hasFile = [...data.values()].some((value) => value instanceof File && value.size > 0);
        setUploading(hasFile);
      }}
    >
      {children}
      <button
        type="submit"
        disabled={pending}
        className="mt-4 inline-flex min-h-11 items-center rounded-full bg-accent px-5 text-sm font-medium text-[#04110c] disabled:opacity-60"
      >
        {pending ? (uploading ? "Uploading…" : "Saving…") : submitLabel}
      </button>
      {pending && uploading ? (
        <p className="mt-3 text-sm text-muted">Upload in progress. Keep this page open.</p>
      ) : null}
      {state?.error ? (
        <p className="mt-3 text-sm text-red-400" role="alert">
          {state.error}
        </p>
      ) : null}
      {state?.ok ? (
        <p className="mt-3 text-sm text-accent" role="status">
          Saved.
        </p>
      ) : null}
    </form>
  );
}
