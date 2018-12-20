import { BaseFinder } from './baseFinder';
import { UserModel } from '../schema/userSchema';
import { IUserModel } from '../../domain/model/IUserModel';
/**
 * Inspired by: https://github.com/gsi-manuel/ts-nodejs-express-webpack/blob/master/src/services/province.service.ts
 * This class will be used to find/find all and other find User object
 * The class is using BaseFinder to do transaction allowing uniform transaction handling
 * and logging
 * *************************************************************
 * NOTE: This class doesn't include logic it's only transaction
 * *************************************************************
 */

export class UserFinder {
  private baseFinder: BaseFinder;

  constructor() {
    this.baseFinder = new BaseFinder(UserModel);
  }

  /**
   * Find the user with the _id (string)
   * In mongo all object have a _id
   * @param _id
   */
  public findById(_id: string): Promise<IUserModel> {
    console.log('find user with id ' + _id);
    return new Promise((resolve: any, reject: any) => {
      UserModel.findById(_id, (error: any, obj: any) => {
        if (error) reject(error.name + ': ' + error.message);
        obj ? resolve(obj) : resolve();
        console.log(obj);
      });
    });
  }

  public findByUsername(username: string): Promise<IUserModel> {
    return new Promise((resolve: any, reject: any) => {});
  }

  public findByEmail(email: string): Promise<IUserModel> {
    //TODO: Implement this
    return null;
  }

  /**
   * Search a user by username and password
   * can be used for login
   * @param user
   */
  public findByUsernameAndPassword(user: IUserModel): Promise<boolean> {
    //TODO: Implement this
    return null;
  }

  public findAll() {
    //TODO: Implement this
    return null;
  }
}
