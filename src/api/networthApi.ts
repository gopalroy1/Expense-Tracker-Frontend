export interface NetworthRecord {
  id: number;
  category: string;
  name: string;
  balance: number;
  date: string;
  month: string;
}

const mockData: NetworthRecord[] = [
  { id: 1, category: "Bank", name: "SBI Account", balance: 55000, date: "2025-10-27", month: "October" },
  { id: 2, category: "Investment", name: "Groww Mutual Fund", balance: 125000, date: "2025-10-20", month: "October" },
  { id: 3, category: "Loan", name: "HDFC Credit Card", balance: -15000, date: "2025-10-18", month: "October" },
];

export const fetchNetworth = {
  getNetworth: (): Promise<NetworthRecord[]> =>
    new Promise((resolve) => {
      setTimeout(() => resolve(mockData), 700);
    }),

  addNetworth: (record: Omit<NetworthRecord, "id">): Promise<NetworthRecord> =>
    new Promise((resolve) => {
      setTimeout(() => {
        const newRecord = { ...record, id: Math.floor(Math.random() * 10000) };
        mockData.push(newRecord);
        resolve(newRecord);
      }, 500);
    }),
};
