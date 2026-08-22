"use client";

import { useActionState, useState } from "react";

type ActionResult = { error?: string; ok?: boolean } | void;

export function ActionForm({
  action,
  children,
  className,
  submitLabel = "Save",
}: {
  action: (formData: FormData) => Promise<ActionResult>;
  children: React.ReactNode;
  className?: string;
  submitLabel?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string; ok?: boolean }, formData: FormData) => {
      const result = await action(formData);
      return result ?? {};
    },
    {} as { error?: string; ok?: boolean },
  );

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
      {state?.error ? <p className="mt-3 text-sm text-red-400">{state.error}</p> : null}
      {state?.ok ? <p className="mt-3 text-sm text-accent">Saved.</p> : null}
    </form>
  );
}

export function ConfirmForm({
  action,
  children,
  label,
  message = "Delete this item? This cannot be undone.",
}: {
  action: (formData: FormData) => Promise<ActionResult>;
  children?: React.ReactNode;
  label: string;
  message?: string;
}) {
  return (
    <form
      action={async (formData) => {
        if (!window.confirm(message)) return;
        await action(formData);
      }}
    >
      {children}
      <button type="submit" className="text-sm text-red-400 hover:text-red-300">
        {label}
      </button>
    </form>
  );
}
