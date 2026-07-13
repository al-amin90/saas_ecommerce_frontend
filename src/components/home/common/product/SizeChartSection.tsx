// ── Size Chart Section Component ──────────────────────────────────────────────

import { Ruler } from "lucide-react";
import { useState } from "react";

function SizeChartSection({
  sizeChart,
}: {
  sizeChart: {
    _id: string;
    chartName: string;
    brand?: string;
    targetGroup?: string;
    rows: {
      size: number;
      innerLength?: string;
      feetLength?: string;
      ageRange?: string;
      note?: string;
    }[];
  };
}) {
  const [selectedSize, setSelectedSize] = useState<number | null>(null);

  const selectedRow = sizeChart.rows.find((r) => r.size === selectedSize);

  return (
    <div className="mt-6 mb-32 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200" />
        <div className="flex items-center gap-2">
          <Ruler className="h-4 w-4 text-slate-500" />
          <span className="text-sm font-bold uppercase tracking-widest text-slate-600">
            Size Guide
          </span>
        </div>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      {/* Chart meta */}
      {/* <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm font-semibold text-slate-800">
          {sizeChart.chartName}
        </span>
        {sizeChart.brand && (
          <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full capitalize">
            {sizeChart.brand}
          </span>
        )}
        {sizeChart.targetGroup && (
          <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full capitalize">
            {sizeChart.targetGroup}
          </span>
        )}
      </div> */}

      {/* Interactive size picker */}
      <div className="space-y-2">
        {/* Selected size detail card */}
        {selectedRow && (
          <div className=" rounded-2xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
            {[
              { label: "EU Size", value: selectedRow.size },
              {
                label: "Inner Length",
                value: selectedRow.innerLength
                  ? `${selectedRow.innerLength} cm`
                  : "—",
              },
              {
                label: "Feet Length",
                value: selectedRow.feetLength
                  ? `${selectedRow.feetLength} cm`
                  : "—",
              },
              { label: "Age Range", value: selectedRow.ageRange || "—" },
            ].map((item) => (
              <div key={item.label} className="text-center space-y-1">
                <p className="text-xs  uppercase tracking-wide">{item.label}</p>
                <p className="text-base font-bold ">{item.value}</p>
              </div>
            ))}
            {selectedRow.note && (
              <div className="col-span-2 sm:col-span-4 border-t border-white/10 pt-2 mt-1">
                <p className="text-xs text-slate-400 text-center">
                  {selectedRow.note}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Full table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {["EU Size", "Inner (cm)", "Feet (cm)", "Age Range"].map((h) => (
                <th
                  key={h}
                  className="py-3 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sizeChart.rows.map((row, i) => (
              <tr
                key={i}
                onClick={() =>
                  setSelectedSize((prev) =>
                    prev === row.size ? null : row.size,
                  )
                }
                className={`border-b border-slate-100 last:border-0 cursor-pointer transition-colors ${
                  selectedSize === row.size
                    ? "bg-[#F48721] text-white"
                    : "hover:bg-slate-50"
                }`}
              >
                <td
                  className={`py-3 px-4 font-bold text-base ${selectedSize === row.size ? "text-white" : "text-slate-800"}`}
                >
                  {row.size}
                </td>
                <td
                  className={`py-3 px-4 ${selectedSize === row.size ? "text-white" : "text-slate-600"}`}
                >
                  {row.innerLength ?? "—"}
                </td>
                <td
                  className={`py-3 px-4 ${selectedSize === row.size ? "text-white" : "text-slate-600"}`}
                >
                  {row.feetLength ?? "—"}
                </td>
                <td
                  className={`py-3 px-4 ${selectedSize === row.size ? "text-white" : "text-slate-600"}`}
                >
                  {row.ageRange ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tip */}
      <p className="text-xs text-slate-400 text-center">
        💡 Measure your foot length and match with Feet (cm) column for best fit
      </p>
    </div>
  );
}

export default SizeChartSection;
