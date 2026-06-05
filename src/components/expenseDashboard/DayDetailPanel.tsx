import { API } from "@/api/index";
import { useApi } from "@/hooks/useApi";
import { fmtCurrency } from "@/utils/fmtCurrency";
import { useEffect, useRef, useState } from "react";
import { CATEGORY_LABELS, type DayDetailData } from "./types";

interface Props {
  date: string;
  accountId?: string;
  onClose: () => void;
}

export function DayDetailPanel({ date, accountId, onClose }: Props) {
  const { callApi, loading, error } = useApi();
  const [detail, setDetail] = useState<DayDetailData | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    callApi(() => API.getDayDetail(date, accountId))
      .then((res) => setDetail(res.data))
      .catch(() => {});
  }, [date, accountId]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const ratio = detail && detail.avg_daily_spend > 0
    ? detail.total_spent / detail.avg_daily_spend
    : null;

  const pillStyle =
    ratio === null ? null
    : ratio < 0.7 ? { bg: "bg-emerald-100", text: "text-emerald-700" }
    : ratio <= 1.5 ? { bg: "bg-amber-100", text: "text-amber-700" }
    : { bg: "bg-red-100", text: "text-red-700" };

  const fmt = (iso: string | null) => {
    if (!iso) return "";
    const d = new Date(iso);
    return isNaN(d.getTime()) ? "" : d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div
      ref={panelRef}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-in slide-in-from-top-2 duration-150"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Day Detail</p>
            <p className="text-base font-semibold text-gray-800">{date}</p>
          </div>
          {detail && (
            <p className="text-lg font-bold text-red-600">{fmtCurrency(detail.total_spent)}</p>
          )}
          {ratio !== null && pillStyle && (
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${pillStyle.bg} ${pillStyle.text}`}>
              {ratio.toFixed(1)}× your daily average
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition text-lg leading-none"
        >
          ✕
        </button>
      </div>

      {/* Body */}
      {loading && (
        <div className="flex items-center justify-center py-8 text-sm text-gray-400">Loading…</div>
      )}
      {error && (
        <p className="text-sm text-red-500 py-4">{error}</p>
      )}
      {!loading && detail && detail.transactions.length === 0 && (
        <p className="text-sm text-gray-400 py-4 text-center">No transactions on this day.</p>
      )}
      {!loading && detail && detail.transactions.length > 0 && (
        <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto -mx-5 px-5">
          {detail.transactions.map((tx) => {
            const isDebit = tx.type === "debit";
            const label = tx.merchant ?? tx.platform ?? tx.description ?? "—";
            const catLabel = tx.category ? (CATEGORY_LABELS[tx.category] ?? tx.category) : null;
            return (
              <div key={tx.id} className="flex items-center justify-between py-2.5">
                <div className="flex-1 min-w-0 pr-4">
                  <p className="text-sm font-medium text-gray-800 truncate">{label}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {catLabel && (
                      <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">
                        {catLabel}
                      </span>
                    )}
                    {tx.transaction_time && (
                      <span className="text-xs text-gray-400">{fmt(tx.transaction_time)}</span>
                    )}
                    {tx.account_name && (
                      <span className="text-xs text-gray-400">{tx.account_name}</span>
                    )}
                  </div>
                </div>
                <span className={`text-sm font-semibold shrink-0 ${isDebit ? "text-red-600" : "text-emerald-600"}`}>
                  {isDebit ? "−" : "+"}{fmtCurrency(tx.amount, tx.currency)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
