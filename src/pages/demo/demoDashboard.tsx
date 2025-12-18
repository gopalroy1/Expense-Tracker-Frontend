import ReactECharts from "echarts-for-react";
import React from "react";
import DemoLayout from "./demoLayout";

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
        {/* Explanation Banner */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800">
          This is a live preview using demo data.
          Create an account to track your own finances.
        </div>

        {/* Stat Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { label: "Net Worth", value: "₹12,40,000" },
            { label: "Total Investments", value: "₹7,20,000" },
            { label: "Outstanding Debt", value: "₹90,000" },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-white rounded-xl border shadow-sm p-4"
            >
              <p className="text-sm text-gray-500">{item.label}</p>
              <p className="text-xl font-semibold mt-1">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Net Worth Trend */}
        <div className="bg-white rounded-xl border shadow-sm p-4">
          <h3 className="font-semibold mb-2">Net Worth Trend</h3>
          <ReactECharts option={netWorthOption} style={{ height: 300 }} />
        </div>

        {/* Category Trend */}
        <div className="bg-white rounded-xl border shadow-sm p-4">
          <h3 className="font-semibold mb-2">Category Trends</h3>
          <ReactECharts option={categoryOption} style={{ height: 300 }} />
        </div>

        {/* Drill-down */}
        <div className="bg-white rounded-xl border shadow-sm p-4">
          <h3 className="font-semibold mb-2">
            Investment Breakdown
          </h3>
          <ReactECharts option={subCategoryOption} style={{ height: 300 }} />
        </div>

        {/* CTA */}
        <div className="text-center pt-8">
          <p className="text-gray-600 mb-4">
            Ready to track your own finances?
          </p>
          <a
            href="/register"
            className="inline-block px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
          >
            Create Your Free Account
          </a>
        </div>
      </div>
    </DemoLayout>
  );
};
