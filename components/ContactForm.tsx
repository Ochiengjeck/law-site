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
      <div className="border-l-4 border-green-500 bg-green-50 p-8 text-center">
        <div className="text-3xl mb-3 text-green-600">✓</div>
        <h3 className="text-lg font-black text-green-800 mb-2">Message Received</h3>
        <p className="text-green-700 text-sm">
          Thank you for your enquiry. A member of our team will be in touch shortly.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      {state.error && (
        <div className="border-l-4 border-red-400 bg-red-50 p-4 text-red-700 text-sm">
          {state.error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-black text-navy mb-1.5 uppercase tracking-widest">
            Full Name <span className="text-gold">*</span>
          </label>
          <input
            type="text"
            name="name"
            required
            className="w-full border border-gray-300 rounded-none px-3 py-2.5 text-sm focus:outline-none focus:border-gold transition-colors"
            placeholder="Your full name"
          />
        </div>

        <div>
          <label className="block text-xs font-black text-navy mb-1.5 uppercase tracking-widest">
            Email Address <span className="text-gold">*</span>
          </label>
          <input
            type="email"
            name="email"
            required
            className="w-full border border-gray-300 rounded-none px-3 py-2.5 text-sm focus:outline-none focus:border-gold transition-colors"
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-black text-navy mb-1.5 uppercase tracking-widest">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            className="w-full border border-gray-300 rounded-none px-3 py-2.5 text-sm focus:outline-none focus:border-gold transition-colors"
            placeholder="+254 700 000 000"
          />
        </div>

        <div>
          <label className="block text-xs font-black text-navy mb-1.5 uppercase tracking-widest">
            Service Required <span className="text-gold">*</span>
          </label>
          <select
            name="serviceType"
            required
            className="w-full border border-gray-300 rounded-none px-3 py-2.5 text-sm focus:outline-none focus:border-gold transition-colors bg-white"
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
        <label className="block text-xs font-black text-navy mb-1.5 uppercase tracking-widest">
          Message <span className="text-gold">*</span>
        </label>
        <textarea
          name="message"
          required
          rows={5}
          className="w-full border border-gray-300 rounded-none px-3 py-2.5 text-sm focus:outline-none focus:border-gold transition-colors resize-none"
          placeholder="Please describe your legal matter briefly…"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="bg-navy text-white font-bold px-8 py-3 text-xs tracking-widest uppercase rounded-none hover:bg-navy-dark transition-colors disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send Enquiry"}
      </button>
    </form>
  );
}
