import CategoryTrendExplorer from "./categoryTrend";
import { SnapshotSection } from "./Snapshot";
import { NetWorthTrendSection } from "./trends/NetWorthTrendSection";

export const DashboardContainer = () => {
  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          Overview of your financial health
        </p>
      </div>

      {/* Snapshot – MOST IMPORTANT */}
      <section className="bg-white rounded-2xl border shadow-sm p-6">
        <SnapshotSection />
      </section>

      {/* Net Worth Trend */}
      <section>
        <div className="mb-3">
          <h2 className="text-lg font-medium text-gray-800">
            Net Worth Trend
          </h2>
          <p className="text-sm text-gray-500">
            How your net worth has changed over time
          </p>
        </div>

        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <NetWorthTrendSection />
        </div>
      </section>

      {/* Category Trends */}
      <section>
        <div className="mb-3">
          <h2 className="text-lg font-medium text-gray-800">
            Category Insights
          </h2>
          <p className="text-sm text-gray-500">
            Understand where your money is going
          </p>
        </div>

        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <CategoryTrendExplorer />
        </div>
      </section>
    </div>
  );
};
