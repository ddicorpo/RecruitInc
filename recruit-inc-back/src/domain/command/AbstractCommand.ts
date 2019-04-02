import { Logger } from '../../Logger';

export abstract class AbstractCommand {
  private logger: Logger;
  constructor() {
    this.logger = new Logger();
  }

  public logActionCompleted(methodName: string): void {
    this.logger.info({
      class: 'Base Command',
      method: methodName,
      action: 'Command Completed',
      params: {},
    });
  }

  public logActionFailure(
    methodName: string,
    errorName: string,
    errorDesc: string
  ): void {
    this.logger.error({
      class: 'Base Command',
      method: methodName,
      action: 'Command Fails reason: ' + errorName + ' desc: ' + errorDesc,
      params: {},
    });
  }
}
