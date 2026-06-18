import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginForm } from "./LoginForm";

export default async function LoginPage() {
  const user = await getSessionUser();
  if (user) redirect(user.role === "admin" ? "/admin" : "/dashboard");

  return (
    <AuthLayout title="Sign in" subtitle="Welcome back. Sign in to continue your missions.">
      <LoginForm />
    </AuthLayout>
  );
}
