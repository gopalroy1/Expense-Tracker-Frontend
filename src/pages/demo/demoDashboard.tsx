import React from "react";
import { DemoCategoryTrendSection } from "./DemoCategoryTrendSection";
import DemoLayout from "./demoLayout";
import DemoNetworthContainer from "./DemoNetworthContainer";
import { DemoNetWorthTrendSection } from "./demoNetworthTrendSection";
import { DemoSnapshotSection } from "./DemoSnapshotSection";

/* ---------------- Fake Demo Data ---------------- */


/* ---------------- Chart Options ---------------- */


/* ---------------- Component ---------------- */

export const DemoDashboard: React.FC = () => {
  return (
    <DemoLayout>
      <div className="space-y-8">
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800">
          This is a demo dashboard using sample data.
          Create an account to track your real finances.
        </div>

        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <DemoNetworthContainer />
        </div>
        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <DemoSnapshotSection />
        </div>
        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <DemoNetWorthTrendSection />
        </div>
        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <DemoCategoryTrendSection />
        </div>
      </div>
    </DemoLayout>
  );
};
