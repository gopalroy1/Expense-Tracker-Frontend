import { SnapshotSection } from "./Snapshot";
import { NetWorthTrendSection } from "./trends/NetWorthTrendSection";

export const DashboardContainer = () => {
    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
            <SnapshotSection />
            <NetWorthTrendSection />
        </div>
    );
};