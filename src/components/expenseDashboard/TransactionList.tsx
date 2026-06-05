import { API } from "@/api/index";
import { useApi } from "@/hooks/useApi";
import { fmtCurrency } from "@/utils/fmtCurrency";
import { useEffect, useState } from "react";
import { CATEGORY_ENUM, CATEGORY_LABELS, type ExpenseTransaction, type Pagination } from "./types";

interface Props {
  month: string;
  accountId?: string;
}

export function TransactionList({ month, accountId }: Props) {
  const { callApi, loading, error } = useApi();

  const [transactions, setTransactions] = useState<ExpenseTransaction[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, total_pages: 1 });
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const fetch = (p: number, cat: string, typ: string, srch: string) => {
    callApi(() =>
      API.getExpenseTransactions({
        month,
        page: p,
        limit: 20,
        category: cat || undefined,
        type: typ || undefined,
        search: srch || undefined,
        account_id: accountId,
      })
    )
      .then((res) => {
        setTransactions(res.data.data);
        setPagination(res.data.pagination);
      })
      .catch(() => {});
  };

  useEffect(() => {
    setPage(1);
    fetch(1, category, type, search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, accountId, category, type, search]);

  useEffect(() => {
    fetch(page, category, type, search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleSearch = () => {
    setPage(1);
    setSearch(searchInput);
  };

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });

  const fmtTime = (iso: string | null) => {
    if (!iso) return "";
    const d = new Date(iso);
    return isNaN(d.getTime()) ? "" : d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <p className="text-sm font-semibold text-gray-700">
          Transactions
          {pagination.total > 0 && (
            <span className="ml-2 text-xs font-normal text-gray-400">
              ({pagination.total} total)
            </span>
          )}
        </p>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
            className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-gray-600 focus:outline-none focus:border-blue-400 bg-white"
          >
            <option value="">All categories</option>
            {CATEGORY_ENUM.map((c) => (
              <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
            ))}
          </select>

          <select
            value={type}
            onChange={(e) => { setType(e.target.value); setPage(1); }}
            className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-gray-600 focus:outline-none focus:border-blue-400 bg-white"
          >
            <option value="">All types</option>
            <option value="debit">Debit</option>
            <option value="credit">Credit</option>
          </select>

          <div className="flex items-center gap-1">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search merchant…"
              className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-gray-600 focus:outline-none focus:border-blue-400 w-40"
            />
            <button
              onClick={handleSearch}
              className="text-xs bg-blue-600 text-white px-2.5 py-1.5 rounded-lg hover:bg-blue-700 transition"
            >
              Go
            </button>
            {search && (
              <button
                onClick={() => { setSearchInput(""); setSearch(""); }}
                className="text-xs text-gray-400 hover:text-gray-600 transition px-1"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12 text-sm text-gray-400">Loading…</div>
      ) : error ? (
        <p className="text-sm text-red-500 py-8 text-center">{error}</p>
      ) : transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 gap-2">
          <p className="text-sm text-gray-400">No transactions found</p>
          {(category || type || search) && (
            <button
              onClick={() => { setCategory(""); setType(""); setSearchInput(""); setSearch(""); }}
              className="text-xs text-blue-500 hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="overflow-x-auto -mx-5 px-5">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide w-20">Date</th>
                  <th className="text-left py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">Merchant</th>
                  <th className="text-left py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide w-32 hidden sm:table-cell">Category</th>
                  <th className="text-left py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide w-32 hidden md:table-cell">Account</th>
                  <th className="text-right py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide w-28">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {transactions.map((tx) => {
                  const isDebit = tx.type === "debit";
                  const label = tx.merchant ?? tx.platform ?? tx.description ?? "—";
                  const catLabel = tx.category ? (CATEGORY_LABELS[tx.category] ?? tx.category) : null;
                  return (
                    <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-2.5 pr-3">
                        <p className="text-xs font-medium text-gray-700">{fmtDate(tx.transaction_date)}</p>
                        {tx.transaction_time && (
                          <p className="text-xs text-gray-400">{fmtTime(tx.transaction_time)}</p>
                        )}
                      </td>
                      <td className="py-2.5 pr-3 max-w-[200px]">
                        <p className="text-sm font-medium text-gray-800 truncate">{label}</p>
                        {tx.description && tx.merchant && (
                          <p className="text-xs text-gray-400 truncate">{tx.description}</p>
                        )}
                      </td>
                      <td className="py-2.5 pr-3 hidden sm:table-cell">
                        {catLabel ? (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full whitespace-nowrap">
                            {catLabel}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-300">—</span>
                        )}
                      </td>
                      <td className="py-2.5 pr-3 hidden md:table-cell">
                        <span className="text-xs text-gray-500">{tx.account_name ?? "—"}</span>
                      </td>
                      <td className="py-2.5 text-right">
                        <span className={`text-sm font-semibold ${isDebit ? "text-red-600" : "text-emerald-600"}`}>
                          {isDebit ? "−" : "+"}{fmtCurrency(tx.amount, tx.currency)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.total_pages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400">
                Page {pagination.page} of {pagination.total_pages}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  ← Prev
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(pagination.total_pages, p + 1))}
                  disabled={page === pagination.total_pages}
                  className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
