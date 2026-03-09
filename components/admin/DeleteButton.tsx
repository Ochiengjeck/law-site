"use client";

interface Props {
  action: () => Promise<void>;
  confirmMessage?: string;
}

export default function DeleteButton({ action, confirmMessage = "Delete this item?" }: Props) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(confirmMessage)) e.preventDefault();
      }}
    >
      <button
        type="submit"
        className="text-red-500 hover:text-red-700 font-medium transition-colors text-sm"
      >
        Delete
      </button>
    </form>
  );
}
