import { fmtCurrency } from "@/utils/fmtCurrency";
import type { MonthlySummaryData } from "./types";

export function SummaryCards({ summary }: { summary: MonthlySummaryData["summary"] }) {
  const netPositive = summary.net_flow >= 0;

  const cards = [
    {
      label: "Total Spent",
      value: fmtCurrency(summary.total_spent),
      color: "text-red-600",
      bg: "bg-red-50",
      icon: "↓",
      iconColor: "text-red-400",
    },
    {
      label: "Total Credited",
      value: fmtCurrency(summary.total_credited),
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      icon: "↑",
      iconColor: "text-emerald-400",
    },
    {
      label: "Net Flow",
      value: fmtCurrency(Math.abs(summary.net_flow)),
      prefix: netPositive ? "+" : "−",
      color: netPositive ? "text-emerald-600" : "text-red-600",
      bg: netPositive ? "bg-emerald-50" : "bg-red-50",
      icon: netPositive ? "≈" : "≈",
      iconColor: netPositive ? "text-emerald-400" : "text-red-400",
    },
    {
      label: "Transactions",
      value: summary.tx_count.toLocaleString("en-IN"),
      color: "text-gray-800",
      bg: "bg-gray-50",
      icon: "#",
      iconColor: "text-gray-400",
      plain: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.label} className={`rounded-2xl bg-white shadow-sm border border-gray-100 p-4`}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{card.label}</p>
            <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${card.bg} ${card.iconColor}`}>
              {card.icon}
            </span>
          </div>
          <p className={`text-2xl font-bold ${card.color}`}>
            {"prefix" in card ? card.prefix : ""}
            {card.value}
          </p>
          {!card.plain && (
            <p className="text-xs text-gray-400 mt-1">
              avg ₹{(summary.avg_daily_spend ?? 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}/day
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
