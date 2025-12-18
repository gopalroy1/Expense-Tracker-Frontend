import { CategoryTrendView } from "@/components/dashboardContainer/categoryTrend/categoryTrendView";
import { useState } from "react";

const DEMO_DATA = {
  year: 2025,
  category: "INVESTMENT",
  labels: ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"],
  categoryTrend: [420000, 450000, 480000, 520000, 610000, 720000],
  subCategoryTrend: {
    "Mutual Funds": [260000, 280000, 300000, 340000, 410000, 480000],
    "Liquid Funds": [160000, 170000, 180000, 180000, 200000, 240000],
  },
};

export const DemoCategoryTrendSection = () => {
  const [range, setRange] = useState<6 | 12 | "ALL">("ALL");
  const [view, setView] = useState<"CATEGORY" | "SUB_CATEGORY">("CATEGORY");

  return (
    <div className="bg-white rounded-2xl border shadow-sm p-6">
      <CategoryTrendView
        data={DEMO_DATA}
        range={range}
        view={view}
        onRangeChange={setRange}
        onViewChange={setView}
      />
    </div>
  );
};
