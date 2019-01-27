import { IGithubUsersModel } from '../../domain/model/IGithubUsersModel';
import { GithubUsersModel } from '../schema/githubUsersSchema';
import { BaseFinder } from './BaseFinder';
import { Types } from 'mongoose';

export class GithubUsersFinder {
    private baseFinder: BaseFinder = new BaseFinder(GithubUsersModel);
  public findById(_id: string): Promise<IGithubUsersModel> {
      return this.baseFinder.findById(_id);
  }

  public findByLocation(location: string): Promise<IGithubUsersModel> {
      return this.baseFinder.findOneBy({location});
  }

  public findAll(): Promise<IGithubUsersModel> {
      return this.baseFinder.findAll();
  }

}
