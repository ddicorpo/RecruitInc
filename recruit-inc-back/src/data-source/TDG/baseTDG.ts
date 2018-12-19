import { Logger } from '../../Logger';
/**
 * Inspired by: https://github.com/gsi-manuel/ts-nodejs-express-webpack/blob/master/src/repositories/base/base-repository.ts\
 * This is a base TDG, to handle generic action, our TDG will use it to complete action
 * It will reduce size of our TDGs
 */
export class BaseTDG {
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

  public create(item: any, attrValidate: any): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
      //Prevents Duplicate, override if you want to allow duplicate
      this.schema.findOne(attrValidate, (err: any, obj: any) => {
        if (err) reject(err.name + ': ' + err.message);
        if (obj) {
          // obj already exists
          reject(
            'Object with "' +
              JSON.stringify(attrValidate) +
              '" is already exists'
          );
        } else {
          item.save((error: any, new_obj: any) => {
            if (error) reject(error.name + ': ' + error.message);
            resolve();
          });
        }
      });
    });
  }

  /**
   * Will create your object with duplicate
   * @param item
   * @param attrValidate
   */
  public createDuplicate(item: any, attrValidate: any): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
      item.save((error: any, newObj: any) => {
        if (error) {
          reject(error.name + ' : ' + error.message);
          this.logActionFailure('createDuplicate', error.name, error.message);
        } else {
          this.logActionCompleted('createDuplicate');
        }
        resolve();
      });
    });
  }

  public update(_id: string, item: any): Promise<boolean> {
    return new Promise((resolve: any, reject: any) => {
      this.schema.findByIdAndUpdate(_id, item, (err: any, obj: any) => {
        if (err) reject(err.name + ': ' + err.message);
        resolve();
      });
    });
  }

  public delete(_id: string): Promise<boolean> {
    return new Promise((resolve: any, reject: any) => {
      this.schema.findById(_id, (err: any, obj: any) => {
        if (err) reject(err.name + ': ' + err.message);
        obj.remove((err: any) => {
          if (err) reject(err.name + ': ' + err.message);
          resolve();
        });
      });
    });
  }

  private logActionCompleted(methodName: string): void {
    this.logger.info({
      class: this.schema.name + ' Model',
      method: methodName,
      action: 'Transaction Completed',
      params: {},
    });
  }

  private logActionFailure(
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
