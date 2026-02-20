export function formatPrice(value: number | null): string {
  if (value === null) return "";

  return new Intl.NumberFormat('pt-BR', {
    style: "currency",
    currency: "BRL"
  }).format(value);
}