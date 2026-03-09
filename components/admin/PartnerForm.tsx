"use client";

import { useActionState } from "react";
import type { Partner } from "@prisma/client";
import { createPartner, updatePartner } from "@/app/admin/dashboard/partners/actions";
import ImageUpload from "@/components/admin/ImageUpload";
import SubmitButton from "@/components/admin/SubmitButton";

type State = { error: string | null };

interface Props {
  partner?: Partner;
}

export default function PartnerForm({ partner }: Props) {
  const action = partner ? updatePartner.bind(null, partner.id) : createPartner;
  const [state, formAction] = useActionState<State, FormData>(action, {
    error: null,
  });

  return (
    <form action={formAction} className="space-y-5 max-w-2xl">
      {state.error && (
        <div className="bg-red-50 border border-red-200 rounded p-4 text-red-700 text-sm">
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
            defaultValue={partner?.name ?? ""}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-navy"
            placeholder="e.g. Faith Sulwe"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Role <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="role"
            required
            defaultValue={partner?.role ?? ""}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-navy"
            placeholder="e.g. Managing Partner"
          />
        </div>
      </div>

      <div>
        <ImageUpload
          name="imageUrl"
          category="partners"
          defaultValue={partner?.imageUrl ?? ""}
          label="Profile Photo"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Bio <span className="text-red-500">*</span>
          <span className="text-gray-400 font-normal ml-1">(separate paragraphs with a blank line)</span>
        </label>
        <textarea
          name="bio"
          required
          rows={8}
          defaultValue={partner?.bio ?? ""}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-navy resize-y"
          placeholder="Paragraph one.&#10;&#10;Paragraph two."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Expertise Areas
          <span className="text-gray-400 font-normal ml-1">(one per line)</span>
        </label>
        <textarea
          name="expertise"
          rows={4}
          defaultValue={partner?.expertise ?? ""}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-navy resize-y"
          placeholder="Maritime & Shipping Law&#10;Blue Economy&#10;ESG Compliance"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Education &amp; Qualifications
          <span className="text-gray-400 font-normal ml-1">(one per line)</span>
        </label>
        <textarea
          name="education"
          rows={3}
          defaultValue={partner?.education ?? ""}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-navy resize-y"
          placeholder="LLB (Hons) – University of Nairobi&#10;Advocate of the High Court of Kenya"
        />
      </div>

      <div className="w-24">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Display Order
        </label>
        <input
          type="number"
          name="order"
          defaultValue={partner?.order ?? 0}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-navy"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <SubmitButton label={partner ? "Update Partner" : "Create Partner"} />
        <a
          href="/admin/dashboard/partners"
          className="px-6 py-2 rounded border border-gray-300 text-sm hover:bg-gray-50 transition-colors"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
