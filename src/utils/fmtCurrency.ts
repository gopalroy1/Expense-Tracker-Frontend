export function fmtCurrency(amount: number | string | null | undefined, currency = "INR"): string {
  const n = amount == null ? 0 : typeof amount === "string" ? parseFloat(amount) || 0 : amount;
  const opts: Intl.NumberFormatOptions = { minimumFractionDigits: 2, maximumFractionDigits: 2 };
  if (currency === "USD") return `$${n.toLocaleString("en-US", opts)}`;
  return `₹${n.toLocaleString("en-IN", opts)}`;
}
