import React from "react";
import { calculatePercentageChange } from "../functions";
import { StatCard } from "./StatCard";

type SnapshotData = {
  snapshotMonth: string;
  current: {
    netWorth: number;
    totalPositive: number;
    totalNegative: number;
  };
  previous?: {
    netWorth: number;
    totalPositive: number;
    totalNegative: number;
  } | null;
};

type SnapshotViewProps = {
  data: SnapshotData;
  year: number;
  month: number;
  onMonthChange: (m: number) => void;
  onYearChange: (y: number) => void;
};

// const percentChange = (current: number, previous?: number | null) => {
//   if (!previous || previous === 0) return null;
//   return ((current - previous) / previous) * 100;
// };

export const SnapshotView: React.FC<SnapshotViewProps> = ({
  data,
  year,
  month,
  onMonthChange,
  onYearChange,
}) => {
  const { current, previous } = data;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-800">Snapshot</h2>

        <div className="flex gap-2">
          <select
            className="border rounded-md px-2 py-1 text-sm"
            value={month}
            onChange={(e) => onMonthChange(Number(e.target.value))}
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString("default", { month: "short" })}
              </option>
            ))}
          </select>

          <select
            className="border rounded-md px-2 py-1 text-sm"
            value={year}
            onChange={(e) => onYearChange(Number(e.target.value))}
          >
            {[year, year - 1, year - 2].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="text-xs text-gray-400 mb-4">
        Compared to previous month
      </p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Net Worth"
                  value={current.netWorth}
                  //@ts-ignore
          percentageChange={calculatePercentageChange(
            current.netWorth,
            previous?.netWorth
          )}
          isPositiveTrend={
            previous ? current.netWorth >= previous.netWorth : true
          }
        />

        <StatCard
          title="Assets"
                  value={current.totalPositive}
                                    //@ts-ignore

          percentageChange={calculatePercentageChange(
            current.totalPositive,
            previous?.totalPositive
          )}
          isPositiveTrend={
            previous
              ? current.totalPositive >= previous.totalPositive
              : true
          }
        />

        <StatCard
          title="Liabilities"
                  value={current.totalNegative}
                                    //@ts-ignore

          percentageChange={calculatePercentageChange(
            current.totalNegative,
            previous?.totalNegative
          )}
          isPositiveTrend={
            previous
              ? current.totalNegative <= previous.totalNegative
              : true
          }
        />

        <StatCard
          title="Net Change"
          value={
            previous
              ? current.netWorth - previous.netWorth
              : current.netWorth
          }
        />
      </div>
    </div>
  );
};
