import { Types } from 'mongoose';

export class BaseFinder {

    private model: any;

    constructor(model: any) {
        this.model = model;
    }

  public findById(_id: string): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
      this.model.findOne(Types.ObjectId(_id), (error: any, obj: any) => {
        if (error) reject(error.name + ': ' + error.message);
        obj ? resolve(obj) : resolve();
      });
    });
  }

  public findOneBy(query: any): Promise<any>{
    return new Promise((resolve: any, reject: any) => {
      this.model.findOne(
        query,
        (error: any, obj: any) => {
          if (error) reject(error.name + ': ' + error.message);
          obj ? resolve(obj) : resolve();
        }
      );
    });
  }

  public findBy(query: any): Promise<any>{
    return new Promise((resolve: any, reject: any) => {
      this.model.find(
        query,
        (error: any, obj: any) => {
          if (error) reject(error.name + ': ' + error.message);
          obj ? resolve(obj) : resolve();
        }
      );
    });
  }

  public findAll(): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
      this.model.find({}, (error: any, obj: any) => {
        if (error) reject(error.name + ': ' + error.message);
        obj ? resolve(obj) : resolve();
      });
    });
  }

  public buildQuery(condition: string, value: any): any {
      var query = {};
      query[condition] = value;
      return query;
  }

}
