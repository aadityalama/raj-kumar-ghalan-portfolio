import type { Metadata } from "next";
import "./admin.css";
import { AdminShell } from "@/app/admin/_components/admin-shell";
import { getAdminUser } from "@/lib/cms/admin-auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const user = await getAdminUser();

  if (!user) {
    return <div className="dark min-h-dvh bg-bg text-text">{children}</div>;
  }

  return <AdminShell email={user.email || ""}>{children}</AdminShell>;
}
