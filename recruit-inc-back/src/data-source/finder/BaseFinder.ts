import { Types } from 'mongoose';

export class BaseFinder {
    constructor() {}

  public findById(item : any, _id: string): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
      item.findOne(Types.ObjectId(_id), (error: any, obj: any) => {
        if (error) reject(error.name + ': ' + error.message);
        obj ? resolve(obj) : resolve();
      });
    });
  }

  public findOneBy(item: any, query: any): Promise<any>{
    return new Promise((resolve: any, reject: any) => {
      item.findOne(
        query,
        (error: any, obj: any) => {
          if (error) reject(error.name + ': ' + error.message);
          obj ? resolve(obj) : resolve();
        }
      );
    });
  }

  public findBy(item: any, query: any): Promise<any>{
    return new Promise((resolve: any, reject: any) => {
      item.find(
        query,
        (error: any, obj: any) => {
          if (error) reject(error.name + ': ' + error.message);
          obj ? resolve(obj) : resolve();
        }
      );
    });
  }

  public findAll(item: any): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
      item.find({}, (error: any, obj: any) => {
        if (error) reject(error.name + ': ' + error.message);
        obj ? resolve(obj) : resolve();
      });
    });
  }
}
