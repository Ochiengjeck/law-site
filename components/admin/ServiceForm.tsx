"use client";

import { useActionState } from "react";
import type { Service } from "@prisma/client";
import { createService, updateService } from "@/app/admin/dashboard/services/actions";
import ImageUpload from "@/components/admin/ImageUpload";
import SubmitButton from "@/components/admin/SubmitButton";

type State = { error: string | null };

interface Props {
  service?: Service;
}

export default function ServiceForm({ service }: Props) {
  const action = service ? updateService.bind(null, service.id) : createService;
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          required
          defaultValue={service?.title ?? ""}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-navy"
          placeholder="e.g. Maritime & Shipping Law"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            name="category"
            defaultValue={service?.category ?? "main"}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-navy bg-white"
          >
            <option value="main">Main Practice Area</option>
            <option value="other">Other Service</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Anchor Slug
            <span className="text-gray-400 font-normal ml-1">(URL hash)</span>
          </label>
          <input
            type="text"
            name="slug"
            defaultValue={service?.slug ?? ""}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-navy"
            placeholder="e.g. maritime"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Badge
          <span className="text-gray-400 font-normal ml-1">(shown above title)</span>
        </label>
        <input
          type="text"
          name="badge"
          defaultValue={service?.badge ?? ""}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-navy"
          placeholder="e.g. Core Practice"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          name="description"
          required
          rows={4}
          defaultValue={service?.description ?? ""}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-navy resize-y"
          placeholder="Service description…"
        />
      </div>

      <div>
        <ImageUpload
          name="imageUrl"
          category="services"
          defaultValue={service?.imageUrl ?? ""}
          label="Service Image"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Service Items
          <span className="text-gray-400 font-normal ml-1">(one per line, shown as bullet points)</span>
        </label>
        <textarea
          name="items"
          rows={6}
          defaultValue={service?.items ?? ""}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-navy resize-y"
          placeholder="Vessel registration&#10;Chartering contracts&#10;Marine environmental law"
        />
      </div>

      <div className="w-24">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Display Order
        </label>
        <input
          type="number"
          name="order"
          defaultValue={service?.order ?? 0}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-navy"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <SubmitButton label={service ? "Update Service" : "Create Service"} />
        <a
          href="/admin/dashboard/services"
          className="px-6 py-2 rounded border border-gray-300 text-sm hover:bg-gray-50 transition-colors"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
