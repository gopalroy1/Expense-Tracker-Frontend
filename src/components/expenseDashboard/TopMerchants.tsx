import { fmtCurrency } from "@/utils/fmtCurrency";
import type { MerchantStat } from "./types";

export function TopMerchants({ merchants }: { merchants: MerchantStat[] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col">
      <p className="text-sm font-semibold text-gray-700 mb-4">Top Merchants</p>

      {merchants.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-gray-400">No merchant data</p>
        </div>
      ) : (
        <div className="space-y-3 overflow-y-auto">
          {merchants.map((m, i) => (
            <div key={m.merchant} className="flex items-center gap-3">
              <span className="w-5 text-xs font-semibold text-gray-400 shrink-0">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-800 truncate">{m.merchant}</p>
                  {m.is_recurring && (
                    <span className="text-[10px] font-semibold bg-blue-50 text-blue-500 px-1.5 py-0.5 rounded-full shrink-0">
                      recurring
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400">{m.tx_count} transaction{m.tx_count !== 1 ? "s" : ""}</p>
              </div>
              <span className="text-sm font-semibold text-red-600 shrink-0">
                {fmtCurrency(m.total)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
