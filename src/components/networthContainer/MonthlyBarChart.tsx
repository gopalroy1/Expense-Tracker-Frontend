import BarChart from "../charts/BarChart";
import { getColor } from "../charts/utils";

export function prepareBarChartData(entries: any) {
  return entries
    .map((e: any) => {
      const isNegative = e.balance < 0;

      return {
        name: e.accountName,
        value: e.balance,
        isNegative,
        color: getColor(e.accountName, isNegative),
      };
    })
    .sort((a:any, b:any) => b.value - a.value); // highest on top
}

export default function MonthlyBarChart({ entries }: any) {
    const barData = prepareBarChartData(entries);


  return <BarChart data={barData} />;
}