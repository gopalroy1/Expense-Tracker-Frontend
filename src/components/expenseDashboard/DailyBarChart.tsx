import ReactECharts from "echarts-for-react";
import type { DailyStat } from "./types";

interface Props {
  daily: DailyStat[];
  month: string; // YYYY-MM
  avgDailySpend: number;
  selectedDate: string | null;
  onBarClick: (date: string) => void;
}

export function DailyBarChart({ daily, month, avgDailySpend, selectedDate, onBarClick }: Props) {
  const [year, mon] = month.split("-").map(Number);
  const daysInMonth = new Date(year, mon, 0).getDate();

  const allDays = Array.from({ length: daysInMonth }, (_, i) => {
    const d = String(i + 1).padStart(2, "0");
    return `${month}-${d}`;
  });

  // Backend sends ISO timestamps (UTC midnight-IST); convert to local YYYY-MM-DD
  const dailyMap: Record<string, DailyStat> = {};
  for (const d of daily) {
    const localDate = new Date(d.date).toLocaleDateString("en-CA"); // en-CA → YYYY-MM-DD
    dailyMap[localDate] = d;
  }

  const barData = allDays.map((date) => {
    const stat = dailyMap[date];
    const val = stat?.total ?? 0;
    let color = "#e5e7eb"; // gray — no transactions
    if (val > 0) {
      if (date === selectedDate) color = "#7c3aed";
      else if (avgDailySpend > 0 && val > avgDailySpend * 1.8) color = "#ef4444";
      else color = "#60a5fa";
    } else if (date === selectedDate) {
      color = "#c4b5fd";
    }
    return { value: val, itemStyle: { color } };
  });

  const xLabels = allDays.map((d) => d.split("-")[2]); // day numbers "01"…"31"

  const option = {
    tooltip: {
      trigger: "axis",
      formatter: (params: { dataIndex: number }[]) => {
        const p = params[0];
        const date = allDays[p.dataIndex];
        const stat = dailyMap[date];
        if (!stat) return `<strong>${date}</strong><br/>No transactions`;
        const total = stat.total ?? 0;
        return `<strong>${date}</strong><br/>₹${total.toLocaleString("en-IN", { maximumFractionDigits: 0 })}<br/>${stat.tx_count} txns`;
      },
    },
    grid: { left: 48, right: 12, top: 8, bottom: 28 },
    xAxis: {
      type: "category",
      data: xLabels,
      axisLabel: { fontSize: 10, color: "#9ca3af" },
      axisTick: { show: false },
      axisLine: { lineStyle: { color: "#f3f4f6" } },
    },
    yAxis: {
      type: "value",
      axisLabel: {
        fontSize: 10,
        color: "#9ca3af",
        formatter: (v: number) =>
          v >= 1000 ? `₹${(v / 1000).toFixed(0)}k` : `₹${v}`,
      },
      splitLine: { lineStyle: { color: "#f9fafb" } },
    },
    series: [
      {
        type: "bar",
        data: barData,
        barMaxWidth: 18,
        itemStyle: { borderRadius: [3, 3, 0, 0] },
        emphasis: { itemStyle: { opacity: 0.85 } },
      },
    ],
  };

  const handleClick = (params: { dataIndex: number }) => {
    const date = allDays[params.dataIndex];
    onBarClick(date);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-gray-700">Daily Spend</p>
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-300 inline-block" /> normal
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-400 inline-block" /> &gt;1.8× avg
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-purple-500 inline-block" /> selected
          </span>
        </div>
      </div>
      <ReactECharts
        option={option}
        style={{ height: 180, width: "100%" }}
        notMerge
        onEvents={{ click: handleClick }}
      />
    </div>
  );
}
