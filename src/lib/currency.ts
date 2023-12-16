export function formatCurrency(amount: number, options?: Intl.NumberFormatOptions): string {
  const formattedAmount = new Intl.NumberFormat(navigator.language ?? "en-US", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
    ...options,
  }).format(amount);

  return formattedAmount;
}
