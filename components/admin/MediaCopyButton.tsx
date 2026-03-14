"use client";

import { useState } from "react";

export default function MediaCopyButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    const fullUrl = window.location.origin + url;
    try {
      await navigator.clipboard.writeText(fullUrl);
    } catch {
      // Fallback for non-secure contexts
      const ta = document.createElement("textarea");
      ta.value = fullUrl;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={copy}
      className="text-xs px-2 py-1 border border-navy text-navy hover:bg-navy hover:text-white transition-colors"
    >
      {copied ? "Copied!" : "Copy URL"}
    </button>
  );
}
