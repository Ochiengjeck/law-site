"use client";
import { useState } from "react";

export default function ColorField({
  name,
  label,
  description,
  defaultValue,
  originalDefault,
}: {
  name: string;
  label: string;
  description?: string;
  defaultValue: string;
  originalDefault: string;
}) {
  const [color, setColor] = useState(defaultValue || "#000000");

  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      {description && (
        <p className="text-xs text-gray-400 mb-2 leading-relaxed">{description}</p>
      )}
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-10 h-10 cursor-pointer border border-gray-300 p-0.5 bg-white"
          aria-hidden="true"
        />
        <input
          type="text"
          name={name}
          value={color}
          onChange={(e) => setColor(e.target.value)}
          maxLength={7}
          className="w-28 border border-gray-200 px-3 py-2 text-sm font-mono focus:outline-none focus:border-navy"
          placeholder="#000000"
        />
        <div
          className="w-8 h-8 border border-gray-200 flex-shrink-0"
          style={{ backgroundColor: color }}
        />
        <button
          type="button"
          onClick={() => setColor(originalDefault)}
          className="text-[10px] text-gray-400 hover:text-navy underline"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
