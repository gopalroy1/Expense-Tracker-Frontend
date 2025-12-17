type StatCardProps = {
title: string;
value: number;
percentageChange?: number;
isPositiveTrend?: boolean;
};

export const StatCard: React.FC<StatCardProps> = ({
title,
value,
percentageChange,
isPositiveTrend = true,
}) => {
const showTrend = percentageChange !== undefined;


return (
<div className="rounded-2xl shadow p-4 bg-white">
<p className="text-sm text-gray-500">{title}</p>
<p className="text-2xl font-semibold">₹ {value.toLocaleString()}</p>


{showTrend && (
<p
className={`text-sm mt-1 ${
isPositiveTrend ? "text-green-600" : "text-red-600"
}`}
>
{isPositiveTrend ? "▲" : "▼"} {Math.abs(percentageChange!).toFixed(2)}%
</p>
)}
</div>
);
};