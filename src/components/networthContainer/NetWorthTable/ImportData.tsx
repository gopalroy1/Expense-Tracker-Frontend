import { useState } from "react";
import { toast } from "sonner";
import { API } from "../../../api";
import ConfirmModal from "../../common/ConfirmModal";

export default function ImportData() {
  const [month, setMonth] = useState(1);
  const [year, setYear] = useState(2025);
  const [targetDate, setTargetDate] = useState("");
  const [openConfirm, setOpenConfirm] = useState(false);

  const handleSubmit = () => {
    if (!targetDate) return toast.error("Please select a target date");
    setOpenConfirm(true);
  };

  const performImport = async () => {
    setOpenConfirm(false);
    try {
      await API.importNetworth({ month, year, targetDate });
      toast.success("Import successful");
    } catch (err) {
      toast.error("Failed to import data");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-2xl">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Import Month Data</h2>

      {/* Horizontal Form */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        {/* Month */}
        <div className="w-full">
          <label className="text-sm text-gray-600">Month</label>
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="border p-2 rounded w-full"
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>

        {/* Year */}
        <div className="w-full">
          <label className="text-sm text-gray-600">Year</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Target Date */}
        <div className="w-full">
          <label className="text-sm text-gray-600">Target Date</label>
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Import
        </button>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        open={openConfirm}
        title="Confirm Import"
        message="This will duplicate all entries from the selected month, adjust dates, and save new entries. Continue?"
        confirmText="Yes, Import"
        cancelText="Cancel"
        onConfirm={performImport}
        onCancel={() => setOpenConfirm(false)}
      />
    </div>
  );
}