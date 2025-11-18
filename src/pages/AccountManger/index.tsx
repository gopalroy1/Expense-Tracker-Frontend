// src/pages/AccountManager.tsx
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, type JSX } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Toaster, toast } from "sonner";
import { API } from "../../api";
import { useApi } from "../../hooks/useApi";
import { setAccounts, setLoading } from "../../store/accountSlice";
import { DeleteConfirmationModal } from "./deleteConfirmationModal";



export default function AccountManager(): JSX.Element {
    const { callApi } = useApi();
    const dispatch = useDispatch();
    const { accountTypes, loading } = useSelector((s: any) => s.account || {});



    // local UI states
    const [newTypeName, setNewTypeName] = useState("");
    const [addingType, setAddingType] = useState(false);

    const [openTypes, setOpenTypes] = useState<Record<string, boolean>>({});
    const [addingNameFor, setAddingNameFor] = useState<string | null>(null);
    const [newNameValue, setNewNameValue] = useState("");

    const [editingTypeId, setEditingTypeId] = useState<string | null>(null);
    const [editingTypeValue, setEditingTypeValue] = useState("");

    const [editingNameId, setEditingNameId] = useState<string | null>(null);
    const [editingNameValue, setEditingNameValue] = useState("");

    const [confirmDelete, setConfirmDelete] = useState<{ kind: "type" | "name"; id: string } | null>(null);
    const [pendingId, setPendingId] = useState<string | null>(null); // for disabling while action in progress

    // helper: load into redux
    const load = async () => {
        try {
            dispatch(setLoading(true));

            const res = await callApi(() => API.getAccounts());

            // Correct shape
            const types = res.accountTypes ?? [];

            dispatch(setAccounts(types));  // <-- FIXED

            // Open all by default
            setOpenTypes((prev) => {
                const next: Record<string, boolean> = {};
                types.forEach((t: any) => (next[t.id] = prev[t.id] ?? true));
                return next;
            });

        } catch (err: any) {
            toast.error(err?.message || "Failed to load accounts");
        } finally {
            dispatch(setLoading(false));
        }
    };


    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // toggle open/collapse
    const toggleOpen = (id: string) => {
        setOpenTypes((s) => ({ ...s, [id]: !s[id] }));
    };

    // ---------- TYPE CRUD ----------
    const handleAddType = async () => {
        if (!newTypeName.trim()) return;
        setAddingType(true);
        try {
            await callApi(() => API.addAccountType({ type: newTypeName.trim() }));
            setNewTypeName("");
            toast.success("Account type added");
            await load();
        } catch (err: any) {
            toast.error(err?.message || "Failed to add type");
        } finally {
            setAddingType(false);
        }
    };

    const handleSaveEditType = async (id: string) => {
        if (!editingTypeValue.trim()) return;
        setPendingId(id);
        try {
            await callApi(() => API.updateType(id, { type: editingTypeValue.trim() }));
            toast.success("Account type updated");
            setEditingTypeId(null);
            await load();
        } catch (err: any) {
            toast.error(err?.message || "Failed to update type");
        } finally {
            setPendingId(null);
        }
    };

    const handleDeleteType = async (id: string) => {
        setPendingId(id);
        try {
            await callApi(() => API.deleteAccountType(id));
            toast.success("Account type deleted");
            setConfirmDelete(null);
            await load();
        } catch (err: any) {
            toast.error(err?.message || "Failed to delete type");
        } finally {
            setPendingId(null);
        }
    };

    // ---------- NAME CRUD ----------
    const handleAddName = async (typeId: string) => {
        if (!newNameValue.trim()) return;
        setPendingId(typeId);
        try {
            await callApi(() => API.addAccountName({ accountTypeId: typeId, name: newNameValue.trim() }));
            toast.success("Account name added");
            setNewNameValue("");
            setAddingNameFor(null);
            await load();
            // ensure opened
            setOpenTypes((s) => ({ ...s, [typeId]: true }));
        } catch (err: any) {
            toast.error(err?.message || "Failed to add name");
        } finally {
            setPendingId(null);
        }
    };

    const handleSaveEditName = async (id: string) => {
        if (!editingNameValue.trim()) return;
        setPendingId(id);
        try {
            await callApi(() => API.updateName(id, { name: editingNameValue.trim() }));
            toast.success("Account name updated");
            setEditingNameId(null);
            await load();
        } catch (err: any) {
            toast.error(err?.message || "Failed to update name");
        } finally {
            setPendingId(null);
        }
    };

    const handleDeleteName = async (id: string) => {
        setPendingId(id);
        try {
            await callApi(() => API.deleteAccountName(id));
            toast.success("Account name deleted");
            setConfirmDelete(null);
            await load();
        } catch (err: any) {
            toast.error(err?.message || "Failed to delete name");
        } finally {
            setPendingId(null);
        }
    };

    // small utility for neumorphic shadow (fallback if tailwind plugin not present)
    const neuStyle =
        "bg-[#eef3f7] rounded-2xl p-4 shadow-[9px_9px_16px_rgba(0,0,0,0.06),-9px_-9px_16px_rgba(255,255,255,0.8)]";

    return (
        <>
            {/* Local Toaster in case root doesn't have one yet */}
            <Toaster position="top-center" richColors />

            <div className="max-w-7xl mx-auto p-6">
                <header className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-semibold">Manage Accounts</h1>
                    <div className="text-sm text-gray-600">{loading ? "Loading…" : `${accountTypes?.length || 0} types`}</div>
                </header>

                {/* Add Type */}
                <div className="mb-6 flex gap-3">
                    <input
                        value={newTypeName}
                        onChange={(e) => setNewTypeName(e.target.value)}
                        placeholder="Add account type (Bank, Wallet...)"
                        className="flex-1 border rounded-lg px-3 py-2 bg-white/70"
                    />
                    <button
                        onClick={handleAddType}
                        disabled={addingType}
                        className="px-4 py-2 rounded-lg text-white bg-gradient-to-br from-blue-500 to-blue-700 shadow-md"
                    >
                        {addingType ? "Adding..." : "Add Type"}
                    </button>
                </div>

                {/* Grid of cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {accountTypes?.map((t: any) => (
                            <motion.div
                                key={t.id}
                                layout
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                transition={{ type: "spring", stiffness: 250, damping: 20 }}
                                className={`relative ${neuStyle}`}
                            >
                                {/* Card header */}
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <button
                                            aria-label={openTypes[t.id] ? "Collapse" : "Expand"}
                                            onClick={() => toggleOpen(t.id)}
                                            className="text-lg p-1 rounded-md hover:bg-white/50"
                                        >
                                            {openTypes[t.id] ? "▾" : "▸"}
                                        </button>

                                        {editingTypeId === t.id ? (
                                            <input
                                                className="border rounded-md px-2 py-1 bg-white"
                                                value={editingTypeValue}
                                                onChange={(e) => setEditingTypeValue(e.target.value)}
                                            />
                                        ) : (
                                            <h2 className="text-lg font-semibold">{t.type}</h2>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {editingTypeId === t.id ? (
                                            <>
                                                <button
                                                    disabled={pendingId === t.id}
                                                    onClick={() => handleSaveEditType(t.id)}
                                                    className="text-sm text-blue-600"
                                                >
                                                    Save
                                                </button>
                                                <button onClick={() => setEditingTypeId(null)} className="text-sm text-gray-500">
                                                    Cancel
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => {
                                                        setEditingTypeId(t.id);
                                                        setEditingTypeValue(t.type);
                                                    }}
                                                    className="text-sm text-gray-700 hover:text-black"
                                                >
                                                    Edit
                                                </button>
                                                <button onClick={() => setConfirmDelete({ kind: "type", id: t.id })} className="text-sm text-red-600">
                                                    Delete
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Body (names + add input) */}
                                <AnimatePresence>
                                    {openTypes[t.id] && (
                                        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="mt-4 space-y-3">
                                            {/* account names */}
                                            <div className="space-y-2">
                                                {t.accountNames.length === 0 ? (
                                                    <div className="text-sm text-gray-500">No accounts yet.</div>
                                                ) : (
                                                    t.accountNames.map((n: any) => (
                                                        <motion.div
                                                            key={n.id}
                                                            layout
                                                            initial={{ opacity: 0, x: -8 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            exit={{ opacity: 0, x: -8 }}
                                                            transition={{ duration: 0.18 }}
                                                            className="flex items-center justify-between gap-3 bg-white/60 border rounded-md px-3 py-2"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                {editingNameId === n.id ? (
                                                                    <input
                                                                        className="px-2 py-1 rounded-md border bg-white"
                                                                        value={editingNameValue}
                                                                        onChange={(e) => setEditingNameValue(e.target.value)}
                                                                    />
                                                                ) : (
                                                                    <div className="text-sm font-medium">{n.name}</div>
                                                                )}
                                                            </div>

                                                            <div className="flex items-center gap-2">
                                                                {editingNameId === n.id ? (
                                                                    <>
                                                                        <button onClick={() => handleSaveEditName(n.id)} disabled={pendingId === n.id} className="text-sm text-blue-600">
                                                                            Save
                                                                        </button>
                                                                        <button onClick={() => setEditingNameId(null)} className="text-sm text-gray-500">
                                                                            Cancel
                                                                        </button>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <button
                                                                            onClick={() => {
                                                                                setEditingNameId(n.id);
                                                                                setEditingNameValue(n.name);
                                                                            }}
                                                                            className="text-sm text-gray-700"
                                                                        >
                                                                            Edit
                                                                        </button>
                                                                        <button onClick={() => setConfirmDelete({ kind: "name", id: n.id })} className="text-sm text-red-600">
                                                                            Delete
                                                                        </button>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </motion.div>
                                                    ))
                                                )}
                                            </div>

                                            {/* add name area */}
                                            <div>
                                                {addingNameFor === t.id ? (
                                                    <div className="flex gap-2">
                                                        <input
                                                            value={newNameValue}
                                                            onChange={(e) => setNewNameValue(e.target.value)}
                                                            placeholder="Account name (e.g. HDFC)"
                                                            className="flex-1 px-3 py-2 rounded-md border bg-white"
                                                        />
                                                        <button onClick={() => handleAddName(t.id)} className="px-3 py-2 rounded-md bg-green-600 text-white">
                                                            Add
                                                        </button>
                                                        <button onClick={() => { setAddingNameFor(null); setNewNameValue(""); }} className="px-3 py-2 border rounded-md">
                                                            Cancel
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button onClick={() => setAddingNameFor(t.id)} className="text-sm text-blue-600">
                                                        + Add account name
                                                    </button>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Delete Confirmation Modal */}
                <DeleteConfirmationModal confirmDelete={confirmDelete} setConfirmDelete={setConfirmDelete} handleDeleteType={handleDeleteType} handleDeleteName={handleDeleteName} />
            </div>
        </>
    );
}
