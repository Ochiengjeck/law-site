"use client";

import { useFormStatus } from "react-dom";

interface Props {
  label?: string;
  pendingLabel?: string;
  className?: string;
}

export default function SubmitButton({
  label = "Save Changes",
  pendingLabel = "Saving…",
  className = "bg-navy text-white font-semibold px-8 py-2.5 rounded-lg hover:bg-navy-dark transition-colors text-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2",
}: Props) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} className={className}>
      {pending && (
        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      )}
      {pending ? pendingLabel : label}
    </button>
  );
}
