import { API } from "../../../api";
import type { AccountType } from "../NetWorthTable/type";

export const loadAccountsFn = async (
  dispatch: any,
  setAccounts: (types: AccountType[]) => void
) => {
  const res = await API.getAccounts();
  dispatch(setAccounts(res.accountTypes));
};
