export const isValidDateRange = (startDate: Date, endDate: Date): boolean =>
  startDate.getTime() < endDate.getTime();

export const rangesOverlap = (
  firstStart: Date,
  firstEnd: Date,
  secondStart: Date,
  secondEnd: Date,
): boolean => firstStart < secondEnd && secondStart < firstEnd;
