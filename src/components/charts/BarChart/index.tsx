import ReactECharts from "echarts-for-react";
import { ChartContainer } from "../chartContainer";

export default function BarChart({ data }: any) {
  const names = data.map((d: any) => d.name);
  const values = data.map((d: any) => d.value);
  const colors = data.map((d: any) => d.color);

  const option = {
    tooltip: {
      trigger: "axis",
      formatter: (params: any) => {
        const p = params[0]; // single series
        return `
          <strong>${p.name}</strong><br/>
          Balance: ${p.value}
        `;
      },
    },

    grid: {
      left: "20%",
      right: "10%",
      top: "5%",
      bottom: "5%",
    },

    xAxis: {
      type: "value",
      axisLabel: { formatter: (v: number) => v },
    },

    yAxis: {
      type: "category",
      data: names,
      axisLabel: {
        fontSize: 12,
        overflow: "truncate",
      },
    },

    series: [
      {
        name: "Balance",
        type: "bar",
        data: values,
        itemStyle: {
          color: (params: any) => colors[params.dataIndex],
          borderRadius: 6,
        },
        label: {
          show: true,
          position: "right",
          formatter: ({ value }: any) => value,
        },
        barWidth: 20,
      },
    ],
  };

  return (
    <ChartContainer>
      <ReactECharts option={option} style={{ width: "100%", height: "100%" }} />
    </ChartContainer>
  );
}
