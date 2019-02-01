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

  public generalUpdate(criteria: any, update: any, options: any):Promise<boolean>{
      return new Promise((resolve: any, reject: any)=>{
      GithubUsersModel.updateOne(criteria, update, options, (error, doc) =>{

          if (error){
          this.baseTDG.logActionFailure(this.generalUpdate.name, error.name, error.message);
          resolve(false);
          }else{
          this.baseTDG.logActionCompleted(this.generalUpdate.name);
          resolve(true);
          }
      });
      });
  }

  public generalFind(query: any, projection: any): Promise<any> {
      return new Promise((resolve: any, reject: any)=>{
      GithubUsersModel.find(query, projection, (error, doc) =>{

          if (error){
          this.baseTDG.logActionFailure(this.generalFind.name, error.name, error.message);
          reject(error.name+': '+ error.message);
          }else{
          this.baseTDG.logActionCompleted(this.generalFind.name);
          resolve(doc);
          }
      });
      });
  }

  public findUnscannedUsers(pipeline: any[]): Promise<any>{
      return new Promise((resolve: any, reject: any)=>{
      GithubUsersModel.aggregate(pipeline, (error, doc) =>{

          if (error){
          this.baseTDG.logActionFailure(this.findUnscannedUsers.name, error.name, error.message);
          reject(error.name+': '+ error.message);
          }else{
          this.baseTDG.logActionCompleted(this.findUnscannedUsers.name);
          resolve(doc);
          }
      });
      });
  
  }

}
