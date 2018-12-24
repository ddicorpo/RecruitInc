import { BaseTDG } from './baseTDG';
import { IGitDataModel } from '../../domain/model/IGitDataModel';
import { GitDataModel } from '../schema/gitDataSchema';
import { Types } from 'mongoose';

export class GitDataTDG {
  private baseTDG: BaseTDG;

  constructor() {
    this.baseTDG = new BaseTDG(GitDataModel);
  }

  public create(gitDataAttr: IGitDataModel): Promise<IGitDataModel> {
    gitDataAttr._id = Types.ObjectId();
    const newGitDataModel = new GitDataModel(gitDataAttr);

    try {
      return this.baseTDG.create(newGitDataModel, gitDataAttr);
    } catch (Exception) {
      throw new Error('Error while creating GitData');
    }
  }

  public update(_id: string, updatedValue: IGitDataModel): Promise<boolean> {
    try {
      const GitDataModelToUpdate = new GitDataModel(updatedValue);
      return this.baseTDG.update(Types.ObjectId(_id), GitDataModelToUpdate);
    } catch (Exception) {
      throw new Error('Error while creating GitData');
    }
  }

  public delete(_id: string): Promise<boolean> {
    try {
      return this.baseTDG.delete(Types.ObjectId(_id));
    } catch (Exception) {
      throw new Error('Error while creating GitData');
    }
  }
}
