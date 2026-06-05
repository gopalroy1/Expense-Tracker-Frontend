import axiosInstance from "./axios/axiosInstane";

export const API_URL = {
  // Auth
  SIGN_UP: `/api/auth/signup`,
  LOGIN: `/api/auth/login`,
  LOG_OUT: `/api/auth/logout`,
  IS_LOGGED_IN: `/api/auth/isloggedin`,
  GOOGLE_AUTH: `/api/auth/google`,

  // Accounts
  GET_ACCOUNTS: `/api/account/getall`,
  ADD_ACCOUNT_TYPE: `/api/account/addaccount`,
  ADD_ACCOUNT_NAME: `/api/account/addaccountname`,

  // Net Worth
  GET_NETWORTH_BY_MONTH: (month: number, year: number) =>
    `/api/networth/getmonth?month=${month}&year=${year}`,
  ADD_NETWORTH: `/api/networth/add`,
  UPDATE_NETWORTH: (id: string) => `/api/networth/update/${id}`,
  DELETE_NETWORTH: (id: string) => `/api/networth/delete/${id}`,
  IMPORT_NETWORTH: `/api/networth/import`,

  // Admin
  ADMIN_USERS: `/api/admin/users`,
  ADMIN_EMAILS: (userId: string) => `/api/admin/emails/${userId}`,
  ADMIN_TRANSACTIONS: (userId: string) => `/api/admin/transactions/${userId}`,

  // Expenses
  MONTHLY_SUMMARY: `/api/expenses/monthly-summary`,
  EXPENSE_TRANSACTIONS: `/api/expenses/transactions`,
  DAY_DETAIL: `/api/expenses/day`,
};

function buildQuery(params: Record<string, string | undefined>) {
  const q = new URLSearchParams();
  for (const [key, val] of Object.entries(params)) {
    if (val) q.set(key, val);
  }
  const str = q.toString();
  return str ? `?${str}` : "";
}

export const API = {
  // ── Auth ──────────────────────────────────────────────────────────────────
  signup: (data: unknown) =>
    axiosInstance.post(API_URL.SIGN_UP, data),

  login: (data: unknown) =>
    axiosInstance.post(API_URL.LOGIN, data, { withCredentials: true }),

  logout: () =>
    axiosInstance.post(API_URL.LOG_OUT),

  isLoggedIn: () =>
    axiosInstance.get(API_URL.IS_LOGGED_IN),

  // ── Accounts ──────────────────────────────────────────────────────────────
  getAccounts: () =>
    axiosInstance.get(API_URL.GET_ACCOUNTS).then((res) => res.data),

  addAccountType: (body: { type: string }) =>
    axiosInstance.post(API_URL.ADD_ACCOUNT_TYPE, body).then((res) => res.data),

  addAccountName: (body: { accountTypeId: string; name: string }) =>
    axiosInstance.post(API_URL.ADD_ACCOUNT_NAME, body).then((res) => res.data),

  deleteAccountType: (id: string) =>
    axiosInstance.delete(`/api/account/type/${id}`).then((res) => res.data),

  deleteAccountName: (id: string) =>
    axiosInstance.delete(`/api/account/name/${id}`).then((res) => res.data),

  updateType: (id: string, data: { type: string }) =>
    axiosInstance.put(`/api/account/type/${id}`, data).then((res) => res.data),

  updateName: (id: string, data: { name: string }) =>
    axiosInstance.put(`/api/account/name/${id}`, data).then((res) => res.data),

  // ── Net Worth ─────────────────────────────────────────────────────────────
  getNetworthByMonth: (month: number, year: number) =>
    axiosInstance.get(API_URL.GET_NETWORTH_BY_MONTH(month, year)).then((res) => res.data),

  addNetworth: (body: {
    accountType: string;
    accountName: string;
    balance: number;
    snapshotDate: string;
  }) =>
    axiosInstance.post(API_URL.ADD_NETWORTH, body).then((res) => res.data),

  updateNetworth: (id: string, body: Partial<{
    accountType: string;
    accountName: string;
    balance: number | string;
    snapshotDate: string;
  }>) =>
    axiosInstance.put(API_URL.UPDATE_NETWORTH(id), body).then((res) => res.data),

  deleteNetworth: (id: string) =>
    axiosInstance.delete(API_URL.DELETE_NETWORTH(id)).then((res) => res.data),

  importNetworth: (body: { month: number; year: number; targetDate: string }) =>
    axiosInstance.post(API_URL.IMPORT_NETWORTH, body).then((res) => res.data),

  // ── Admin ─────────────────────────────────────────────────────────────────
  getAdminUsers: () =>
    axiosInstance.get(API_URL.ADMIN_USERS),

  getAdminUserEmails: (userId: string, from?: string, to?: string) =>
    axiosInstance.get(API_URL.ADMIN_EMAILS(userId) + buildQuery({ from, to })),

  getAdminUserTransactions: (userId: string, from?: string, to?: string) =>
    axiosInstance.get(API_URL.ADMIN_TRANSACTIONS(userId) + buildQuery({ from, to })),

  // ── Expenses ──────────────────────────────────────────────────────────────
  getMonthlySummary: (month: string, accountId?: string) =>
    axiosInstance.get(API_URL.MONTHLY_SUMMARY + buildQuery({ month, account_id: accountId })),

  getExpenseTransactions: (params: {
    month: string;
    page?: number;
    limit?: number;
    category?: string;
    type?: string;
    search?: string;
    account_id?: string;
  }) =>
    axiosInstance.get(
      API_URL.EXPENSE_TRANSACTIONS +
        buildQuery({
          month: params.month,
          page: params.page?.toString(),
          limit: params.limit?.toString(),
          category: params.category,
          type: params.type,
          search: params.search,
          account_id: params.account_id,
        })
    ),

  getDayDetail: (date: string, accountId?: string) =>
    axiosInstance.get(API_URL.DAY_DETAIL + buildQuery({ date, account_id: accountId })),
};
