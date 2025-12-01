export function positiveModulo(dividend: number, divisor: number) {
  return ((dividend % divisor) + divisor) % divisor;
}
