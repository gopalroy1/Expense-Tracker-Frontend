// UPDATED SnapshotSection: API-driven, month-aware, no dummy data
// Uses axios, handles no-data & one-month cases

// ---------------- api.ts ----------------
import axiosInstance from "@/api/axios/axiosInstane";

export const fetchMonthlySnapshot = async (year?: number, month?: number) => {
  const params: any = {};
  if (year && month) {
    params.year = year;
    params.month = month;
  }

  const res = await axiosInstance.get("/api/dashboard/snapshot", { params });
  return res.data;
};

// ---------------- StatCard.tsx ----------------
import React, { useEffect, useState } from "react";

type StatCardProps = {
  title: string;
  value: number;
  percentageChange?: number | null;
  isPositiveTrend?: boolean;
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  percentageChange,
  isPositiveTrend = true,
}) => {
  const showTrend = percentageChange !== undefined && percentageChange !== null;

  return (
    <div className="rounded-2xl shadow p-4 bg-white">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-semibold">₹ {value.toLocaleString()}</p>

      {showTrend && (
        <p
          className={`text-sm mt-1 ${
            isPositiveTrend ? "text-green-600" : "text-red-600"
          }`}
        >
          {isPositiveTrend ? "▲" : "▼"} {Math.abs(percentageChange).toFixed(2)}%
        </p>
      )}
    </div>
  );
};


function percentChange(current: number, previous?: number | null) {
  if (previous === null || previous === undefined || previous === 0) return null;
  return ((current - previous) / previous) * 100;
}

export const SnapshotSection: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState<number | null>(null);
  const [month, setMonth] = useState<number | null>(null);

  // Initial load – backend decides default month/year
  useEffect(() => {
    fetchMonthlySnapshot()
      .then((res) => {
        setData(res);
        if (res?.snapshotMonth) {
          const [y, m] = res.snapshotMonth.split("-").map(Number);
          setYear(y);
          setMonth(m);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  // Refetch when user changes month/year
  useEffect(() => {
    if (year && month) {
      setLoading(true);
      fetchMonthlySnapshot(year, month)
        .then(setData)
        .finally(() => setLoading(false));
    }
  }, [year, month]);

  if (loading) {
    return <div className="p-4">Loading snapshot...</div>;
  }

  if (!data || !data.snapshotMonth) {
    return (
      <div className="p-4 bg-white rounded-2xl shadow">
        <p className="text-gray-500">No financial data yet</p>
        <p className="text-sm text-gray-400">
          Add accounts to see your net worth snapshot
        </p>
      </div>
    );
  }

  const { current, previous } = data;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">Snapshot</h2>

        <div className="flex gap-2">
          <select
            className="border rounded px-2 py-1 text-sm"
            value={month ?? ""}
            onChange={(e) => setMonth(Number(e.target.value))}
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString("default", { month: "short" })}
              </option>
            ))}
          </select>

          <select
            className="border rounded px-2 py-1 text-sm"
            value={year ?? ""}
            onChange={(e) => setYear(Number(e.target.value))}
          >
            {[year, year! - 1, year! - 2]
              .filter(Boolean)
                          .map((y) => (
                  //@ts-ignore
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
          </select>
        </div>
      </div>

      <p className="text-xs text-gray-400 mb-3">
        Compared to previous month
      </p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Net Worth"
          value={current.netWorth}
          percentageChange={percentChange(
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
          percentageChange={percentChange(
            current.totalPositive,
            previous?.totalPositive
          )}
          isPositiveTrend={
            previous ? current.totalPositive >= previous.totalPositive : true
          }
        />

        <StatCard
          title="Liabilities"
          value={current.totalNegative}
          percentageChange={percentChange(
            current.totalNegative,
            previous?.totalNegative
          )}
          isPositiveTrend={
            previous ? current.totalNegative <= previous.totalNegative : true
          }
        />

        <StatCard
          title="Net Change"
          value={
            previous ? current.netWorth - previous.netWorth : current.netWorth
          }
        />
      </div>
    </div>
  );
};
