export function calculatePercentageChange(current: number, previous: number) {
if (previous === 0) return 0;
return ((current - previous) / previous) * 100;
}