import { getSession } from "@/lib/auth";
import UserForm from "@/components/admin/UserForm";

export const metadata = { title: "New User" };

export default async function NewUserPage() {
  const session = await getSession();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy">New Admin User</h1>
        <p className="text-sm text-gray-500 mt-1">
          Create a new account for someone who needs access to this panel.
        </p>
      </div>
      <UserForm currentUserId={session?.userId} />
    </div>
  );
}
