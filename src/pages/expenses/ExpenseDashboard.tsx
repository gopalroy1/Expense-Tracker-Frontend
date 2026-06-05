import { API } from "@/api/index";
import { CategoryDonut } from "@/components/expenseDashboard/CategoryDonut";
import { DailyBarChart } from "@/components/expenseDashboard/DailyBarChart";
import { DayDetailPanel } from "@/components/expenseDashboard/DayDetailPanel";
import { SummaryCards } from "@/components/expenseDashboard/SummaryCards";
import { TopMerchants } from "@/components/expenseDashboard/TopMerchants";
import { TransactionList } from "@/components/expenseDashboard/TransactionList";
import type { MonthlySummaryData } from "@/components/expenseDashboard/types";
import { useApi } from "@/hooks/useApi";
import type { RootState } from "@/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function toYYYYMM(year: number, month: number) {
  return `${year}-${String(month).padStart(2, "0")}`;
}

export function ExpenseDashboard() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1); // 1-based
  const [accountId, setAccountId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [summary, setSummary] = useState<MonthlySummaryData | null>(null);

  const { callApi, loading, error } = useApi();

  const accountTypes = useSelector((state: RootState) => state.account.accountTypes);
  const allAccountNames = accountTypes.flatMap((t) => t.accountNames.map((n) => n.name));

  const yyyymm = toYYYYMM(year, month);

  useEffect(() => {
    setSelectedDate(null);
    callApi(() => API.getMonthlySummary(yyyymm, accountId || undefined))
      .then((res) => setSummary(res.data))
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yyyymm, accountId]);

  const goToPrev = () => {
    if (month === 1) { setYear((y) => y - 1); setMonth(12); }
    else setMonth((m) => m - 1);
  };

  const goToNext = () => {
    const isCurrentMonth = year === now.getFullYear() && month === now.getMonth() + 1;
    if (isCurrentMonth) return;
    if (month === 12) { setYear((y) => y + 1); setMonth(1); }
    else setMonth((m) => m + 1);
  };

  const isFutureDisabled =
    year === now.getFullYear() && month === now.getMonth() + 1;

  const handleBarClick = (date: string) => {
    setSelectedDate((prev) => (prev === date ? null : date));
  };

  const monthLabel = new Date(year, month - 1).toLocaleString("en-IN", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-5 pb-10">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={goToPrev}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition text-sm shadow-sm"
          >
            ←
          </button>
          <h1 className="text-lg font-semibold text-gray-800 min-w-[160px] text-center">
            {monthLabel}
          </h1>
          <button
            onClick={goToNext}
            disabled={isFutureDisabled}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition text-sm shadow-sm disabled:opacity-30 disabled:cursor-not-allowed"
          >
            →
          </button>
        </div>

        {allAccountNames.length > 0 && (
          <select
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 focus:outline-none focus:border-blue-400 bg-white shadow-sm"
          >
            <option value="">All accounts</option>
            {allAccountNames.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        )}
      </div>

      {/* ── Loading / Error ── */}
      {loading && !summary && (
        <div className="flex items-center justify-center py-20 text-sm text-gray-400">
          Loading summary…
        </div>
      )}
      {error && !summary && (
        <p className="text-sm text-red-500 text-center py-8">{error}</p>
      )}

      {summary && (
        <>
          {/* ── Summary cards ── */}
          <SummaryCards summary={summary.summary} />

          {/* ── Daily bar chart ── */}
          <DailyBarChart
            daily={summary.daily}
            month={yyyymm}
            avgDailySpend={summary.summary.avg_daily_spend}
            selectedDate={selectedDate}
            onBarClick={handleBarClick}
          />

          {/* ── Day detail panel ── */}
          {selectedDate && (
            <DayDetailPanel
              date={selectedDate}
              accountId={accountId || undefined}
              onClose={() => setSelectedDate(null)}
            />
          )}

          {/* ── Category + Merchants ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <CategoryDonut categories={summary.categories} />
            <TopMerchants merchants={summary.top_merchants} />
          </div>
        </>
      )}

      {/* ── Transaction list (always shown once month is set) ── */}
      <TransactionList month={yyyymm} accountId={accountId || undefined} />
    </div>
  );
}
