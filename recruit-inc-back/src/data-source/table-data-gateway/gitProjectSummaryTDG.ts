import { BaseTDG } from './baseTDG';
import { IGitProjectSummary } from '../../matching-algo/data-model/output-model/IGitProjectSummary';
import { GitProjectSummaryModel } from '../schema/gitProjectSummarySchema';
import { Types } from 'mongoose';

export class GitProjectSummaryTDG {
  private baseTDG: BaseTDG;

  constructor() {
    this.baseTDG = new BaseTDG(GitProjectSummaryModel);
  }

  public create(
    gitProjectSummaryAttr: IGitProjectSummary,
    id?: string
  ): Promise<IGitProjectSummary> {
    gitProjectSummaryAttr._id = null;
    if (id != null) {
      gitProjectSummaryAttr._id = Types.ObjectId(id);
    } else {
      gitProjectSummaryAttr._id = Types.ObjectId();
    }

    const newGitProjectSummaryModel = new GitProjectSummaryModel(
      gitProjectSummaryAttr
    );

    try {
      return this.baseTDG.create(
        newGitProjectSummaryModel,
        gitProjectSummaryAttr
      );
    } catch (Exception) {
      throw new Error('Error while creating GitProjectSummary');
    }
  }

  public update(
    _id: string,
    updatedValue: IGitProjectSummary
  ): Promise<boolean> {
    try {
      const gitProjectSummaryModelToUpdate = new GitProjectSummaryModel(
        updatedValue
      );
      return this.baseTDG.update(
        Types.ObjectId(_id),
        gitProjectSummaryModelToUpdate
      );
    } catch (Exception) {
      throw new Error('Error while updating GitProjectSummary');
    }
  }

  public delete(_id: string): Promise<boolean> {
    try {
      return this.baseTDG.delete(Types.ObjectId(_id));
    } catch (Exception) {
      throw new Error('Error while creating GitProjectSummary');
    }
  }
}
