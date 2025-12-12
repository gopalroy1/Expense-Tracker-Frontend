import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

// import AddEntryForm from "./AddEntryForm";
import MonthSelector from "./MonthSelector";

import { API } from "../../api";
import { setAccounts } from "../../store/accountSlice";
import { addEntryFn } from "./functions/addEntry";
import { loadAccountsFn } from "./functions/getAllData";
import { loadEntriesFn } from "./functions/loadEntries";
import MonthlyBarChart from "./MonthlyBarChart";
import MonthlyDonutChart from "./monthlyDonutChart";
import NetworthTable from "./NetWorthTable";

export default function NetworthContainer() {
  const dispatch = useDispatch();
  const { accountTypes } = useSelector((s: any) => s.account);

  const [month, setMonth] = useState(String(new Date().getMonth() + 1).padStart(2, "0"));
  const [year, setYear] = useState(String(new Date().getFullYear()));

  const [entries, setEntries] = useState([]);

  //@ts-ignore
  const reload = () => loadEntriesFn(Number(month), Number(year), setEntries, toast);

  useEffect(() => {
    //@ts-ignore
    loadAccountsFn(dispatch, setAccounts);
  }, []);

  useEffect(() => {
    reload();
  }, [month, year]);

  const handleUpdate = async (id: string, fields: any) => {
    try {
      // convert balance safely
      const payload = {
        ...fields,
        balance:
          fields.balance !== undefined && fields.balance !== null
            ? Number(fields.balance)
            : undefined,
      };

      await API.updateNetworth(id, payload);
      reload();
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Failed to update entry");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await API.deleteNetworth(id);
      reload();
    } catch (err) {

      console.error("Delete failed:", err);
      toast.error("Failed to delete entry");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Networth Tracker</h1>

      <MonthSelector month={month} year={year} setMonth={setMonth} setYear={setYear} />

      <NetworthTable
        entries={entries}
        accountTypes={accountTypes}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        onAdd={(row: any) => {
          const isSameMonth = new Date(row.snapshotDate).getMonth() + 1 === Number(month);
          const isSameYear = new Date(row.snapshotDate).getFullYear() === Number(year);
          console.log("isSameMonth", { isSameMonth }, { isSameYear });
          console.log(row?.snapshotDate)
          addEntryFn(
            {
              accountType: row.accountType,
              accountName: row.accountName,
              balance: Number(row.balance),
              snapshotDate: (isSameMonth && isSameYear) ? row?.snapshotDate : `${year}-${month}-01`,
            },
            toast,
            reload
          )
        }
        }
      />
      {entries && entries.length > 0 && <MonthlyDonutChart entries={entries} />}
      {entries && entries.length > 0 && <MonthlyBarChart entries={entries} />}
    </div>
  );
}
