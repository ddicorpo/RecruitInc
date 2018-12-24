import { BaseFinder } from './baseFinder';
import { GitDataModel } from '../schema/gitDataSchema';
import { IGitDataModel } from '../../domain/model/IGitDataModel';
import { Platform } from '../../domain/model/IGitDataModel';
import { Types } from 'mongoose';

export class GitDataFinder {
  private baseFinder: BaseFinder;

  constructor() {
    this.baseFinder = new BaseFinder(GitDataModel);
  }

  public findById(_id: string): Promise<IGitDataModel> {
    return new Promise((resolve: any, reject: any) => {
      GitDataModel.findOne(Types.ObjectId(_id), (error: any, obj: any) => {
        if (error) reject(error.name + ': ' + error.message);
        obj ? resolve(obj) : resolve();
      });
    });
  }

  public findByLastKnownInfoDate(lastKnownInfoDate: string): Promise<IGitDataModel> {
    return new Promise((resolve: any, reject: any) => {
      GitDataModel.find({ lastKnownInfoDate: lastKnownInfoDate }, (error: any, obj: any) => {
        if (error) reject(error.name + ': ' + error.message);
        obj ? resolve(obj) : resolve();
      });
    });
  }

  public findByPlatform(platform: Platform): Promise<IGitDataModel> {
    return new Promise((resolve: any, reject: any) => {
      GitDataModel.find({ platform: platform }, (error: any, obj: any) => {
        if (error) reject(error.name + ': ' + error.message);
        obj ? resolve(obj) : resolve();
      });
    });
  }

  public findAll(): Promise<IGitDataModel> {
    return new Promise((resolve: any, reject: any) => {
      GitDataModel.find({}, (error: any, obj: any) => {
        if (error) reject(error.name + ': ' + error.message);
        obj ? resolve(obj) : resolve();
      });
    });
  }
}
