export function formatCurrency(amount: number, currencyUnit = "INR"): string {
  const formattedAmount = new Intl.NumberFormat(navigator.language ?? "en-US", {
    style: "currency",
    currency: currencyUnit,
  }).format(amount);

  return formattedAmount;
}
