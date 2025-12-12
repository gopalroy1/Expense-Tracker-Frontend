
import { useState } from "react";
import DonutChart from "../charts/donutCharts";
import { getCentralSum, getColor, prepareDonutData } from "../charts/utils";
import Modal from "../common/Modal";


export function prepareSubDonutData(entries: any, accountType: string) {
  const filtered = entries.filter((e: any) => e.accountType === accountType);

  const map: any = {};

  filtered.forEach((e: any) => {
    map[e.accountName] = (map[e.accountName] || 0) + e.balance;
  });

  return Object.entries(map).map(([name, value]: any) => {
    const isNegative = value < 0;
    return {
      name,
      sliceValue: Math.abs(value),
      actualValue: value,
      isNegative,
      color: getColor(name, isNegative),
    };
  });
}


export default function MonthlyDonutChart({ entries }: any) {
  const data = prepareDonutData(entries);
  const centralSum = getCentralSum(entries);

  const [open, setOpen] = useState(false);
  const [subData, setSubData] = useState([]);
  const [subSum, setSubSum] = useState(0);
  const [category, setCategory] = useState("");

  function onSliceClick(slice: any) {
    const type = slice.name;

    const filtered = prepareSubDonutData(entries, type);
    const sum = filtered.reduce((acc: any, s: any) => acc + s.actualValue, 0);

      setCategory(type);
      //@ts-ignore
    setSubData(filtered);
    setSubSum(sum);
    setOpen(true);
  }

  return (
    <>
      <DonutChart
        data={data}
        centralSum={centralSum}
        onSliceClick={onSliceClick}
      />

      <Modal open={open} onClose={setOpen} title={category}>
        <DonutChart data={subData} centralSum={subSum} />
      </Modal>
    </>
  );
}
