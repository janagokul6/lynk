export function formatInr(value: string | number | null | undefined): string {
  if (value == null || value === "") return "—";
  const amount = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(amount)) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount);
}

export function formatInrBand(min: string | number, max: string | number): string {
  return `${formatInr(min)} – ${formatInr(max)}`;
}
