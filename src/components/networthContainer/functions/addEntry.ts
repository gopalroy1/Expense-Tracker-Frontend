import { API } from "../../../api";
import type { NetworthEntry } from "../NetWorthTable/type";

export const addEntryFn = async (
  payload: Omit<NetworthEntry, "id">,
  toast: any,
  reload: Function
) => {
  try {
    await API.addNetworth(payload);
    toast.success("Entry added");
    reload();
  } catch {
    toast.error("Failed to add entry");
  }
};