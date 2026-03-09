"use client";

import { useActionState } from "react";
import { submitInquiry } from "@/app/actions/inquiries";

const SERVICE_OPTIONS = [
  "Maritime & Shipping Law",
  "ESG Compliance",
  "Corporate & Commercial Law",
  "Conveyancing & Property Law",
  "Family Law",
  "Probate",
  "Employment Law",
  "Alternative Dispute Resolution",
  "Other",
];

const initialState = { error: null as string | null, success: false };

export default function ContactForm() {
  const [state, action, pending] = useActionState(submitInquiry, initialState);

  if (state.success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-10 text-center">
        <div className="text-4xl mb-4">✓</div>
        <h3 className="text-xl font-semibold text-green-800 mb-2">
          Message Received
        </h3>
        <p className="text-green-700">
          Thank you for your enquiry. A member of our team will be in touch
          shortly.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-5">
      {state.error && (
        <div className="bg-red-50 border border-red-200 rounded p-4 text-red-700 text-sm">
          {state.error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            required
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-navy"
            placeholder="Your full name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            required
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-navy"
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-navy"
            placeholder="+254 700 000 000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Service Required <span className="text-red-500">*</span>
          </label>
          <select
            name="serviceType"
            required
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-navy bg-white"
          >
            <option value="">Select a service…</option>
            {SERVICE_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          name="message"
          required
          rows={5}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-navy resize-none"
          placeholder="Please describe your legal matter briefly…"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="bg-navy text-white font-semibold px-8 py-3 rounded hover:bg-navy-dark transition-colors disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send Enquiry"}
      </button>
    </form>
  );
}
