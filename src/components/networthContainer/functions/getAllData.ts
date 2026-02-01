import { API } from "@/api";
import { setAccounts } from "@/store/accountSlice";

export const loadAccountsFn = async (dispatch: any) => {
  const res = await API.getAccounts();
  dispatch(setAccounts(res.accountTypes));
};
