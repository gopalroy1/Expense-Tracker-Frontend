import { Cell, Legend, Pie, PieChart, Tooltip } from "recharts";


export default function DonutChart({ data, centralSum, onSliceClick }: any) {
  return (
    <PieChart width={'100%'} height={380}>
      
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        style={{ fontSize: "20px", fontWeight: "600" }}
      >
        ₹ {centralSum.toLocaleString("en-IN")}
      </text>

      <Pie
        data={data}
        dataKey="sliceValue"
        nameKey="name"
        cx="50%"
        cy="50%"
        innerRadius={90}
        outerRadius={130}
        paddingAngle={2}
        label={({ index }) => {
          const item = data[index];
          return `${item.name}: ${item.actualValue}`;
        }}
        labelLine={false}
      >
        {data.map((slice: any, i: any) => (
          <Cell
            key={i}
            fill={slice.color}
            style={{ cursor: onSliceClick ? "pointer" : "default" }}
            onClick={() => onSliceClick?.(slice)}
          />
        ))}
      </Pie>

      <Tooltip
        formatter={(_value, _name, props) => {
          const item = props.payload;
          return [`${item.actualValue}`, `${item.name}`];
        }}
      />

      <Legend />
    </PieChart>
  );
}
