import { useState } from "react";

export interface AccountName {
  id: string;
  name: string;
}

export interface AccountType {
  id: string;
  type: string;
  accountNames: AccountName[];
}

export interface NetworthEntry {
  id: string;
  accountType: string;
  accountName: string;
  balance: number;
  snapshotDate: string; // YYYY-MM-DD or ISO
}

interface Props {
  entries: NetworthEntry[];
  accountTypes: AccountType[];
  onUpdate: (id: string, fields: Partial<NetworthEntry>) => Promise<void> | void;
  onDelete: (id: string) => Promise<void> | void;
  onAdd: (row: Omit<NetworthEntry, "id">) => Promise<void> | void;
}

export default function NetworthTable({
  entries,
  accountTypes,
  onUpdate,
  onDelete,
  onAdd,
}: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editState, setEditState] = useState<Record<string, Partial<NetworthEntry>>>({});

  const [newRowVisible, setNewRowVisible] = useState(false);
  const [newRow, setNewRow] = useState<Partial<NetworthEntry>>({
    accountType: "",
      accountName: "",
    //@ts-ignore
    balance: "",
    snapshotDate: getToday(),
  });

  const getNamesFor = (type: string | undefined) =>
    accountTypes.find((t) => t.type === type)?.accountNames || [];

  const startEdit = (row: NetworthEntry) => {
    setEditingId(row.id);
    setEditState((prev) => ({
      ...prev,
      [row.id]: {
        accountType: row.accountType,
        accountName: row.accountName,
        balance: row.balance,
        snapshotDate: normalizeDate(row.snapshotDate),
      },
    }));
  };

  const cancelEdit = (id: string) => {
    setEditingId(null);
    setEditState((prev) => {
      const cp = { ...prev };
      delete cp[id];
      return cp;
    });
  };

  const saveEdit = async (id: string) => {
    const payload = editState[id];
    if (!payload) return;

    await onUpdate(id, {
      ...payload,
      balance: payload.balance !== undefined ? Number(payload.balance) : undefined,
      snapshotDate: payload.snapshotDate!,
    });

    cancelEdit(id);
  };

  const saveNew = async () => {
    if (!newRow.accountType || !newRow.accountName) return;

    await onAdd({
      accountType: newRow.accountType!,
      accountName: newRow.accountName!,
      balance: Number(newRow.balance ?? 0),
      snapshotDate: newRow.snapshotDate!,
    });

    setNewRow({
      accountType: "",
        accountName: "",
          //@ts-ignore

      balance: "",
      snapshotDate: getToday(),
    });

    setNewRowVisible(false);
  };

  return (
    <div>
      <table className="w-full mt-6 bg-white rounded-lg shadow border border-gray-200">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200 text-gray-700">
            <th className="p-3 text-left font-medium">Account Type</th>
            <th className="p-3 text-left font-medium">Account Name</th>
            <th className="p-3 text-left font-medium">Balance</th>
            <th className="p-3 text-left font-medium">Date</th>
            <th className="p-3 text-left font-medium w-32">Actions</th>
          </tr>
        </thead>

        <tbody>
          {entries.map((row) => {
            const isEditing = editingId === row.id;
            const local = editState[row.id] || {};

            return (
              <tr key={row.id} className="border-b hover:bg-gray-50 transition">
                {/* Account Type */}
                <td className="p-3">
                  {isEditing ? (
                    <select
                      className="border rounded px-2 py-1 w-full"
                      value={local.accountType ?? ""}
                      onChange={(e) =>
                        setEditState((s) => ({
                          ...s,
                          [row.id]: {
                            ...(s[row.id] || {}),
                            accountType: e.target.value,
                            accountName: "",
                          },
                        }))
                      }
                    >
                      <option value="">Select Type</option>
                      {accountTypes.map((t) => (
                        <option key={t.id} value={t.type}>
                          {t.type}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span onClick={() => startEdit(row)} className="cursor-pointer select-none">
                      {row.accountType}
                    </span>
                  )}
                </td>

                {/* Account Name */}
                <td className="p-3">
                  {isEditing ? (
                    <select
                      className="border rounded px-2 py-1 w-full"
                      value={local.accountName ?? ""}
                      onChange={(e) =>
                        setEditState((s) => ({
                          ...s,
                          [row.id]: {
                            ...(s[row.id] || {}),
                            accountName: e.target.value,
                          },
                        }))
                      }
                    >
                      <option value="">Select Name</option>
                      {getNamesFor(local.accountType ?? row.accountType).map((n) => (
                        <option key={n.id} value={n.name}>
                          {n.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span onClick={() => startEdit(row)} className="cursor-pointer select-none">
                      {row.accountName}
                    </span>
                  )}
                </td>

                {/* Balance */}
                <td className="p-3">
                  {isEditing ? (
                    <input
                      type="number"
                      className="border rounded px-2 py-1 w-full"
                      value={
                        local.balance === undefined
                          ? String(row.balance)
                          : String(local.balance)
                      }
                      onChange={(e) =>
                        setEditState((s:any) => ({
                          ...s,
                          [row.id]: {
                            ...(s[row.id] || {}),
                            balance: e.target.value,
                          },
                        }))
                      }
                    />
                  ) : (
                    <span onClick={() => startEdit(row)} className="cursor-pointer select-none">
                      {formatCurrency(row.balance)}
                    </span>
                  )}
                </td>

                {/* Date */}
                <td className="p-3">
                  {isEditing ? (
                    <input
                      type="date"
                      className="border rounded px-2 py-1 w-full"
                      value={local.snapshotDate ?? normalizeDate(row.snapshotDate)}
                      onChange={(e) =>
                        setEditState((s) => ({
                          ...s,
                          [row.id]: {
                            ...(s[row.id] || {}),
                            snapshotDate: e.target.value,
                          },
                        }))
                      }
                    />
                  ) : (
                    <span
                      onClick={() => startEdit(row)}
                      className="cursor-pointer select-none"
                    >
                      {normalizeDate(row.snapshotDate)}
                    </span>
                  )}
                </td>

                {/* Actions */}
                <td className="p-3 space-x-4">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => saveEdit(row.id)}
                        className="text-green-600 font-medium hover:underline"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => cancelEdit(row.id)}
                        className="text-gray-500 hover:underline"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(row)}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(row.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}

          {/* New Row */}
          {newRowVisible && (
            <tr className="border-b bg-green-50">
              <td className="p-3">
                <select
                  className="border rounded px-2 py-1 w-full"
                  value={newRow.accountType ?? ""}
                  onChange={(e) =>
                    setNewRow({
                      ...newRow,
                      accountType: e.target.value,
                      accountName: "",
                    })
                  }
                >
                  <option value="">Select Type</option>
                  {accountTypes.map((t) => (
                    <option key={t.id} value={t.type}>
                      {t.type}
                    </option>
                  ))}
                </select>
              </td>

              <td className="p-3">
                <select
                  className="border rounded px-2 py-1 w-full"
                  value={newRow.accountName ?? ""}
                  onChange={(e) =>
                    setNewRow({
                      ...newRow,
                      accountName: e.target.value,
                    })
                  }
                  disabled={!newRow.accountType}
                >
                  <option value="">Select Name</option>
                  {getNamesFor(newRow.accountType).map((n) => (
                    <option key={n.id} value={n.name}>
                      {n.name}
                    </option>
                  ))}
                </select>
              </td>

              <td className="p-3">
                <input
                  type="number"
                  className="border rounded px-2 py-1 w-full"
                  value={newRow.balance ?? ""}
                                  onChange={(e) =>
                          //@ts-ignore

                    setNewRow({ ...newRow, balance: e.target.value })
                  }
                />
              </td>

              <td className="p-3">
                <input
                  type="date"
                  className="border rounded px-2 py-1 w-full"
                  value={newRow.snapshotDate ?? getToday()}
                  onChange={(e) =>
                    setNewRow({ ...newRow, snapshotDate: e.target.value })
                  }
                />
              </td>

              <td className="p-3 space-x-4">
                <button
                  onClick={saveNew}
                  className="text-green-700 hover:underline font-medium"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setNewRowVisible(false);
                    setNewRow({
                      accountType: "",
                        accountName: "",
                          //@ts-ignore

                      balance: "",
                      snapshotDate: getToday(),
                    });
                  }}
                  className="text-gray-600 hover:underline"
                >
                  Cancel
                </button>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Add new row button */}
      {!newRowVisible && (
        <div className="mt-4">
          <button
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            onClick={() => setNewRowVisible(true)}
          >
            + Add New Entry
          </button>
        </div>
      )}
    </div>
  );
}

/* Helpers */
function getToday(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

function normalizeDate(dateStr: string): string {
  if (!dateStr) return getToday();
  return dateStr.split("T")[0];
}

function formatCurrency(num: number): string {
  if (num < 0) return `-₹${Math.abs(num)}`;
  return `₹${num}`;
}
