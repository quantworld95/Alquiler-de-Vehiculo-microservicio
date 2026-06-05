import { BadRequestException } from '@nestjs/common';

export class BusinessRuleException extends BadRequestException {
  constructor(message: string, details?: Record<string, unknown>) {
    super({
      code: 'BUSINESS_RULE_VIOLATION',
      message,
      details,
    });
  }
}
