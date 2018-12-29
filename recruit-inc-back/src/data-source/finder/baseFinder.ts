import { Logger } from '../../Logger';
/**
 * Inspired by: https://github.com/gsi-manuel/ts-nodejs-express-webpack/blob/master/src/repositories/base/base-repository.ts\
 * This is a base Finder, to handle generic action
 * It will reduce size of our Finders
 */
export class BaseFinder {
  private schema: any;
  private logger: Logger;

  constructor(schemaName: any, logger?: Logger) {
    this.schema = schemaName;
    if (logger) {
      this.logger = logger;
    } else {
      this.logger = new Logger();
    }
  }

  public findById(_id: string): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
      this.schema.findById(_id, (error: any, obj: any) => {
        if (error) {
          this.logActionFailure(this.findById.name, error.name, error.message);
          reject(error.name + ' :' + error.message);
        } else {
          this.logActionCompleted(this.findById.name);
          obj ? resolve(obj) : resolve();
        }
      });
    });
  }

  public logActionCompleted(methodName: string): void {
    this.logger.info({
      class: this.schema.name + ' Model',
      method: methodName,
      action: 'Transaction Completed',
      params: {},
    });
  }

  public logActionFailure(
    methodName: string,
    errorName: string,
    errorDesc: string
  ): void {
    this.logger.info({
      class: this.schema.name + ' Model',
      method: methodName,
      action: 'Transaction Fails reason: ' + errorName + ' desc: ' + errorDesc,
      params: {},
    });
  }
}
