import { SnapshotView } from "@/components/dashboardContainer/Snapshot/SnapshotView";
import React, { useState } from "react";

/* ---------------- Dummy Demo Data ---------------- */

const DEMO_DATA = {
  snapshotMonth: "2025-11",
  current: {
    netWorth: 1240000,
    totalPositive: 1420000,
    totalNegative: 180000,
  },
  previous: {
    netWorth: 1100000,
    totalPositive: 1300000,
    totalNegative: 200000,
  },
};

export const DemoSnapshotSection: React.FC = () => {
  const [year, setYear] = useState(2025);
  const [month, setMonth] = useState(11);

  return (
    <SnapshotView
      data={DEMO_DATA}
      year={year}
      month={month}
      onYearChange={setYear}
      onMonthChange={setMonth}
    />
  );
};
