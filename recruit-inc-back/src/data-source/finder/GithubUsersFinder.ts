import { IGithubUserModel } from '../../domain/model/IGithubUserModel';
import { GithubUserModel } from '../schema/githubUserSchema';
import { BaseFinder } from './BaseFinder';
import { Types } from 'mongoose';

export class GithubUsersFinder {
  private baseFinder: BaseFinder = new BaseFinder(GithubUserModel);
  public findById(_id: string): Promise<IGithubUserModel> {
    return this.baseFinder.findById(_id);
  }

  public findByLocation(location: string): Promise<IGithubUserModel[]> {
    return this.baseFinder.findBy({ location });
  }

  public findAll(): Promise<IGithubUserModel> {
    return this.baseFinder.findAll();
  }
}
