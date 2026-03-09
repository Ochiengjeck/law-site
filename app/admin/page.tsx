import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import LoginForm from "./LoginForm";

export const metadata = { title: "Admin Login" };

export default async function AdminLoginPage() {
  const session = await getSession();
  if (session) redirect("/admin/dashboard");

  return (
    <div className="min-h-screen bg-light-gray flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 w-full max-w-sm p-8">
        <div className="text-center mb-8">
          <h1 className="text-xl font-bold text-navy">SW Law LLP</h1>
          <p className="text-gold text-xs tracking-widest uppercase mt-1">
            Admin Portal
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
