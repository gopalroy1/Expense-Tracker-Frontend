import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { API } from "../../../api";
import ConfirmModal from "../../common/ConfirmModal";
import EditableDropdown from "./editableDropdown";
import { formatCurrency, getToday, normalizeDate } from "./helper";
import type { NetworthEntry, PropsNetworthTable } from "./type";

export default function NetworthTable({
  entries,
  accountTypes,
  onUpdate,
  onDelete,
  onAdd,
}: PropsNetworthTable) {
  const dispatch = useDispatch();

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
  const [showConfirm, setShowConfirm] = useState(false);
const [deleteId, setDeleteId] = useState<string | null>(null);

const askDelete = (id: string) => {
  setDeleteId(id);
  setShowConfirm(true);
};

  const getTypeObj = (type: string | undefined) =>
    accountTypes.find((t) => t.type === type);

  const getNamesFor = (type: string | undefined) =>
    getTypeObj(type)?.accountNames || [];

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

    try {
      await onUpdate(id, {
        ...payload,
        balance: payload.balance !== undefined ? Number(payload.balance) : undefined,
        snapshotDate: payload.snapshotDate!,
      });
      
    } catch (error) {
      toast.error("Failed to update entry");
    }

    cancelEdit(id);
  };

  const refreshAccounts = async () => {
    try {
      //@ts-ignore
      await loadAccountsFn(dispatch, setAccounts);
    } catch (err) {
      toast.error("Unable to refresh accounts");
    }
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
                    <EditableDropdown
                      label=""
                      items={accountTypes.map((t) => ({ id: t.id, name: t.type }))}
                      selected={{ name: local.accountType }}
                            //@ts-ignore

                      onSelect={(item) =>
                        setEditState((s) => ({
                          ...s,
                          [row.id]: {
                            ...(s[row.id] || {}),
                            accountType: item.name,
                            accountName: "",
                          },
                        }))
                      }
                            //@ts-ignore

                      onAdd={async (text) => {
                        await API.addAccountType({ type: text });
                        refreshAccounts();
                      }}
                            //@ts-ignore

                      onUpdate={async (id, text) => {
                        await API.updateType(id, { type: text });
                        refreshAccounts();
                      }}
                            //@ts-ignore

                      onDelete={async (id) => {
                        await API.deleteAccountType(id);
                        refreshAccounts();
                      }}
                    />
                  ) : (
                    <span
                      onClick={() => startEdit(row)}
                      className="cursor-pointer select-none"
                    >
                      {row.accountType}
                    </span>
                  )}
                </td>

                {/* Account Name */}
                <td className="p-3">
                  {isEditing ? (
                    <EditableDropdown
                      label=""
                      items={getNamesFor(local.accountType).map((n) => ({
                        id: n.id,
                        name: n.name,
                      }))}
                      selected={{ name: local.accountName }}
                            //@ts-ignore

                      onSelect={(item) =>
                        setEditState((s) => ({
                          ...s,
                          [row.id]: {
                            ...(s[row.id] || {}),
                            accountName: item.name,
                          },
                        }))
                      }
                            //@ts-ignore

                      onAdd={async (text) => {
                        const typeObj = getTypeObj(local.accountType);
                        if (!typeObj) return;

                        await API.addAccountName({
                          accountTypeId: typeObj.id,
                          name: text,
                        });
                        refreshAccounts();
                      }}
                            //@ts-ignore

                      onUpdate={async (id, text) => {
                        await API.updateName(id, { name: text });
                        refreshAccounts();
                      }}
                            //@ts-ignore

                      onDelete={async (id) => {
                        await API.deleteAccountName(id);
                        refreshAccounts();
                      }}
                    />
                  ) : (
                    <span
                      onClick={() => startEdit(row)}
                      className="cursor-pointer select-none"
                    >
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
                              //@ts-ignore

                        setEditState((s) => ({
                          ...s,
                          [row.id]: {
                            ...(s[row.id] || {}),
                            balance: e.target.value,
                          },
                        }))
                      }
                    />
                  ) : (
                    <span
                      onClick={() => startEdit(row)}
                      className="cursor-pointer select-none"
                    >
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
                        onClick={() => {
                          saveEdit(row.id)
                          toast.success("Entry updated");
                        } 
                        }
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
                          onClick={() => {
                            askDelete(row.id);
                          }}
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
                <EditableDropdown
                  label=""
                  items={accountTypes.map((t) => ({ id: t.id, name: t.type }))}
                  selected={{ name: newRow.accountType }}
                        //@ts-ignore

                  onSelect={(item) =>
                    setNewRow({
                      ...newRow,
                      accountType: item.name,
                      accountName: "",
                    })
                  }
                        //@ts-ignore

                  onAdd={async (text) => {
                    await API.addAccountType({ type: text });
                    refreshAccounts();
                  }}
                        //@ts-ignore

                  onUpdate={async (id, text) => {
                    await API.updateType(id, { type: text });
                    refreshAccounts();
                  }}
                        //@ts-ignore

                  onDelete={async (id) => {
                    await API.deleteAccountType(id);
                    refreshAccounts();
                  }}
                />
              </td>

              <td className="p-3">
                <EditableDropdown
                  label=""
                  items={getNamesFor(newRow.accountType).map((n) => ({
                    id: n.id,
                    name: n.name,
                  }))}
                  selected={{ name: newRow.accountName }}
                        //@ts-ignore

                  onSelect={(item) =>
                    setNewRow({
                      ...newRow,
                      accountName: item.name,
                    })
                  }
                        //@ts-ignore

                  onAdd={async (text) => {
                    const typeObj = getTypeObj(newRow.accountType);
                    if (!typeObj) return;

                    await API.addAccountName({
                      accountTypeId: typeObj.id,
                      name: text,
                    });
                    refreshAccounts();
                  }}
                        //@ts-ignore

                  onUpdate={async (id, text) => {
                    await API.updateName(id, { name: text });
                    refreshAccounts();
                  }}
                        //@ts-ignore

                  onDelete={async (id) => {
                    await API.deleteAccountName(id);
                    refreshAccounts();
                  }}
                />
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

<ConfirmModal
  open={showConfirm}
  title="Delete Entry"
  message="Are you sure you want to delete this entry? This action cannot be undone."
  confirmText="Delete"
  cancelText="Cancel"
        onConfirm={() => {
          onDelete(String(deleteId)) 
          toast.success("Entry deleted");
          setShowConfirm(false);
          setDeleteId(null);
        }}
        onCancel={() => {
          setShowConfirm(false)
          setDeleteId(null);
        }
    
  }
/>

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
