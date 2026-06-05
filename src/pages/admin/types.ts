export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  isAdmin: boolean;
  createdAt: string;
}

export interface Email {
  id: string;
  gmailMessageId: string;
  sender: string | null;
  subject: string | null;
  snippet: string | null;
  body: string | null;
  receivedAt: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  emailId: string;
  userId: string;
  amount: string | null;
  type: "debit" | "credit" | null;
  platform: string | null;
  merchant: string | null;
  currency: string;
  category: string | null;
  accountType: string | null;
  accountNumber: string | null;
  accountName: string | null;
  transactionDate: string | null;
  transactionTime: string | null;
  description: string | null;
  rawSubject: string | null;
  isTransactionEmail: boolean;
  confidence: string;
  createdAt: string;
}
