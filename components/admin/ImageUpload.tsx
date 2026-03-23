"use client";

import { useState } from "react";

interface Props {
  name: string;
  defaultValue?: string;
  category: string;
  label?: string;
}

export default function ImageUpload({ name, defaultValue = "", category, label }: Props) {
  const [url, setUrl] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    const fd = new FormData();
    fd.append("file", file);
    fd.append("category", category);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const raw = await res.text();
      let data: { error?: string; url?: string } = {};

      if (raw) {
        try {
          data = JSON.parse(raw) as { error?: string; url?: string };
        } catch {
          throw new Error("Upload failed: server returned an invalid response");
        }
      }

      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      if (!data.url) throw new Error("Upload succeeded but no file URL was returned");
      setUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">{label}</label>
      )}
      <input type="hidden" name={name} value={url} />
      {url && (
        <div className="relative h-28 w-44 rounded overflow-hidden border border-gray-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt="Preview" className="w-full h-full object-cover" />
        </div>
      )}
      <div className="flex gap-2 items-center flex-wrap">
        <label
          className={`cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm px-3 py-1.5 rounded border border-gray-300 transition-colors whitespace-nowrap ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {uploading ? "Uploading…" : "Upload Image"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="or paste image URL"
          className="flex-1 min-w-0 border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-navy"
        />
      </div>
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}
