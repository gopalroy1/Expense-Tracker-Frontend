
import axiosInstance from "@/api/axios/axiosInstane";
import React, { useEffect, useState } from "react";
import { SnapshotView } from "./SnapshotView";

 const SnapshotSection: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState<number | null>(null);
  const [month, setMonth] = useState<number | null>(null);
   const fetchMonthlySnapshot = async (year?: number, month?: number) => {
  const params: any = {};
  if (year && month) {
    params.year = year;
    params.month = month;
  }

  const res = await axiosInstance.get("/api/dashboard/snapshot", { params });
  return res.data;
};


  // Initial load
  useEffect(() => {
    fetchMonthlySnapshot()
      .then((res) => {
        setData(res);
        if (res?.snapshotMonth) {
          const [y, m] = res.snapshotMonth.split("-").map(Number);
          setYear(y);
          setMonth(m);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  // Refetch on change
  useEffect(() => {
    if (year && month) {
      setLoading(true);
      fetchMonthlySnapshot(year, month)
        .then(setData)
        .finally(() => setLoading(false));
    }
  }, [year, month]);

  if (loading) {
    return <div className="p-4 text-sm text-gray-500">Loading snapshot…</div>;
  }

  if (!data || !data.snapshotMonth) {
    return (
      <div className="p-4 bg-white rounded-2xl border">
        <p className="text-gray-500">No financial data yet</p>
        <p className="text-sm text-gray-400">
          Add accounts to see your snapshot
        </p>
      </div>
    );
  }

  return (
    <SnapshotView
      data={data}
      year={year!}
      month={month!}
      onMonthChange={setMonth}
      onYearChange={setYear}
    />
  );
};

export { SnapshotSection };
