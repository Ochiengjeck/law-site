"use client";

import { useState } from "react";

export default function MediaCopyButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(url);
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
