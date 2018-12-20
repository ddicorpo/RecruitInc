import { BaseTDG } from './baseTDG';
import { IUserModel } from '../../domain/model/IUserModel';
import { UserModel } from '../schema/userSchema';
/**
 * Inspired by: https://github.com/gsi-manuel/ts-nodejs-express-webpack/blob/master/src/services/province.service.ts
 * This class will be used to update/delete/create User object
 * The class is using BaseTDG to do transaction allowing uniform transaction handling
 * and logging
 *
 * *************************************************************
 * NOTE: This class doesn't include logic it's only transaction
 * *************************************************************
 */
export class UserTDG {
  private baseTDG: BaseTDG;

  constructor() {
    this.baseTDG = new BaseTDG(UserModel);
  }

  public create(userAttr: IUserModel): Promise<any> {
    const newUserModel = new UserModel(userAttr);
    try {
      return this.baseTDG.create(newUserModel, userAttr);
    } catch (Exception) {
      throw new Error('Error while creating User');
    }
  }

  public update(_id: string, updatedValue: any): Promise<boolean> {
    try {
      return this.baseTDG.update(_id, updatedValue);
    } catch (Exception) {
      throw new Error('Error while creating User');
    }
  }

  public delete(_id: string): Promise<boolean> {
    try {
      return this.baseTDG.delete(_id);
    } catch (Exception) {
      throw new Error('Error while creating User');
    }
  }
}
