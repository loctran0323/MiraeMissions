import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { RequestForm } from "./RequestForm";

export default async function RequestAccessPage() {
  const user = await getSessionUser();
  if (user) redirect(user.role === "admin" ? "/admin" : "/dashboard");

  return (
    <AuthLayout
      title="Request access"
      subtitle="Create your intern account. An administrator will approve you before you can sign in."
    >
      <RequestForm />
    </AuthLayout>
  );
}
