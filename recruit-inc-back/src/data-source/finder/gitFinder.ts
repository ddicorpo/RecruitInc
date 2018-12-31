import { GitModel } from '../schema/gitSchema';
import { IGitModel } from '../../domain/model/IGitModel';
import { Types } from 'mongoose';

export class GitFinder {
  public findById(_id: string): Promise<IGitModel> {
    return new Promise((resolve: any, reject: any) => {
      GitModel.findOne(Types.ObjectId(_id), (error: any, obj: any) => {
        if (error) reject(error.name + ': ' + error.message);
        obj ? resolve(obj) : resolve();
      });
    });
  }

  public findByToken(IToken: string): Promise<IGitModel> {
    return new Promise((resolve: any, reject: any) => {
      GitModel.findOne({ IToken: IToken }, (error: any, obj: any) => {
        if (error) reject(error.name + ': ' + error.message);
        obj ? resolve(obj) : resolve();
      });
    });
  }

  public findAll(): Promise<IGitModel> {
    return new Promise((resolve: any, reject: any) => {
      GitModel.find({}, (error: any, obj: any) => {
        if (error) reject(error.name + ': ' + error.message);
        obj ? resolve(obj) : resolve();
      });
    });
  }
}
