import ReactECharts from "echarts-for-react";
import { ChartContainer } from "./chartContainer";

export default function DonutChart({ data, centralSum, onSliceClick }: any) {
  const total = data.reduce((acc: number, d: any) => acc + d.sliceValue, 0);

  const seriesData = data.map((item: any) => ({
    name: item.name,
    value: item.sliceValue,
    actualValue: item.actualValue,
    itemStyle: { color: item.color },
  }));

  const option = {
    tooltip: {
      trigger: "item",
      formatter: (p: any) => {
        const percent = ((p.value / total) * 100).toFixed(1);
        return `
          <strong>${p.name}</strong><br/>
          Value: ${p.data.actualValue}<br/>
          Share: ${percent}%
        `;
      },
    },

    legend: {
      show: true,
      bottom: 0,
      type: "scroll",
    },

   series: [
  {
    type: "pie",
    radius: ["50%", "70%"],
    avoidLabelOverlap: false,
    label: {
      show: true,
      position: "outside",
      formatter: (p:any) => {
        const percent = (p.value / total) * 100;
        return percent < 1 ? "" : `${p.name}\n${percent.toFixed(1)}%`;
      },
      fontSize: 12,
    },
    labelLine: {
      show: true,
      length: 18,
      length2: 12,
    },
    data: seriesData,
  }
],


    graphic: [
      {
        type: "text",
        left: "center",
        top: "center",
        style: {
          text: `₹ ${centralSum.toLocaleString("en-IN")}`,
          fontSize: 20,
          fontWeight: 600,
          fill: "#333",
          textAlign: "center",
        },
      },
    ],
  };

  function onEvents(params: any) {
    if (onSliceClick) onSliceClick(params.data);
  }

  return (
    <ChartContainer>
      <ReactECharts
        option={option}
        style={{ width: "100%", height: "100%" }}
        notMerge={true}
        lazyUpdate={true}
        onEvents={{ click: onEvents }}
      />
    </ChartContainer>
  );
}
