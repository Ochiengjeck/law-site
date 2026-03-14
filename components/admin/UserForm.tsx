"use client";

import { useActionState } from "react";
import { createUser, updateUser, changePassword } from "@/app/admin/dashboard/users/actions";
import SubmitButton from "@/components/admin/SubmitButton";

type State = { error: string | null; success?: string };

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface Props {
  user?: User;
  currentUserId?: number;
}

const ROLES = ["admin", "editor", "viewer"];

export default function UserForm({ user, currentUserId }: Props) {
  const action = user ? updateUser.bind(null, user.id) : createUser;
  const [state, formAction] = useActionState<State, FormData>(action, { error: null });

  const pwAction = user ? changePassword.bind(null, user.id) : changePassword.bind(null, 0);
  const [pwState, pwFormAction] = useActionState<State, FormData>(pwAction, { error: null });

  return (
    <div className="space-y-6 max-w-xl">
      {/* Details form */}
      <div className="bg-white border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-navy/[0.02]">
          <h2 className="font-semibold text-navy text-sm">
            {user ? "Edit User Details" : "New Admin User"}
          </h2>
        </div>
        <form action={formAction} className="p-6 space-y-4">
          {state.error && (
            <div className="bg-red-50 border border-red-200 p-3 text-red-700 text-sm">
              {state.error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                defaultValue={user?.name ?? ""}
                className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-navy"
                placeholder="Full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role <span className="text-red-500">*</span>
              </label>
              <select
                name="role"
                defaultValue={user?.role ?? "admin"}
                disabled={user?.id === currentUserId}
                className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-navy bg-white disabled:bg-gray-50 disabled:text-gray-400"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </option>
                ))}
              </select>
              {user?.id === currentUserId && (
                <p className="text-[10px] text-gray-400 mt-1">Cannot change your own role.</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              required
              defaultValue={user?.email ?? ""}
              className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-navy"
              placeholder="admin@example.com"
            />
          </div>

          {!user && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                required
                minLength={8}
                className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-navy"
                placeholder="Minimum 8 characters"
              />
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <SubmitButton
              label={user ? "Update User" : "Create User"}
              pendingLabel={user ? "Updating…" : "Creating…"}
              className="bg-navy text-white text-xs font-semibold px-6 py-2.5 hover:bg-navy-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 tracking-widest uppercase"
            />
            <a
              href="/admin/dashboard/users"
              className="px-6 py-2.5 border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </a>
          </div>
        </form>
      </div>

      {/* Change password (edit mode only) */}
      {user && (
        <div className="bg-white border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-navy/[0.02]">
            <h2 className="font-semibold text-navy text-sm">Change Password</h2>
            <p className="text-[10px] text-gray-400 mt-0.5">Leave blank to keep the current password.</p>
          </div>
          <form action={pwFormAction} className="p-6 space-y-4">
            {pwState.error && (
              <div className="bg-red-50 border border-red-200 p-3 text-red-700 text-sm">
                {pwState.error}
              </div>
            )}
            {pwState.success && (
              <div className="bg-emerald-50 border border-emerald-200 p-3 text-emerald-700 text-sm">
                {pwState.success}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  name="password"
                  minLength={8}
                  className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-navy"
                  placeholder="Min. 8 characters"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirm"
                  className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-navy"
                  placeholder="Repeat password"
                />
              </div>
            </div>

            <div>
              <SubmitButton
                label="Change Password"
                pendingLabel="Updating…"
                className="bg-amber-500 text-white text-xs font-semibold px-6 py-2.5 hover:bg-amber-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 tracking-widest uppercase"
              />
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
