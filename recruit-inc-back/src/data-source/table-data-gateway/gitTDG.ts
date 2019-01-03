import { BaseTDG } from './baseTDG';
import { IGitModel } from '../../domain/model/IGitModel';
import { GitModel } from '../schema/gitSchema';
import { Types } from 'mongoose';

export class GitTDG {
  private baseTDG: BaseTDG;

  constructor() {
    this.baseTDG = new BaseTDG(GitModel);
  }

  public create(gitAttr: IGitModel): Promise<IGitModel> {
    gitAttr._id = Types.ObjectId();
    const newGitModel = new GitModel(gitAttr);

    try {
      return this.baseTDG.create(newGitModel, gitAttr);
    } catch (Exception) {
      throw new Error('Error while creating Git object');
    }
  }

  public update(_id: string, updatedValue: IGitModel): Promise<boolean> {
    try {
      const GitModelToUpdate = new GitModel(updatedValue);
      return this.baseTDG.update(Types.ObjectId(_id), GitModelToUpdate);
    } catch (Exception) {
      throw new Error('Error while updating Git object');
    }
  }

  public delete(_id: string): Promise<boolean> {
    try {
      return this.baseTDG.delete(Types.ObjectId(_id));
    } catch (Exception) {
      throw new Error('Error while deleting Git object');
    }
  }
}
