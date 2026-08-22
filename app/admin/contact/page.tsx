import Link from "next/link";
import { ActionForm } from "@/app/admin/_components/form-status";
import { saveContactAction } from "@/lib/cms/actions";
import { requireAdmin } from "@/lib/cms/admin-auth";
import { getAdminCollections } from "@/lib/cms/admin-data";

export default async function AdminContactPage() {
  await requireAdmin();
  const { contact } = await getAdminCollections();

  return (
    <div>
      <h1 className="text-4xl tracking-[-0.04em]">Contact</h1>
      <p className="mt-3 text-sm text-muted">
        Social profiles are managed on the{" "}
        <Link href="/admin/social" className="text-accent">
          Social
        </Link>{" "}
        page.
      </p>
      <ActionForm action={saveContactAction} className="mt-8 grid gap-4">
        <label className="grid gap-2 text-sm">
          Email
          <input className="admin-input" name="email" defaultValue={contact.email} />
        </label>
        <label className="grid gap-2 text-sm">
          Phone
          <input className="admin-input" name="phone" defaultValue={contact.phone} />
        </label>
        <label className="grid gap-2 text-sm">
          Location
          <input className="admin-input" name="location" defaultValue={contact.location} />
        </label>
        <label className="grid gap-2 text-sm">
          Contact text
          <textarea className="admin-textarea" name="message" defaultValue={contact.message} />
        </label>
      </ActionForm>
    </div>
  );
}
