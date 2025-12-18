import { NetWorthTrendView } from "@/components/dashboardContainer/trends/NetworthView";
import React, { useState } from "react";

const DEMO_DATA = [
  { month: 6, netWorth: 820000 },
  { month: 7, netWorth: 860000 },
  { month: 8, netWorth: 910000 },
  { month: 9, netWorth: 980000 },
  { month: 10, netWorth: 1100000 },
  { month: 11, netWorth: 1240000 },
];

export const DemoNetWorthTrendSection: React.FC = () => {
  const [year, setYear] = useState(2025);

  return (
    <NetWorthTrendView
      year={year}
      data={DEMO_DATA}
      onYearChange={setYear}
    />
  );
};
