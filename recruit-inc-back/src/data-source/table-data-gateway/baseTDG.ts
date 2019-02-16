import { Logger } from '../../Logger';
import { Types } from 'mongoose';
/**
 * Inspired by: https://github.com/gsi-manuel/ts-nodejs-express-webpack/blob/master/src/repositories/base/base-repository.ts\
 * This is a base TDG, to handle generic action, our TDG will use it to complete action
 * It will reduce size of our TDGs
 *  *************************************************************
 * NOTE: This class doesn't include logic it's only transaction
 * *************************************************************
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
   * Create a user
   * @param item
   * @param attrValidate
   */
  public create(item: any, attrValidate: any): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
      item.save((err: any, new_obj: any) => {
        if (err) {
          this.logActionFailure(this.create.name, err.name, err.message);
          reject(err.name + ': ' + err.message);
          throw new Error("Can't save");
        }
        this.logActionCompleted(this.create.name);
        resolve(attrValidate);
      });
    });
  }
  /**
   * Id is the id of the object you want to update in Mongo it's always _id
   * which is a random string e.g. 4A34jD393jse
   * @param id
   * @param item
   */
  public update(id: Types.ObjectId, item: any): Promise<boolean> {
    return new Promise((resolve: any, reject: any) => {
      item.isNew = false;
      item.save((err: any, new_obj: any) => {
        if (err) {
          this.logActionFailure(this.update.name, err.name, err.message);
          resolve(false);
        } else {
          this.logActionCompleted(this.update.name);
          resolve(true);
        }
      });
    });
  }

  /**
   * The id of the object you want to delete
   * @param _id
   */
  public delete(id: Types.ObjectId): Promise<boolean> {
    return new Promise((resolve: any, reject: any) => {
      this.schema.findByIdAndRemove(id, (error, doc) => {
        if (error) {
          this.logActionFailure(this.delete.name, error.name, error.message);
          resolve(false);
        } else {
          this.logActionCompleted(this.delete.name);
          resolve(true);
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
