import { BusinessRuleException } from '../common/errors';
import { isValidDateRange } from '../common/utils';

export const validateDateRange = (startDate: Date, endDate: Date): void => {
  if (!isValidDateRange(startDate, endDate)) {
    throw new BusinessRuleException('The start date must be earlier than the end date', {
      startDate,
      endDate,
    });
  }
};
