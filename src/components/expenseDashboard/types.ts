export interface DailyStat {
  date: string; // ISO timestamp from backend (UTC midnight-IST)
  total: number | null;
  tx_count: number;
}

export interface CategoryStat {
  name: string;
  total: number | null;
  pct: number | null;
  tx_count: number;
}

export interface MerchantStat {
  merchant: string;
  total: number | null;
  tx_count: number;
  is_recurring: boolean;
}

export interface MonthlySummaryData {
  period: string;
  summary: {
    total_spent: number;
    total_credited: number;
    net_flow: number;
    tx_count: number;
    avg_daily_spend: number;
  };
  daily: DailyStat[];
  categories: CategoryStat[];
  top_merchants: MerchantStat[];
}

export interface ExpenseTransaction {
  id: string;
  merchant: string | null;
  platform: string | null;
  amount: number;
  currency: string;
  type: "debit" | "credit";
  category: string | null;
  account_name: string | null;
  transaction_date: string;
  transaction_time: string | null;
  description: string | null;
}

export interface DayDetailData {
  date: string;
  total_spent: number;
  avg_daily_spend: number;
  transactions: Omit<ExpenseTransaction, "transaction_date">[];
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export const CATEGORY_LABELS: Record<string, string> = {
  food_dining: "Food & Dining",
  shopping: "Shopping",
  groceries: "Groceries",
  transport: "Transport",
  bills_utilities: "Bills & Utilities",
  entertainment: "Entertainment",
  travel: "Travel",
  health: "Health",
  education: "Education",
  transfer: "Transfer",
  refund: "Refund",
  investment: "Investment",
  subscription: "Subscription",
  other: "Other",
};

export const CATEGORY_COLORS: Record<string, string> = {
  food_dining: "#f97316",
  shopping: "#ec4899",
  groceries: "#22c55e",
  transport: "#3b82f6",
  bills_utilities: "#eab308",
  entertainment: "#a855f7",
  travel: "#14b8a6",
  health: "#ef4444",
  education: "#6366f1",
  transfer: "#6b7280",
  refund: "#84cc16",
  investment: "#10b981",
  subscription: "#8b5cf6",
  other: "#78716c",
};

export const CATEGORY_ENUM = [
  "food_dining", "shopping", "groceries", "transport", "bills_utilities",
  "entertainment", "travel", "health", "education", "transfer",
  "refund", "investment", "subscription", "other",
];
