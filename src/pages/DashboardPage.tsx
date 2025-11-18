import React, { useEffect, useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import { API } from "../api";

interface NetworthEntry {
  id: string;
  accountType: string;
  accountName: string;
  balance: number;
  snapshotDate: string; // ISO or YYYY-MM-DD
}

export const DashboardPage: React.FC = () => {
  const today = new Date();
  const [month, setMonth] = useState(String(today.getMonth() + 1).padStart(2, "0"));
  const [year, setYear] = useState(String(today.getFullYear()));
  const [entries, setEntries] = useState<NetworthEntry[]>([]);
  const [loading, setLoading] = useState(false);

  // ----------------------------
  // Fetch API Data
  // ----------------------------
  const loadNetworth = async () => {
    setLoading(true);
    try {
      const res = await API.getNetworthByMonth(Number(month), Number(year));
      setEntries(res.entries || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNetworth();
  }, [month, year]);

  // ----------------------------
  // Compute Graph Data
  // ----------------------------
  const graphData = useMemo(() => {
    const map = new Map<string, number>();

    for (const e of entries) {
      const date = (e.snapshotDate || "").split("T")[0];
      const existing = map.get(date) ?? 0;
      map.set(date, existing + Number(e.balance || 0));
    }

    return Array.from(map.entries())
      .map(([date, total]) => ({
        date,
        total: Number(total.toFixed(2)),
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [entries]);

  // ----------------------------
  // Summary
  // ----------------------------
  const totalNetworth = useMemo(
    () => entries.reduce((s, e) => s + Number(e.balance || 0), 0),
    [entries]
  );

  // ----------------------------
  // Render
  // ----------------------------
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>

        <div className="flex items-center gap-3">
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="border rounded px-3 py-1 bg-white"
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <option key={i} value={String(i + 1).padStart(2, "0")}>
                {new Date(2000, i).toLocaleString("default", { month: "short" })}
              </option>
            ))}
          </select>

          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="border rounded px-3 py-1 w-24 bg-white"
          />
        </div>
      </div>

      {/* --------------------------- */}
      {/* Networth Graph */}
      {/* --------------------------- */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-2">Networth Over Time</h2>

        {loading ? (
          <div className="flex justify-center p-10 text-gray-500">
            Loading graph...
          </div>
        ) : (
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={graphData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(v:any) => `₹${Number(v).toLocaleString()}`} />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#4F46E5"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* --------------------------- */}
      {/* Summary Card */}
      {/* --------------------------- */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="text-sm text-gray-500">Total Networth</div>
        <div className="text-3xl font-semibold mt-2">
          {totalNetworth < 0
            ? `-₹${Math.abs(totalNetworth).toLocaleString()}`
            : `₹${totalNetworth.toLocaleString()}`}
        </div>
      </div>

      {/* --------------------------- */}
      {/* Recent Entries Table */}
      {/* --------------------------- */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-medium mb-3">Recent Entries</h3>
        {!entries.length ? (
          <div className="text-gray-500">No data available</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600 text-xs">
                <th className="py-2">Date</th>
                <th className="py-2">Account Name</th>
                <th className="py-2">Type</th>
                <th className="py-2">Balance</th>
              </tr>
            </thead>

            <tbody>
              {entries
                .slice()
                .sort((a, b) => (b.snapshotDate || "").localeCompare(a.snapshotDate || ""))
                .slice(0, 8)
                .map((e) => (
                  <tr key={e.id} className="border-t">
                    <td className="py-2">{(e.snapshotDate || "").split("T")[0]}</td>
                    <td className="py-2">{e.accountName}</td>
                    <td className="py-2">{e.accountType}</td>
                    <td className="py-2">
                      {e.balance < 0
                        ? `-₹${Math.abs(e.balance).toLocaleString()}`
                        : `₹${e.balance.toLocaleString()}`}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
