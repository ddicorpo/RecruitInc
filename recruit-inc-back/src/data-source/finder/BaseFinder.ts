import { Logger } from '../../Logger';
import { Types } from 'mongoose';

export class BaseFinder {
  private model: any;
  private logger: Logger;

  constructor(model: any) {
    this.model = model;
    this.logger = new Logger();
    this.errorHandler = this.errorHandler.bind(this);
  }

  private errorHandler(
    error: any,
    obj: any,
    name: string,
    resolve: any,
    reject: any
  ) {
    if (error) {
      this.logActionFailure(name, error.name, error.message);
      reject(error.name + ': ' + error.message);
    } else {
      this.logActionCompleted(name);
      obj ? resolve(obj) : resolve();
    }
  }

  public findById(_id: string): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
      const findByIdErrorHandler: any = (error: any, obj: any) =>
        this.errorHandler(error, obj, this.findById.name, resolve, reject);
      this.model.findOne(Types.ObjectId(_id), findByIdErrorHandler);
    });
  }

  public aggregate(query: any): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
      const aggregateErrorHandler: any = (error: any, obj: any) =>
        this.errorHandler(error, obj, this.aggregate.name, resolve, reject);
      this.model.aggregate(query, aggregateErrorHandler).allowDiskUse(true);
    });
  }

  public findOneBy(query: any): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
      const findOneByErrorHandler: any = (error: any, obj: any) =>
        this.errorHandler(error, obj, this.findOneBy.name, resolve, reject);
      this.model.findOne(query, findOneByErrorHandler);
    });
  }

  public findBy(query: any): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
      const findByErrorHandler: any = (error: any, obj: any) =>
        this.errorHandler(error, obj, this.findBy.name, resolve, reject);
      this.model.find(query, findByErrorHandler);
    });
  }

  public findAll(): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
      const findAllErrorHandler: any = (error: any, obj: any) =>
        this.errorHandler(error, obj, this.findAll.name, resolve, reject);
      this.model.find({}, findAllErrorHandler);
    });
  }

  public findByWithPage(
    query: any,
    page: number,
    pageSize: number,
    excludeFields: {} = {}
  ): Promise<any> {
    const numberOfResultToSkip: number = (page - 1) * pageSize;
    const refinedQuery = query == undefined ? {} : query;
    return new Promise((resolve: any, reject: any) => {
      const findByErrorHandler: any = (error: any, obj: any) =>
        this.errorHandler(error, obj, this.findBy.name, resolve, reject);
      this.model
        .find(refinedQuery, excludeFields, findByErrorHandler)
        .skip(numberOfResultToSkip)
        .limit(pageSize);
    });
  }

  public logActionCompleted(methodName: string): void {
    this.logger.info({
      class: this.model.name + ' Model',
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
      class: this.model.name + ' Model',
      method: methodName,
      action: 'Transaction Fails reason: ' + errorName + ' desc: ' + errorDesc,
      params: {},
    });
  }
}
