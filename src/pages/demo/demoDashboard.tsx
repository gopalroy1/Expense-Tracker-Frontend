import React from "react";
import { DemoCategoryTrendSection } from "./demoCategoryTrendSection";
import DemoLayout from "./demoLayout";
import DemoNetworthContainer from "./DemoNetworthContainer";
import { DemoNetWorthTrendSection } from "./demoNetworthTrendSection";
import { DemoSnapshotSection } from "./DemoSnapshotSection";

/* ---------------- Fake Demo Data ---------------- */

const DEMO_MONTHS = ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"];

const NET_WORTH = [820000, 860000, 910000, 980000, 1100000, 1240000];

const INVESTMENT = [420000, 450000, 480000, 520000, 610000, 720000];
const CREDIT_CARDS = [-180000, -175000, -160000, -145000, -120000, -90000];

const SUB_CATEGORY = {
  "Mutual Funds": [260000, 280000, 300000, 340000, 410000, 480000],
  "Liquid Funds": [160000, 170000, 180000, 180000, 200000, 240000],
};

/* ---------------- Chart Options ---------------- */

const netWorthOption = {
  tooltip: { trigger: "axis" },
  xAxis: { type: "category", data: DEMO_MONTHS },
  yAxis: { type: "value" },
  series: [
    {
      type: "line",
      smooth: true,
      data: NET_WORTH,
      areaStyle: { opacity: 0.25 },
      lineStyle: { width: 3 },
    },
  ],
};

const categoryOption = {
  tooltip: { trigger: "axis" },
  xAxis: { type: "category", data: DEMO_MONTHS },
  yAxis: { type: "value" },
  series: [
    {
      name: "Investments",
      type: "line",
      smooth: true,
      data: INVESTMENT,
    },
    {
      name: "Credit Cards",
      type: "line",
      smooth: true,
      data: CREDIT_CARDS,
    },
  ],
};

const subCategoryOption = {
  tooltip: { trigger: "axis" },
  legend: { top: 0 },
  xAxis: { type: "category", data: DEMO_MONTHS },
  yAxis: { type: "value" },
  series: Object.entries(SUB_CATEGORY).map(([name, data]) => ({
    name,
    type: "line",
    smooth: true,
    data,
  })),
};

/* ---------------- Component ---------------- */

export const DemoDashboard: React.FC = () => {
  return (
    <DemoLayout>
      <div className="space-y-8">
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800">
          This is a demo dashboard using sample data.
          Create an account to track your real finances.
        </div>

        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <DemoNetworthContainer />
        </div>
        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <DemoSnapshotSection />
        </div>
        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <DemoNetWorthTrendSection />
        </div>
        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <DemoCategoryTrendSection />
        </div>
      </div>
    </DemoLayout>
  );
};
