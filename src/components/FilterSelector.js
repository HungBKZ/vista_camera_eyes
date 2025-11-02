import React from "react";

export default function FilterSelector({ currentFilter, setFilter }) {
  const filters = ["none", "colorblind", "lowvision", "lightsensitive", "glasses"];

  return (
    <div className="flex gap-3 justify-center mt-3">
      {filters.map((f) => (
        <button
          key={f}
          className={`px-4 py-2 rounded-lg border ${
            currentFilter === f ? "bg-sky-600 text-white" : "bg-gray-100"
          }`}
          onClick={() => setFilter(f)}
        >
          {f}
        </button>
      ))}
    </div>
  );
}
