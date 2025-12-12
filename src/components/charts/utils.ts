import { NEGATIVE_COLORS_CHART, POSITIVE_COLORS_CHART } from "./constant";

export function hashStringToNumber(str:string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}
export function getColor(name: string, isNegative: boolean) {
  const palette = isNegative ? NEGATIVE_COLORS_CHART : POSITIVE_COLORS_CHART;
  const hash = hashStringToNumber(name);
  return palette[hash % palette.length];
}
export function getCentralSum(entries:any) {
  return entries.reduce((acc:any, e:any) => acc + e.balance, 0);
}
//Prepare data for donut chart
function groupByAccountType(entries:any) {
    const map: any = {};
    console.log("The entries for donut chart is :", entries);
  entries.forEach((e:any) => {
    if (!map[e.accountType]) {
    map[e.accountType] = e.balance;
} else {
    map[e.accountType] += e.balance;
}
  });
    console.log("The grouped data for donut chart is :", map);
  return map;
}

export function prepareDonutData(entries:any) {
  const grouped = groupByAccountType(entries) as any;// Group data by account type

  return Object.entries(grouped).map(([type, value]:any) => {
    const isNegative = value < 0;
    return {
      name: type,
      sliceValue: Math.abs(value),
      actualValue: value,
      isNegative,
      color: getColor(type, isNegative),
    };
  });
}