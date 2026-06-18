import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { TopNav } from "@/components/TopNav";

// Authed intern shell — wraps /dashboard, /peer and /missions/[slug].
export default async function InternLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (user.role === "admin") redirect("/admin");

  return (
    <>
      <TopNav
        items={[
          { label: "Missions", href: "/dashboard" },
          { label: "Peer progress", href: "/peer" },
        ]}
        user={{ name: user.name, role: user.role }}
        homeHref="/dashboard"
      />
      {children}
    </>
  );
}
