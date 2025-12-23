import MonthlyBarChart from "@/components/networthContainer/MonthlyBarChart";
import MonthlyDonutChart from "@/components/networthContainer/monthlyDonutChart";
import MonthSelector from "@/components/networthContainer/MonthSelector";
import NetworthTable from "@/components/networthContainer/NetWorthTable";
import { useState } from "react";


// demoEntries.ts
export const DEMO_ENTRIES = [
  {
    id: "1",
    accountType: "Bank Accounts",
    accountName: "HDFC Bank",
    balance: 54000,
    snapshotDate: "2025-11-01",
  },
  {
    id: "2",
    accountType: "Bank Accounts",
    accountName: "ICICI Bank",
    balance: 27700,
    snapshotDate: "2025-11-01",
  },
  {
    id: "3",
    accountType: "Credit Cards",
    accountName: "ICICI Amazon",
    balance: -10824,
    snapshotDate: "2025-11-01",
  },
  {
    id: "4",
    accountType: "Investment",
    accountName: "Mutual Funds",
    balance: 211040,
    snapshotDate: "2025-11-01",
  },
];
// demoAccountTypes.ts
export const DEMO_ACCOUNT_TYPES = [
  {
    id: "bank",
    type: "Bank Accounts",
    accountNames: [
      { id: "hdfc", name: "HDFC Bank" },
      { id: "icici", name: "ICICI Bank" },
    ],
  },
  {
    id: "cc",
    type: "Credit Cards",
    accountNames: [
      { id: "amazon", name: "ICICI Amazon" },
      { id: "swiggy", name: "HDFC Swiggy" },
    ],
  },
  {
    id: "inv",
    type: "Investment",
    accountNames: [
      { id: "mf", name: "Mutual Funds" },
      { id: "liq", name: "Liquid Fund" },
    ],
  },
];

export default function DemoNetworthContainer() {
  const [month, setMonth] = useState("11");
  const [year, setYear] = useState("2025");

  const [entries ] = useState(DEMO_ENTRIES);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">
        Net Worth Tracker <span className="text-sm text-gray-400">(Demo)</span>
      </h1>

      <p className="text-sm text-gray-500">
        This is a demo view using sample data. Changes are not saved.
      </p>

      <MonthSelector
        month={month}
        year={year}
        setMonth={setMonth}
        setYear={setYear}
      />

      <NetworthTable
        entries={entries}
        accountTypes={DEMO_ACCOUNT_TYPES}
        onUpdate={() => {}}
        onDelete={() => {}}
        onAdd={() => {}}
      />

      {entries.length > 0 && <MonthlyDonutChart entries={entries} />}
      {entries.length > 0 && <MonthlyBarChart entries={entries} />}
    </div>
  );
}
