const MS_PER_DAY = 1000 * 60 * 60 * 24;

export function calcTotalPrice(
  startDate: Date,
  endDate: Date,
  dailyRate: number,
) {
  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / MS_PER_DAY);
  return days * dailyRate;
}
