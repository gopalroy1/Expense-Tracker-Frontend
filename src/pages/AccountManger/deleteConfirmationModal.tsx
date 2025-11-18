import { AnimatePresence, motion } from "framer-motion";

export const DeleteConfirmationModal = ({ confirmDelete, setConfirmDelete, handleDeleteType, handleDeleteName }: { confirmDelete: any, setConfirmDelete: any, handleDeleteType: any, handleDeleteName: any }) => {

    return (
        <AnimatePresence>
            {confirmDelete && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
                    <motion.div initial={{ scale: 0.96 }} animate={{ scale: 1 }} exit={{ scale: 0.96 }} className="bg-white rounded-lg p-6 w-full max-w-md">
                        <p className="mb-4">Are you sure you want to delete this {confirmDelete.kind}?</p>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setConfirmDelete(null)} className="px-4 py-2 border rounded-md">Cancel</button>
                            <button
                                onClick={async () => {
                                    const { kind, id } = confirmDelete!;
                                    setConfirmDelete(null);
                                    if (kind === "type") await handleDeleteType(id);
                                    else await handleDeleteName(id);
                                }}
                                className="px-4 py-2 bg-red-600 text-white rounded-md"
                            >
                                Delete
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}