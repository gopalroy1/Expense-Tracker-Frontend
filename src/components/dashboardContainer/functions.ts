export function calculatePercentageChange(current: number, previous: number|undefined) {
if (!previous || previous === 0) return null;
return ((current - previous) / previous) * 100;
}