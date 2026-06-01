import { useEffect, useState } from "react";
import type { Email, Transaction } from "./types";

function fmt(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-IN", {
    hour: "2-digit", minute: "2-digit",
  });
}

function confidenceColor(val: string) {
  const n = parseFloat(val);
  if (n >= 0.85) return "text-green-600 bg-green-50";
  if (n >= 0.65) return "text-yellow-600 bg-yellow-50";
  return "text-red-600 bg-red-50";
}

export function TransactionDetailModal({
  tx,
  emails,
  onClose,
}: {
  tx: Transaction;
  emails: Email[];
  onClose: () => void;
}) {
  const [emailOpen, setEmailOpen] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const txType = tx.type?.toLowerCase();
  const isDebit = txType === "debit";
  const isCredit = txType === "credit";
  const amt = parseFloat(tx.amount);
  const amtDisplay = isNaN(amt) ? "—" : `₹${amt.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
  const sourceEmail = emails.find((e) => e.id === tx.emailId) ?? null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <span className={`text-2xl font-bold ${isDebit ? "text-red-500" : "text-green-500"}`}>
              {isDebit ? "−" : "+"} {amtDisplay}
            </span>
            {(isDebit || isCredit) && (
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full uppercase ${isDebit ? "bg-red-50 text-red-500" : "bg-green-50 text-green-600"}`}>
                {tx.type}
              </span>
            )}
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${confidenceColor(tx.confidence)}`}>
              {Math.round(parseFloat(tx.confidence) * 100)}% confidence
            </span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition text-xl leading-none">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Transaction details */}
          <div className="px-6 py-4 grid grid-cols-2 gap-x-8 gap-y-4 text-sm border-b border-gray-100">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Platform</p>
              <p className="text-gray-700">{tx.platform ?? "—"}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Category</p>
              <p className="text-gray-700">{tx.category ?? "—"}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Transaction Date</p>
              <p className="text-gray-700">{tx.transactionDate ? fmtDate(tx.transactionDate) : "—"}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Transaction Time</p>
              <p className="text-gray-700">{tx.transactionTime ? fmtTime(tx.transactionTime) : "—"}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Account Name</p>
              <p className="text-gray-700">{tx.accountName ?? "—"}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Account Type</p>
              <p className="text-gray-700">{tx.accountType ?? "—"}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Account Number</p>
              <p className="text-gray-700 font-mono">{tx.accountNumber ?? "—"}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Is Transaction Email</p>
              <p className={tx.isTransactionEmail ? "text-green-600" : "text-gray-500"}>
                {tx.isTransactionEmail ? "Yes" : "No"}
              </p>
            </div>
            {tx.description && (
              <div className="col-span-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Description</p>
                <p className="text-gray-700">{tx.description}</p>
              </div>
            )}
            {tx.rawSubject && (
              <div className="col-span-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Raw Subject</p>
                <p className="text-gray-600 italic">{tx.rawSubject}</p>
              </div>
            )}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Saved to DB</p>
              <p className="text-gray-500">{fmt(tx.createdAt)}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Email ID</p>
              <p className="text-gray-400 font-mono text-xs break-all">{tx.emailId}</p>
            </div>
          </div>

          {/* Source email accordion */}
          <div className="border-t border-gray-100">
            <button
              onClick={() => setEmailOpen((v) => !v)}
              className="w-full flex items-center justify-between px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-base">📧</span>
                <span>Source Email</span>
                {!sourceEmail && (
                  <span className="text-xs text-gray-400">(not in current filter)</span>
                )}
              </div>
              <span className="text-gray-400 text-xs">{emailOpen ? "▲" : "▼"}</span>
            </button>

            {emailOpen && (
              <div className="px-6 pb-4 space-y-3 text-sm border-t border-gray-50 pt-4">
                {!sourceEmail ? (
                  <p className="text-gray-400 italic text-sm">
                    Email not found in current view. It may be outside the selected date range.
                  </p>
                ) : (
                  <>
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Subject</p>
                      <p className="text-gray-800 font-medium">{sourceEmail.subject ?? <span className="italic text-gray-400">No subject</span>}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Sender</p>
                        <p className="text-gray-700 break-all">{sourceEmail.sender ?? "—"}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Received</p>
                        <p className="text-gray-700">{fmt(sourceEmail.receivedAt)}</p>
                      </div>
                    </div>
                    {sourceEmail.snippet && (
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Snippet</p>
                        <p className="text-gray-600 italic">{sourceEmail.snippet}</p>
                      </div>
                    )}
                    {sourceEmail.body && (
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Body</p>
                        <pre className="text-xs text-gray-600 whitespace-pre-wrap font-sans leading-relaxed bg-gray-50 rounded-lg p-3 max-h-48 overflow-y-auto">
                          {sourceEmail.body}
                        </pre>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
