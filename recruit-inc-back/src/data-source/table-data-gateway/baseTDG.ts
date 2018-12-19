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
  /**
   * Prevents Duplicate, override if you want to allow duplicate use createDuplicate
   * @param item
   * @param attrValidate
   */
  public create(item: any, attrValidate: any): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
      this.schema.findOne(attrValidate, (error: any, obj: any) => {
        if (error) {
          // Can't execute the query
          this.logActionFailure(this.create.name, error.name, error.message);
          reject(error.name + ': ' + error.message);
        }
        if (obj) {
          // obj already exists
          reject(
            'Object with "' +
              JSON.stringify(attrValidate) +
              '" is already exists'
          );
          this.logActionFailure(this.create.name, error.name, error.message);
        } else {
          item.save((error: any, new_obj: any) => {
            if (error) {
              this.logActionFailure(
                this.create.name,
                error.name,
                error.message
              );
              reject(error.name + ': ' + error.message);
            } else {
              this.logActionCompleted(this.create.name);
            }
            resolve();
          });
        }
      });
    });
  }

  /**
   * Will create your object with duplicate, use carefully
   * @param item
   * @param attrValidate
   */
  public createDuplicate(item: any, attrValidate: any): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
      item.save((error: any, newObj: any) => {
        if (error) {
          this.logActionFailure(
            this.createDuplicate.name,
            error.name,
            error.message
          );
          reject(error.name + ': ' + error.message);
        } else {
          this.logActionCompleted(this.createDuplicate.name);
        }
        resolve();
      });
    });
  }

  /**
   * Id is the id of the object you want to update in Mongo it's always _id
   * which is a random string e.g. 4A34jD393jse
   * @param _id
   * @param item
   */
  public update(_id: string, item: any): Promise<boolean> {
    return new Promise((resolve: any, reject: any) => {
      this.schema.findByIdAndUpdate(_id, item, (error: any, obj: any) => {
        if (error) {
          this.logActionFailure(this.update.name, error.name, error.message);
          reject(error.name + ': ' + error.message);
        } else {
          this.logActionCompleted(this.update.name);
        }
        resolve();
      });
    });
  }

  /**
   * The id of the object you want to delete
   * @param _id
   */
  public delete(_id: string): Promise<boolean> {
    return new Promise((resolve: any, reject: any) => {
      this.schema.findById(_id, (error: any, obj: any) => {
        if (error) {
          this.logActionFailure(this.delete.name, error.name, error.message);
          reject(error.name + ': ' + error.message);
        }
        obj.remove((error: any) => {
          if (error) {
            this.logActionFailure(this.delete.name, error.name, error.message);
            reject(error.name + ': ' + error.message);
          }
          this.logActionCompleted(this.delete.name);
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
