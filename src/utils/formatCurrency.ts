const jpyCurrencyFormatter = new Intl.NumberFormat('ja-JP', {
  style: 'currency',
  currency: 'JPY',
  maximumFractionDigits: 0,
})

export function formatCurrency(value: number): string {
  return jpyCurrencyFormatter.format(value)
}
