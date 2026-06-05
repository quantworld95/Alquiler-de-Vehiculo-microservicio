import { BusinessRuleException } from './business-rule.exception';

export class InvalidStateTransitionException extends BusinessRuleException {
  constructor(entity: string, currentState: string, targetState: string) {
    super(`Invalid ${entity} state transition`, {
      entity,
      currentState,
      targetState,
    });
  }
}
