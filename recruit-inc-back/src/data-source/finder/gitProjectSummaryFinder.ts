import { BaseFinder } from './baseFinder';
import { IGitProjectSummary } from '../../matching-algo/data-model/output-model/IGitProjectSummary';
import { GitProjectSummaryModel } from '../schema/gitProjectSummarySchema';
import { Types } from 'mongoose';

export class GitProjectSummaryFinder {
  private baseFinder: BaseFinder;

  constructor() {
    this.baseFinder = new BaseFinder(GitProjectSummaryModel);
  }

  public findById(_id: string): Promise<IGitProjectSummary> {
    return new Promise((resolve: any, reject: any) => {
      GitProjectSummaryModel.findOne(Types.ObjectId(_id), (error: any, obj: any) => {
        if (error) reject(error.name + ': ' + error.message);
        obj ? resolve(obj) : resolve();
      });
    });
  }

  public findAll(): Promise<IGitProjectSummary> {
    return new Promise((resolve: any, reject: any) => {
      GitProjectSummaryModel.find({}, (error: any, obj: any) => {
        if (error) reject(error.name + ': ' + error.message);
        obj ? resolve(obj) : resolve();
      });
    });
  }
}
