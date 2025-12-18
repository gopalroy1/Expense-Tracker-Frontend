import ReactECharts from "echarts-for-react";
import React from "react";

/* ---------------- Types ---------------- */

export type NetWorthTrendPoint = {
  month: number; // 1–12
  netWorth: number;
};

type NetWorthTrendViewProps = {
  year: number;
  data: NetWorthTrendPoint[];
  onYearChange: (y: number) => void;
};

/* ---------------- Constants ---------------- */

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export const NetWorthTrendView: React.FC<NetWorthTrendViewProps> = ({
  year,
  data,
  onYearChange,
}) => {
  // Fill 12 months
  const monthlyNetWorth: (number | null)[] = Array(12).fill(null);

  data.forEach((d) => {
    monthlyNetWorth[d.month - 1] = d.netWorth;
  });

  const option = {
    grid: { left: 40, right: 20, top: 20, bottom: 30 },

    tooltip: {
      trigger: "axis",
      formatter: (params: any) => {
        const idx = params[0].dataIndex;
        const value = monthlyNetWorth[idx];

        if (value == null) {
          return `<strong>${MONTH_LABELS[idx]}</strong><br/>No data`;
        }

        const prev = idx > 0 ? monthlyNetWorth[idx - 1] : null;
        let delta = "—";

        if (prev != null) {
          const diff = value - prev;
          const pct = (diff / prev) * 100;
          const sign = diff >= 0 ? "+" : "-";

          delta = `${sign}₹${Math.abs(diff).toLocaleString()} (${sign}${Math.abs(
            pct
          ).toFixed(2)}%)`;
        }

        return `
          <div>
            <strong>${MONTH_LABELS[idx]}</strong><br/>
            Net Worth: ₹${value.toLocaleString()}<br/>
            MoM Change: ${delta}
          </div>
        `;
      },
    },

    xAxis: {
      type: "category",
      data: MONTH_LABELS,
      axisTick: { show: false },
      axisLine: { show: false },
    },

    yAxis: {
      type: "value",
      axisLabel: {
        formatter: (v: number) => `₹${v / 1000}k`,
      },
      splitLine: { lineStyle: { type: "dashed" } },
    },

    series: [
      {
        data: monthlyNetWorth,
        type: "line",
        smooth: true,
        connectNulls: true,
        symbol: "circle",
        symbolSize: 6,
        lineStyle: { width: 3 },
        areaStyle: { opacity: 0.12 },
      },
    ],
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-800">
          Net Worth Trend
        </h3>

        <select
          className="border rounded-md px-2 py-1 text-sm"
          value={year}
          onChange={(e) => onYearChange(Number(e.target.value))}
        >
          {[year - 2, year - 1, year, year + 1].map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* Chart */}
      <div className="h-72">
        <ReactECharts
          option={option}
          style={{ height: "100%", width: "100%" }}
        />
      </div>

      <p className="text-xs text-gray-400 mt-2">
        Net worth snapshot trend for the selected year
      </p>
    </div>
  );
};
