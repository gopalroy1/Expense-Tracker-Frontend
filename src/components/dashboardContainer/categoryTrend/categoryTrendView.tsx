import ReactECharts from "echarts-for-react";
import React from "react";

/* ---------------- Types ---------------- */

export type CategoryTrendData = {
  year: number;
  category: string;
  labels: string[];
  categoryTrend: number[];
  subCategoryTrend: Record<string, number[]>;
};

type Props = {
  data: CategoryTrendData;
  view: "CATEGORY" | "SUB_CATEGORY";
  range: 6 | 12 | "ALL";
  onRangeChange: (r: 6 | 12 | "ALL") => void;
  onViewChange: (v: "CATEGORY" | "SUB_CATEGORY") => void;
};

/* ---------------- Component ---------------- */

export const CategoryTrendView: React.FC<Props> = ({
  data,
  view,
  range,
  onRangeChange,
  onViewChange,
}) => {
  const categoryOption = {
    tooltip: {
      trigger: "axis",
      valueFormatter: (v: number) => `₹ ${v.toLocaleString()}`,
    },
    grid: { left: 12, right: 12, bottom: 24, containLabel: true },
    xAxis: {
      type: "category",
      data: data.labels,
      axisTick: { show: false },
      axisLine: { show: false },
    },
    yAxis: {
      type: "value",
      axisLabel: {
        formatter: (v: number) => `₹${(v / 1000).toFixed(0)}k`,
      },
      splitLine: {
        lineStyle: { type: "dashed", opacity: 0.3 },
      },
    },
    series: [
      {
        type: "line",
        smooth: true,
        symbolSize: 6,
        lineStyle: { width: 3 },
        areaStyle: { opacity: 0.25 },
        data: data.categoryTrend,
      },
    ],
  };

  const subCategoryOption = {
    tooltip: {
      trigger: "axis",
      valueFormatter: (v: number) => `₹ ${v.toLocaleString()}`,
    },
    legend: { top: 0, icon: "circle" },
    grid: { left: 12, right: 12, bottom: 24, containLabel: true },
    xAxis: { type: "category", data: data.labels },
    yAxis: {
      type: "value",
      splitLine: { lineStyle: { type: "dashed", opacity: 0.3 } },
    },
    series: Object.entries(data.subCategoryTrend).map(([name, values]) => ({
      name,
      type: "line",
      smooth: true,
      symbolSize: 5,
      data: values,
    })),
  };

  return (
    <div className="space-y-3">
      {/* Header */}
     {/* Header */}
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
  <div>
    <h3 className="text-lg font-semibold">Category Trend</h3>
    <p className="text-sm text-gray-500">
      {data.year} • {data.category}
    </p>
    <p className="text-xs text-gray-400 mt-1">
      Track how this category changes over time. Click view breakdown to explore deeper.
    </p>
  </div>

  <div className="flex items-center gap-2">
    {/* Range */}
    <div className="flex gap-1">
      {[6, 12, "ALL"].map((r) => (
        <button
          key={r}
          onClick={() => onRangeChange(r as any)}
          className={`px-2 py-1 text-xs rounded border transition ${
            range === r
              ? "bg-black text-white"
              : "hover:bg-gray-100"
          }`}
        >
          {r === "ALL" ? "All" : `Last ${r}M`}
        </button>
      ))}
    </div>

    {/* Explicit drill-down CTA */}
    {view === "CATEGORY" && (
      <button
        onClick={() => onViewChange("SUB_CATEGORY")}
        className="px-2 py-1 text-xs border rounded hover:bg-gray-100"
      >
        View breakdown →
      </button>
    )}
  </div>
</div>


      {/* Charts */}
     {view === "CATEGORY" && (
  <div className="relative group">
    <ReactECharts
      option={categoryOption}
      style={{ height: 320, cursor: "pointer" }}
      onEvents={{
        click: () => onViewChange("SUB_CATEGORY"),
      }}
    />

    {/* Hover hint */}
    <div className="absolute bottom-2 right-2 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition">
      Click view breakdown to explore sub-categories →
    </div>
  </div>
)}


    {view === "SUB_CATEGORY" && (
  <>
    <div className="flex items-center justify-between">
      <button
        onClick={() => onViewChange("CATEGORY")}
        className="text-sm text-blue-600 hover:underline"
      >
        ← Back to category view
      </button>

      <p className="text-xs text-gray-400">
        Breakdown of {data.category}
      </p>
    </div>

    <ReactECharts
      option={subCategoryOption}
      style={{ height: 360 }}
    />
  </>
          )}
          <p className="text-xs text-gray-400 mt-2">
  Tip: Click view breakdown to understand which sub-categories are driving changes.
</p>


    </div>
  );
};
