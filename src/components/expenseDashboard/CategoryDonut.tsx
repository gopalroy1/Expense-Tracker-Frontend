import DonutChart from "@/components/charts/donutCharts";
import { fmtCurrency } from "@/utils/fmtCurrency";
import { CATEGORY_COLORS, CATEGORY_LABELS, type CategoryStat } from "./types";

export function CategoryDonut({ categories }: { categories: CategoryStat[] }) {
  if (categories.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-center h-64">
        <p className="text-sm text-gray-400">No category data</p>
      </div>
    );
  }

  const totalSpent = categories.reduce((sum, c) => sum + (c.total ?? 0), 0);

  const chartData = categories.map((cat) => ({
    name: CATEGORY_LABELS[cat.name] ?? cat.name,
    sliceValue: cat.total ?? 0,
    actualValue: fmtCurrency(cat.total),
    color: CATEGORY_COLORS[cat.name] ?? "#6b7280",
  }));

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <p className="text-sm font-semibold text-gray-700 mb-1">Spending by Category</p>
      <DonutChart
        data={chartData}
        centralSum={totalSpent}
        onSliceClick={undefined}
      />
    </div>
  );
}
