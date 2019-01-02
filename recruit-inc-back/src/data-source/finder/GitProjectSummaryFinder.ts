import { IGitProjectSummary } from '../../matching-algo/data-model/output-model/IGitProjectSummary';
import { GitProjectSummaryModel } from '../schema/gitProjectSummarySchema';
import { BaseFinder } from './BaseFinder';
import { Types } from 'mongoose';

export class GitProjectSummaryFinder {
    private baseFinder: BaseFinder = new BaseFinder(GitProjectSummaryModel);
  public findById(_id: string): Promise<IGitProjectSummary> {
      return this.baseFinder.findById(_id);
  }

  public findAll(): Promise<IGitProjectSummary> {
      return this.baseFinder.findAll();
  }
}
