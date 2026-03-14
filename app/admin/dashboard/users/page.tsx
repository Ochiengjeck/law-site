import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { deleteUser } from "./actions";

export const metadata = { title: "Users" };

const roleColors: Record<string, string> = {
  admin: "bg-navy/10 text-navy border-navy/20",
  editor: "bg-blue-50 text-blue-600 border-blue-200",
  viewer: "bg-gray-100 text-gray-500 border-gray-200",
};

export default async function UsersPage() {
  const [users, session] = await Promise.all([
    prisma.adminUser.findMany({ orderBy: { createdAt: "asc" } }),
    getSession(),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy">Admin Users</h1>
          <p className="text-sm text-gray-500 mt-1">
            {users.length} user{users.length !== 1 ? "s" : ""} · Manage who can access this panel
          </p>
        </div>
        <Link
          href="/admin/dashboard/users/new"
          className="bg-navy text-white text-xs font-semibold px-5 py-2.5 hover:bg-navy-dark transition-colors tracking-widest uppercase"
        >
          + New User
        </Link>
      </div>

      <div className="bg-white border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-navy/[0.03] border-b border-gray-100">
              <th className="text-left text-[10px] text-gray-400 uppercase tracking-wider px-6 py-3 font-medium">User</th>
              <th className="text-left text-[10px] text-gray-400 uppercase tracking-wider px-4 py-3 font-medium">Role</th>
              <th className="text-left text-[10px] text-gray-400 uppercase tracking-wider px-4 py-3 font-medium">Added</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const isSelf = session?.userId === user.id;
              return (
                <tr key={user.id} className="border-b border-gray-50 hover:bg-navy/[0.015] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {/* Avatar initials */}
                      <div className="w-9 h-9 bg-navy text-white flex items-center justify-center flex-shrink-0 font-bold text-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-navy text-sm flex items-center gap-2">
                          {user.name}
                          {isSelf && (
                            <span className="text-[10px] bg-gold/20 text-gold-dark border border-gold/30 px-1.5 py-0.5 font-medium">
                              You
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`text-[10px] px-2 py-1 border font-semibold uppercase tracking-wide ${roleColors[user.role] ?? "bg-gray-100 text-gray-500 border-gray-200"}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-xs text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString("en-KE", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-4">
                      <Link
                        href={`/admin/dashboard/users/${user.id}/edit`}
                        className="text-xs text-navy hover:text-gold font-medium transition-colors"
                      >
                        Edit
                      </Link>
                      {!isSelf && users.length > 1 && (
                        <form
                          action={async () => {
                            "use server";
                            await deleteUser(user.id);
                          }}
                        >
                          <button
                            type="submit"
                            className="text-xs text-red-400 hover:text-red-600 transition-colors"
                          >
                            Delete
                          </button>
                        </form>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 bg-amber-50 border border-amber-200 p-4 text-xs text-amber-700">
        <strong>Note:</strong> You cannot delete your own account or remove the last remaining user.
        Role changes take effect on the user&apos;s next login.
      </div>
    </div>
  );
}
