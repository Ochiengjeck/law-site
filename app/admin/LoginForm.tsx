"use client";

import { useActionState } from "react";
import { login } from "@/app/admin/actions";

const initialState = { error: null as string | null };

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, initialState);

  return (
    <form action={action} className="space-y-4">
      {state.error && (
        <div className="bg-red-50 border border-red-200 rounded p-3 text-red-700 text-sm">
          {state.error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-navy"
          placeholder="admin@swlaw.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-navy"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-navy text-white font-semibold py-2.5 rounded hover:bg-navy-dark transition-colors disabled:opacity-60 text-sm"
      >
        {pending ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}
