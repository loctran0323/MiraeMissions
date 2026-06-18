import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { TopNav } from "@/components/TopNav";

// Admin shell: gate on session + role, then render the admin nav + page.
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/dashboard");

  return (
    <>
      <TopNav
        items={[
          { label: "Review queue", href: "/admin" },
          { label: "Intern progress", href: "/admin/progress" },
          { label: "Approvals", href: "/admin/approvals" },
        ]}
        user={{ name: user.name, role: user.role }}
        homeHref="/admin"
      />
      {children}
    </>
  );
}
