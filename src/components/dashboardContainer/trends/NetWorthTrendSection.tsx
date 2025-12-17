import axiosInstance from "@/api/axios/axiosInstane";
import ReactECharts from "echarts-for-react";
import React, { useEffect, useState } from "react";

/* ---------------- Types ---------------- */

type TrendApiPoint = {
  month: number;        // 1–12
  label: string;        // Jan, Feb...
  netWorth: number;
};

type TrendApiResponse = {
  year: number | null;
  data: TrendApiPoint[];
};

/* ---------------- Constants ---------------- */

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/* ---------------- Component ---------------- */

export const NetWorthTrendSection: React.FC = () => {
  const [year, setYear] = useState<number | null>(null);
  const [trendData, setTrendData] = useState<TrendApiPoint[]>([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- API Call ---------------- */

  const fetchNetWorthTrend = async (year?: number) => {
    const params: any = {};
    if (year) params.year = year;

    const res = await axiosInstance.get<TrendApiResponse>(
      "/api/dashboard/networth-trend",
      { params }
    );

    return res.data;
  };

  /* ---------------- Initial Load ---------------- */

  useEffect(() => {
    fetchNetWorthTrend()
      .then((res) => {
        setYear(res.year);
        setTrendData(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  /* ---------------- Refetch on Year Change ---------------- */

  useEffect(() => {
    if (!year) return;

    setLoading(true);
    fetchNetWorthTrend(year)
      .then((res) => setTrendData(res.data))
      .finally(() => setLoading(false));
  }, [year]);

  /* ---------------- Prepare Chart Data ---------------- */

  // 12 slots, null where no data
  const monthlyNetWorth: (number | null)[] = Array(12).fill(null);

  trendData.forEach((d) => {
    monthlyNetWorth[d.month - 1] = d.netWorth;
  });

  /* ---------------- Loading / Empty ---------------- */

  if (loading) {
    return <div className="p-4">Loading net worth trend…</div>;
  }

  

  /* ---------------- ECharts Option ---------------- */

  const option = {
    grid: {
      left: 40,
      right: 20,
      top: 20,
      bottom: 30,
    },

    tooltip: {
      trigger: "axis",
      formatter: (params: any) => {
        const index = params[0].dataIndex;
        const currentValue = monthlyNetWorth[index];

        if (currentValue == null) {
          return `<strong>${MONTH_LABELS[index]}</strong><br/>No data`;
        }

        // find previous available month
        const prevIndex = index - 1;

        if (prevIndex < 0 || monthlyNetWorth[prevIndex] == null) {
          return `
    <div>
      <strong>${MONTH_LABELS[index]}</strong><br/>
      Net Worth: ₹${currentValue.toLocaleString()}<br/>
      MoM Change: —
    </div>
  `;
        }
        let deltaText = "—";

        if (prevIndex >= 0) {
          const prevValue = monthlyNetWorth[prevIndex]!;
          const diff = currentValue - prevValue;
          const percent = (diff / prevValue) * 100;
          const sign = diff >= 0 ? "+" : "-";

          deltaText = `
            ${sign}₹${Math.abs(diff).toLocaleString()}
            (${sign}${Math.abs(percent).toFixed(2)}%)
          `;
        }

        return `
          <div>
            <strong>${MONTH_LABELS[index]}</strong><br/>
            Net Worth: ₹${currentValue.toLocaleString()}<br/>
            MoM Change: ${deltaText}
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
        formatter: (value: number) => `₹${value / 1000}k`,
      },
      splitLine: {
        lineStyle: { type: "dashed" },
      },
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

  /* ---------------- Render ---------------- */

  return (
    <div className="bg-white rounded-2xl shadow p-4 mt-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Net Worth Trend</h2>

        {year && (
          <select
            className="border rounded px-2 py-1 text-sm"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          >
            {[year-3,year-2,year-1, year , year + 1,year+2,year+3].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Chart */}
      <div className="h-72">
        <ReactECharts
          style={{ height: "100%", width: "100%" }}
          option={option}
        />
      </div>

      <p className="text-xs text-gray-400 mt-2">
        Showing net worth trend for the selected year
      </p>
    </div>
  );
};
