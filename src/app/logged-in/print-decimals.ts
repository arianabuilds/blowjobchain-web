/** Show up to 2 decimal places, but don't show trailing zeros in the decimal places */
export function printDecimals(number: number): string {
  return parseFloat(number.toFixed(4)).toString()
}
