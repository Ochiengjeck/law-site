import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import UserForm from "@/components/admin/UserForm";

export const metadata = { title: "Edit User" };

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const userId = parseInt(id);

  if (isNaN(userId)) notFound();

  const [user, session] = await Promise.all([
    prisma.adminUser.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true },
    }),
    getSession(),
  ]);

  if (!user) notFound();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy">Edit User</h1>
        <p className="text-sm text-gray-500 mt-1">
          Editing <strong>{user.name}</strong> · {user.email}
        </p>
      </div>
      <UserForm user={user} currentUserId={session?.userId} />
    </div>
  );
}
