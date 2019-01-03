import { Logger } from '../../Logger';
import { Types } from 'mongoose';

export class BaseFinder {
  private model: any;
  private logger: Logger;
  constructor(model: any) {
    this.model = model;
    this.logger = new Logger();
  }

  public findById(_id: string): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
      this.model.findOne(Types.ObjectId(_id), (error: any, obj: any) => {
        if (error) {
          this.logActionFailure(this.findById.name, error.name, error.message);
          reject(error.name + ': ' + error.message);
        } else {
          this.logActionCompleted(this.findBy.name);
          obj ? resolve(obj) : resolve();
        }
      });
    });
  }

  public findOneBy(query: any): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
      this.model.findOne(query, (error: any, obj: any) => {
        if (error) {
          this.logActionFailure(this.findOneBy.name, error.name, error.message);
          reject(error.name + ': ' + error.message);
        } else {
          this.logActionCompleted(this.findOneBy.name);
          obj ? resolve(obj) : resolve();
        }
      });
    });
  }

  public findBy(query: any): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
      this.model.find(query, (error: any, obj: any) => {
        if (error) {
          this.logActionFailure(this.findBy.name, error.name, error.message);
          reject(error.name + ': ' + error.message);
        } else {
          this.logActionCompleted(this.findBy.name);
          obj ? resolve(obj) : resolve();
        }
      });
    });
  }

  public findAll(): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
      this.model.find({}, (error: any, obj: any) => {
        if (error) {
          this.logActionFailure(this.findAll.name, error.name, error.message);
          reject(error.name + ': ' + error.message);
        } else {
          this.logActionCompleted(this.findAll.name);
          obj ? resolve(obj) : resolve();
        }
      });
    });
  }

  public buildQuery(condition: string, value: any): any {
    var query = {};
    query[condition] = value;
    return query;
  }

  private logActionCompleted(methodName: string): void {
    this.logger.info({
      class: this.model.name + ' Model',
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
      class: this.model.name + ' Model',
      method: methodName,
      action: 'Transaction Fails reason: ' + errorName + ' desc: ' + errorDesc,
      params: {},
    });
  }
}
