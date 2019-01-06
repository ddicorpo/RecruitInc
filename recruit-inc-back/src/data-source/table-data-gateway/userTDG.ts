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

import { BaseTDG } from './baseTDG';
import { IUserModel } from '../../domain/model/IUserModel';
import { UserModel } from '../schema/userSchema';
import { Types, Model } from 'mongoose';

export class UserTDG {
  private baseTDG: BaseTDG;

  constructor() {
    this.baseTDG = new BaseTDG(UserModel);
  }

  public create(userAttr: IUserModel, id?: string): Promise<IUserModel> {
    userAttr._id = null;
    if (id != null) {
      userAttr._id = Types.ObjectId(id);
    } else {
      userAttr._id = Types.ObjectId();
    }

    const newUserModel : Model<IUserModel> = new UserModel(userAttr);

    try {
      return this.baseTDG.create(newUserModel, userAttr);
    } catch (Exception) {
      throw new Error('Error while creating User');
    }
  }

  public update(_id: string, updatedValue: IUserModel): Promise<boolean> {
    try {
      const userModelToUpdate: Model<IUserModel> = new UserModel(updatedValue);
      return this.baseTDG.update(Types.ObjectId(_id), userModelToUpdate);
    } catch (Exception) {
      throw new Error('Error while updating User');
    }
  }

  public delete(_id: string): Promise<boolean> {
    try {
      return this.baseTDG.delete(Types.ObjectId(_id));
    } catch (Exception) {
      throw new Error('Error while deleting User');
    }
  }
}
