export interface AccountName {
  id: string;
  name: string;
}

export interface AccountType {
  id: string;
  type: string;
  accountNames: AccountName[];
}

export interface NetworthEntry {
  id: string;
  accountType: string;
  accountName: string;
  balance: number;
  snapshotDate: string; // YYYY-MM-DD or ISO
}

export interface PropsNetworthTable {
  entries: NetworthEntry[];
  accountTypes: AccountType[];
  onUpdate: (id: string, fields: Partial<NetworthEntry>) => Promise<void> | void;
  onDelete: (id: string) => Promise<void> | void;
  onAdd: (row: Omit<NetworthEntry, "id">) => Promise<void> | void;
}
