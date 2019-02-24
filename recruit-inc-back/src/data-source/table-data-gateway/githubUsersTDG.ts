import { BaseTDG } from './baseTDG';
import { IGithubUserModel } from '../../domain/model/IGithubUserModel';
import { GithubUserModel } from '../schema/githubUserSchema';
import { Types, Model } from 'mongoose';
import * as mongoose from 'mongoose';

export class GithubUsersTDG {
  private baseTDG: BaseTDG;

  constructor() {
    this.baseTDG = new BaseTDG(GithubUserModel);
  }

  public create(githubUsersAttr: IGithubUserModel): Promise<IGithubUserModel> {
    githubUsersAttr._id = Types.ObjectId();
    const newGithubUsersModel: Model<IGithubUserModel> = new GithubUserModel(
      githubUsersAttr
    );

    try {
      return this.baseTDG.create(newGithubUsersModel, githubUsersAttr);
    } catch (Exception) {
      throw new Error('Error while creating collection of GithubUsers');
    }
  }

  public update(_id: string, updatedValue: IGithubUserModel): Promise<boolean> {
    try {
      const GithubUsersModelToUpdate: Model<
        IGithubUserModel
      > = new GithubUserModel(updatedValue);
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

  public generalUpdate(
    criteria: any,
    update: any,
    options: any = {}
  ): Promise<boolean> {
    return new Promise((resolve: any, reject: any) => {
      try {
        //mongoose.connection.db.command({
        //    update: GithubUserModel.collection.name,
        //    updates: [
        //        { criteria: criteria, update: update, options: options}
        //    ],
        //})
        mongoose.connection.db
          .collection('githubUsers')
          .updateOne(criteria, update, options);
        this.baseTDG.logActionCompleted(this.generalUpdate.name);
        resolve(true);
      } catch (error) {
        this.baseTDG.logActionFailure(
          this.generalUpdate.name,
          error.name,
          error.toString()
        );
        resolve(false);
      }
    });
  }
  //public generalUpdate(
  //  criteria: any,
  //  update: any,
  //  options: any = {}
  //): Promise<boolean> {
  //  return new Promise((resolve: any, reject: any) => {
  //    GithubUserModel.updateOne(criteria, update, options, (error, doc) => {
  //      if (error) {
  //        this.baseTDG.logActionFailure(
  //          this.generalUpdate.name,
  //          error.name,
  //          error.toString()
  //        );
  //        resolve(false);
  //      } else {
  //        this.baseTDG.logActionCompleted(this.generalUpdate.name);
  //        resolve(true);
  //      }
  //    });
  //  });
  //}

  public insertMany(githubUsers: IGithubUserModel[]): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
      GithubUserModel.insertMany(githubUsers, {}, (error, doc) => {
        if (error) {
          this.baseTDG.logActionFailure(
            this.insertMany.name,
            error.name,
            error.message
          );
          reject(error.name + ': ' + error.message);
        } else {
          this.baseTDG.logActionCompleted(this.insertMany.name);
          resolve(doc);
        }
      });
    });
  }
}
