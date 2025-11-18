import { API } from "../../../api";
import type { NetworthEntry } from "../NetWorthTable/type";

export const loadEntriesFn = async (
  month: number,
  year: number,
  setEntries: (e: NetworthEntry[]) => void,
  toast: any
) => {
  try {
    const res = await API.getNetworthByMonth(month, year);
    setEntries(res.entries || []);
  } catch {
    toast.error("Failed to load entries");
  }
};
