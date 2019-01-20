import { BaseTDG } from './baseTDG';
import { IGithubUsersModel } from '../../domain/model/IGithubUsersModel';
import { GithubUsersModel } from '../schema/githubUsersSchema';
import { Types, Model } from 'mongoose';

export class GithubUsersTDG {
  private baseTDG: BaseTDG;

  constructor() {
    this.baseTDG = new BaseTDG(GithubUsersModel);
  }

  public create(githubUsersAttr: IGithubUsersModel): Promise<IGithubUsersModel> {
    githubUsersAttr._id = Types.ObjectId();
    const newGithubUsersModel : Model<IGithubUsersModel> = new GithubUsersModel(githubUsersAttr);

    try {
      return this.baseTDG.create(newGithubUsersModel, githubUsersAttr);
    } catch (Exception) {
      throw new Error('Error while creating collection of GithubUsers');
    }
  }

  public update(_id: string, updatedValue: IGithubUsersModel): Promise<boolean> {
    try {
      const GithubUsersModelToUpdate: Model<IGithubUsersModel> = new GithubUsersModel(updatedValue);
      return this.baseTDG.update(Types.ObjectId(_id), GithubUsersModelToUpdate);
    } catch (Exception) {
      throw new Error('Error while updating collection of GithubUsers');
    }
  }

  public delete(_id: string): Promise<boolean> {
    try {
      return this.baseTDG.delete(Types.ObjectId(_id));
    } catch (Exception) {
      throw new Error('Error while delete collection of GithubUsers');
    }
  }
}
