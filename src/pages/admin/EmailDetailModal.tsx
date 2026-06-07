import { useEffect, useState } from "react";
import type { Email, Transaction } from "./types";

function fmt(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export function EmailDetailModal({
  email,
  transactions,
  onClose,
}: {
  email: Email;
  transactions: Transaction[];
  onClose: () => void;
}) {
  const [txOpen, setTxOpen] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const relatedTxs = transactions.filter((t) => t.emailId === email.id);

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div className="pr-8">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Subject</p>
            <h2 className="text-base font-semibold text-gray-800 leading-snug">
              {email.subject ?? <span className="italic text-gray-400">No subject</span>}
            </h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition text-xl leading-none shrink-0">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Metadata */}
          <div className="px-6 py-4 grid grid-cols-2 gap-x-8 gap-y-4 border-b border-gray-100 text-sm">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Sender</p>
              <p className="text-gray-700 break-all">{email.sender ?? "—"}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Received</p>
              <p className="text-gray-700">{fmt(email.receivedAt)}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Saved to DB</p>
              <p className="text-gray-700">{fmt(email.createdAt)}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Gmail Message ID</p>
              <p className="text-gray-500 font-mono text-xs break-all">{email.gmailMessageId}</p>
            </div>
            {email.snippet && (
              <div className="col-span-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Snippet</p>
                <p className="text-gray-600 italic">{email.snippet}</p>
              </div>
            )}
          </div>

          {/* Extracted transactions accordion */}
          <div className="border-b border-gray-100">
            <button
              onClick={() => setTxOpen((v) => !v)}
              className="w-full flex items-center justify-between px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-base">💳</span>
                <span>Extracted Transactions</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${relatedTxs.length > 0 ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-400"}`}>
                  {relatedTxs.length}
                </span>
              </div>
              <span className="text-gray-400 text-xs">{txOpen ? "▲" : "▼"}</span>
            </button>

            {txOpen && (
              <div className="px-6 pb-4 border-t border-gray-50 pt-3">
                {relatedTxs.length === 0 ? (
                  <p className="text-sm text-gray-400 italic">No transactions extracted from this email.</p>
                ) : (
                  <div className="space-y-2">
                    {relatedTxs.map((tx) => {
                      const isDebit = tx.type === "debit";
                      const conf = parseFloat(tx.confidence);
                      const confColor = conf >= 0.85 ? "text-green-600 bg-green-50" : conf >= 0.65 ? "text-yellow-600 bg-yellow-50" : "text-red-600 bg-red-50";
                      const amt = parseFloat(tx.amount ?? "");
                      const amtDisplay = isNaN(amt) ? "—" : `₹${amt.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
                      return (
                        <div key={tx.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg text-sm">
                          <span className={`font-bold text-base ${isDebit ? "text-red-500" : "text-green-500"}`}>
                            {isDebit ? "−" : "+"}{amtDisplay}
                          </span>
                          <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full uppercase ${isDebit ? "bg-red-50 text-red-500" : "bg-green-50 text-green-600"}`}>
                            {tx.type}
                          </span>
                          {tx.platform && <span className="text-gray-700">{tx.platform}</span>}
                          {tx.category && (
                            <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">{tx.category}</span>
                          )}
                          {tx.accountName && (
                            <span className="text-xs text-gray-500 ml-auto">{tx.accountName}</span>
                          )}
                          <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${confColor}`}>
                            {Math.round(conf * 100)}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Body */}
          <div className="px-6 py-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Body</p>
            {email.body ? (
              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                {email.body}
              </pre>
            ) : (
              <p className="text-sm text-gray-400 italic">No body content</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
