import { API } from "@/api/index";
import { useApi } from "@/hooks/useApi";
import React, { useEffect, useState } from "react";
import { EmailDetailModal } from "./EmailDetailModal";
import { TransactionDetailModal } from "./TransactionDetailModal";
import type { AdminUser, Email, Transaction } from "./types";

type Tab = "emails" | "transactions";

export const AdminPanel: React.FC = () => {
  const { callApi, loading: usersLoading } = useApi();
  const { callApi: callEmailsApi, loading: emailsLoading } = useApi();
  const { callApi: callTxApi, loading: txLoading } = useApi();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("emails");

  const [emails, setEmails] = useState<Email[]>([]);
  const [emailCount, setEmailCount] = useState(0);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [, setTxCount] = useState(0);

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    callApi(() => API.getAdminUsers())
      .then((res) => setUsers(res.data.users))
      .catch(() => setError("Failed to load users. Make sure you're an admin."));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadEmails = (userId: string, fromDate?: string, toDate?: string) => {
    callEmailsApi(() => API.getAdminUserEmails(userId, fromDate, toDate))
      .then((res) => { setEmails(res.data.emails); setEmailCount(res.data.count); })
      .catch(() => setError("Failed to load emails."));
  };

  const loadTransactions = (userId: string, fromDate?: string, toDate?: string) => {
    callTxApi(() => API.getAdminUserTransactions(userId, fromDate, toDate))
      .then((res) => {
        // API returns snake_case; map to camelCase to match Transaction type
         
         
        console.log("[AdminPanel] raw tx sample:", res.data.transactions[0]);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mapped: Transaction[] = res.data.transactions.map((t: any) => ({
          id: t.id,
          emailId: t.email_id,
          userId: t.user_id,
          amount: t.amount,
          type: t.type,
          platform: t.platform,
          merchant: t.merchant,
          currency: t.currency,
          category: t.category,
          accountType: t.account_type,
          accountNumber: t.account_number,
          accountName: t.account_name,
          transactionDate: t.transaction_date,
          transactionTime: t.transaction_time,
          description: t.description,
          rawSubject: t.raw_subject,
          isTransactionEmail: t.is_transaction_email,
          confidence: t.confidence,
          createdAt: t.created_at,
        }));
        setTransactions(mapped);
        setTxCount(res.data.count ?? mapped.length);
      })
      .catch(() => setError("Failed to load transactions."));
  };

  const handleSelectUser = (user: AdminUser) => {
    setSelectedUser(user);
    setEmails([]);
    setTransactions([]);
    setFrom("");
    setTo("");
    setActiveTab("emails");
    loadEmails(user.id);
    loadTransactions(user.id);
  };

  const handleFilter = () => {
    if (!selectedUser) return;
    const f = from || undefined;
    const t = to || undefined;
    if (activeTab === "emails") loadEmails(selectedUser.id, f, t);
    else loadTransactions(selectedUser.id, f, t);
  };

  const isLoading = activeTab === "emails" ? emailsLoading : txLoading;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top header */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-3 shadow-sm">
        <span className="text-base font-semibold text-gray-800">Admin Panel</span>
        {!usersLoading && (
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
            {users.length} users
          </span>
        )}
      </div>

      {error && (
        <div className="mx-6 mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* ── Left: User list ── */}
        <aside className="w-72 bg-white border-r border-gray-200 flex flex-col overflow-hidden shadow-sm">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Users</p>
          </div>

          {usersLoading ? (
            <div className="flex-1 flex items-center justify-center text-sm text-gray-400">Loading…</div>
          ) : (
            <ul className="flex-1 overflow-y-auto">
              {users.map((user) => {
                const active = selectedUser?.id === user.id;
                return (
                  <li
                    key={user.id}
                    onClick={() => handleSelectUser(user)}
                    className={`px-4 py-3 cursor-pointer border-l-2 transition-all ${
                      active
                        ? "bg-blue-50 border-blue-500"
                        : "border-transparent hover:bg-gray-50 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-sm font-medium truncate ${active ? "text-blue-700" : "text-gray-800"}`}>
                        {user.name}
                      </span>
                      {user.isAdmin && (
                        <span className="text-[10px] font-semibold bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded-full shrink-0">
                          admin
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 truncate mt-0.5">{user.email}</p>
                    <p className="text-xs text-gray-300 mt-0.5">
                      {[user.city, new Date(user.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })].filter(Boolean).join(" · ")}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </aside>

        {/* ── Right: Data panel ── */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {!selectedUser ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-2 text-gray-400">
              <span className="text-3xl">👤</span>
              <p className="text-sm">Select a user to view their data</p>
            </div>
          ) : (
            <>
              {/* User info bar */}
              <div className="bg-white border-b border-gray-200 px-6 pt-4 pb-0 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 text-sm font-bold flex items-center justify-center shrink-0">
                      {selectedUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{selectedUser.name}</p>
                      <p className="text-xs text-gray-400">{selectedUser.email}</p>
                    </div>
                  </div>

                  {/* Date filter */}
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={from}
                      onChange={(e) => setFrom(e.target.value)}
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-gray-600 focus:outline-none focus:border-blue-400"
                    />
                    <span className="text-xs text-gray-400">→</span>
                    <input
                      type="date"
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-gray-600 focus:outline-none focus:border-blue-400"
                    />
                    <button
                      onClick={handleFilter}
                      disabled={isLoading}
                      className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                    >
                      Filter
                    </button>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1">
                  {(["emails", "transactions"] as Tab[]).map((tab) => {
                    const count = tab === "emails" ? emailCount : transactions.filter((t) => t.isTransactionEmail).length;
                    const loading = tab === "emails" ? emailsLoading : txLoading;
                    return (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors capitalize ${
                          activeTab === tab
                            ? "border-blue-500 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        {tab}
                        {!loading && (
                          <span className="ml-1.5 text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">
                            {count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Table area */}
              <div className="flex-1 overflow-auto bg-white">
                {isLoading ? (
                  <div className="flex items-center justify-center h-40 text-sm text-gray-400">Loading…</div>
                ) : activeTab === "emails" ? (
                  emails.length === 0 ? (
                    <div className="flex items-center justify-center h-40 text-sm text-gray-400">No emails found</div>
                  ) : (
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                        <tr>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-56">Subject</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-52">Sender</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Snippet</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-28">Received</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-28">Saved</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {emails.map((email) => {
                          const hasTx = transactions.some(
                            (t) => t.emailId === email.id && t.isTransactionEmail
                          );
                          const wasProcessed = !hasTx && transactions.some((t) => t.emailId === email.id);
                          return (
                            <tr
                              key={email.id}
                              onClick={() => setSelectedEmail(email)}
                              className={`cursor-pointer transition-colors group ${
                                hasTx
                                  ? "bg-emerald-50 hover:bg-emerald-100"
                                  : wasProcessed
                                  ? "bg-amber-50 hover:bg-amber-100"
                                  : "hover:bg-blue-50"
                              }`}
                            >
                              <td className="px-4 py-2.5 max-w-[14rem]">
                                <div className="flex items-center gap-1.5">
                                  {hasTx && <span className="text-emerald-500 shrink-0" title="Has extracted transactions">💳</span>}
                                  {wasProcessed && <span className="text-amber-400 shrink-0" title="Processed — not a transaction email">○</span>}
                                  <span className="block truncate font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                                    {email.subject ?? <span className="italic text-gray-300">No subject</span>}
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-2.5 max-w-[13rem]">
                                <span className="block truncate text-gray-600">{email.sender ?? "—"}</span>
                              </td>
                              <td className="px-4 py-2.5 max-w-xs">
                                <span className="block truncate text-gray-400">{email.snippet ?? "—"}</span>
                              </td>
                              <td className="px-4 py-2.5 text-xs text-gray-500 whitespace-nowrap">
                                {new Date(email.receivedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                              </td>
                              <td className="px-4 py-2.5 text-xs text-gray-400 whitespace-nowrap">
                                {new Date(email.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )
                ) : (
                  transactions.length === 0 ? (
                    <div className="flex items-center justify-center h-40 text-sm text-gray-400">No transactions found</div>
                  ) : (
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                        <tr>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-28">Date</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-36">Amount</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-32">Platform</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-28">Category</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-40">Account</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Description</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-20">Conf.</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {transactions.filter((tx) => tx.isTransactionEmail).map((tx) => {
                          const txType = tx.type?.toLowerCase();
                          const isDebit = txType === "debit";
                          const isCredit = txType === "credit";
                          const conf = parseFloat(tx.confidence);
                          const confColor = conf >= 0.85 ? "text-green-600" : conf >= 0.65 ? "text-yellow-600" : "text-red-500";
                          const amt = parseFloat(tx?.amount ?? "");
                          const amtDisplay = isNaN(amt) ? "—" : `₹${amt.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
                          const dateDisplay = tx.transactionDate
                            ? new Date(tx.transactionDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                            : "—";
                          return (
                            <tr
                              key={tx.id}
                              onClick={() => setSelectedTx(tx)}
                              className={`cursor-pointer transition-colors group ${
                                isDebit
                                  ? "bg-red-50/40 hover:bg-red-100/60"
                                  : isCredit
                                  ? "bg-green-50/40 hover:bg-green-100/60"
                                  : "hover:bg-blue-50"
                              }`}
                            >
                              <td className="px-4 py-2.5 text-xs text-gray-500 whitespace-nowrap">
                                {dateDisplay}
                              </td>
                              <td className="px-4 py-2.5 whitespace-nowrap">
                                <div className="flex items-center gap-1.5">
                                  {(isDebit || isCredit) && (
                                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${isDebit ? "bg-red-50 text-red-500" : "bg-green-50 text-green-600"}`}>
                                      {isDebit ? "−" : "+"}
                                    </span>
                                  )}
                                  <span className="font-semibold text-gray-800">{amtDisplay}</span>
                                </div>
                              </td>
                              <td className="px-4 py-2.5">
                                <span className="block truncate text-gray-700">{tx.platform ?? "—"}</span>
                              </td>
                              <td className="px-4 py-2.5">
                                <span className="block truncate text-gray-600">{tx.category ?? "—"}</span>
                              </td>
                              <td className="px-4 py-2.5 max-w-[10rem]">
                                <span className="block truncate text-gray-600">
                                  {tx.accountName ?? tx.accountNumber ?? "—"}
                                </span>
                              </td>
                              <td className="px-4 py-2.5 max-w-xs">
                                <span className="block truncate text-gray-400">{tx.description ?? "—"}</span>
                              </td>
                              <td className={`px-4 py-2.5 text-xs font-semibold ${confColor}`}>
                                {Math.round(conf * 100)}%
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )
                )}
              </div>
            </>
          )}
        </main>
      </div>

      {selectedEmail && (
        <EmailDetailModal
          email={selectedEmail}
          transactions={transactions}
          onClose={() => setSelectedEmail(null)}
        />
      )}
      {selectedTx && (
        <TransactionDetailModal
          tx={selectedTx}
          emails={emails}
          onClose={() => setSelectedTx(null)}
        />
      )}
    </div>
  );
};
