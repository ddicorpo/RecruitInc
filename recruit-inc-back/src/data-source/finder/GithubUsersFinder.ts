import { GithubUsersModel } from '../schema/githubUsersSchema';
//import { IGithubUserModel } from '../../domain/model/IGithubUserModel';
import { BaseFinder } from './BaseFinder';
import { Types } from 'mongoose';

export class GithubUsersFinder {
    private baseFinder: BaseFinder = new BaseFinder(GithubUsersModel);
  public findById(_id: string): Promise<any> {
      return this.baseFinder.findById(_id);
  }

  public findByLocation(location: string): Promise<any> {
      return this.baseFinder.findOneBy({location});
  }

  public findAll(): Promise<any> {
      return this.baseFinder.findAll();
  }

}
