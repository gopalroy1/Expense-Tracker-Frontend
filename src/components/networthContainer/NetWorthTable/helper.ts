/* Helpers */
export function getToday(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

export function normalizeDate(dateStr: string): string {
  if (!dateStr) return getToday();
  return dateStr.split("T")[0];
}

export function formatCurrency(num: number): string {
  if (num < 0) return `-₹${Math.abs(num)}`;
  return `₹${num}`;
}
