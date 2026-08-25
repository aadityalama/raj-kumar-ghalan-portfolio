import Link from "next/link";
import { ActionForm } from "@/app/admin/_components/form-status";
import { saveBrandSettingsAction } from "@/lib/cms/actions";
import { requireAdmin } from "@/lib/cms/admin-auth";
import { getAdminCollections } from "@/lib/cms/admin-data";

export default async function AdminFooterPage() {
  await requireAdmin();
  const { settings } = await getAdminCollections();

  return (
    <div>
      <h1 className="text-4xl tracking-[-0.04em]">Footer</h1>
      <p className="mt-3 max-w-2xl text-sm text-muted">
        Footer navigation comes from the Navigation page. Social links come from Social Links. Positioning uses the hero positioning line from Homepage.
      </p>
      <p className="mt-2 text-sm text-muted">
        Contact details are managed on the{" "}
        <Link href="/admin/contact" className="text-accent">
          Contact
        </Link>{" "}
        page.
      </p>

      <ActionForm action={saveBrandSettingsAction} className="mt-8 grid gap-5">
        <label className="grid gap-2 text-sm">
          Copyright / footer name
          <input className="admin-input" name="copyright_text" defaultValue={settings.copyright_text || ""} />
        </label>
        <label className="grid gap-2 text-sm">
          Wordmark shown in footer
          <input className="admin-input" name="wordmark" defaultValue={settings.wordmark || ""} />
        </label>
      </ActionForm>
    </div>
  );
}
