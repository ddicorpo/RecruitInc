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
  public generalFind(query: any, projection: any = {}): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
      GithubUserModel.find(query, projection, (error, doc) => {
        if (error) {
          this.baseFinder.logActionFailure(
              this.generalFind.name,
              error.name,
              error.message
          );
          reject(error.name + ': ' + error.message);
        } else {
          this.baseFinder.logActionCompleted(this.generalFind.name);
          resolve(doc);
        }
      });
    });
  }

  //aggregate returns an array apparently
  public findUnscannedUsers(pipeline: any[]): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
      GithubUserModel.aggregate(pipeline, (error, doc) => {
        if (error) {
          this.baseFinder.logActionFailure(
              this.findUnscannedUsers.name,
              error.name,
              error.message
          );
          reject(error.name + ': ' + error.message);
        } else {
          this.baseFinder.logActionCompleted(this.findUnscannedUsers.name);
          resolve(doc);
        }
      });
    });
  }
}
