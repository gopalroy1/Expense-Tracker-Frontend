import axiosInstance from "./axios/axiosInstane";


export const API_URL = {
  SIGN_UP: `/api/auth/signup`,
  LOGIN: `/api/auth/login`,
  LOG_OUT: `/api/auth/logout`,
  IS_LOGGED_IN: `/api/auth/isloggedin`,
};

export const API = {
  // Auth
  signup: (data: any) => axiosInstance.post(API_URL.SIGN_UP, data),
  login: (data: any) => axiosInstance.post(API_URL.LOGIN, data,{withCredentials:true}),
  logout: () => axiosInstance.post(API_URL.LOG_OUT),
  isLoggedIn: () => axiosInstance.get(API_URL.IS_LOGGED_IN),

  // Accounts
  getAccounts: () =>
    axiosInstance.get("/api/account/getall").then((res) => res.data),

  addAccountType: (body: { type: string }) =>
    axiosInstance.post("/api/account/addaccount", body).then((res) => res.data),

  addAccountName: (body: { accountTypeId: string; name: string }) =>
    axiosInstance
      .post("/api/account/addaccountname", body)
      .then((res) => res.data),

  deleteAccountType: (id: string) =>
    axiosInstance.delete(`/api/account/type/${id}`).then((res) => res.data),

  deleteAccountName: (id: string) =>
    axiosInstance.delete(`/api/account/name/${id}`).then((res) => res.data),

  updateType: (id: string, data: { type: string }) =>
    axiosInstance.put(`/api/account/type/${id}`, data).then((res) => res.data),

  updateName: (id: string, data: { name: string }) =>
    axiosInstance.put(`/api/account/name/${id}`, data).then((res) => res.data),
  //
  getNetworthByMonth: (month: number, year: number) =>
    axiosInstance
      .get(`/api/networth/getmonth?month=${month}&year=${year}`)
      .then((res) => res.data),

  // 🟢 Add a new networth entry
  addNetworth: (body: {
    accountType: string;
    accountName: string;
    balance: number;
    snapshotDate: string; // or Date — backend will parse
  }) =>
    axiosInstance
      .post(`/api/networth/add`, body)
      .then((res) => res.data),
    // 🟡 Update a networth entry
  updateNetworth: (id: string, body: Partial<{
    accountType: string;
    accountName: string;
    balance: number | string;
    snapshotDate: string;
  }>) =>
    axiosInstance
      .put(`/api/networth/update/${id}`, body)
      .then((res) => res.data),

  // 🔴 Delete a networth entry
  deleteNetworth: (id: string) =>
    axiosInstance
      .delete(`/api/networth/delete/${id}`)
      .then((res) => res.data),
  importNetworth: (body: { month: number, year: number, targetDate: string }) =>
    axiosInstance
      .post(`/api/networth/import`, body)
      .then((res) => res.data),
};


