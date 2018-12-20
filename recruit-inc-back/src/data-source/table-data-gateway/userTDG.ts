import { BaseTDG } from './baseTDG';
import { UserModel } from '../../domain/model/userModel';
import { formalUsermodel } from '../schema/userSchema';
/**
 * Inspired by: https://github.com/gsi-manuel/ts-nodejs-express-webpack/blob/master/src/services/province.service.ts
 * This class will be used to update/delete/create User object
 * The class is using BaseTDG to do transaction allowing uniform transaction handling
 * and logging
 */
export class UserTDG {
  private baseTDG: BaseTDG;

  constructor() {
    this.baseTDG = new BaseTDG(formalUsermodel);
  }

  public create(newUser: UserModel) {
    console.log('creating user...');
    const newModelIn = new formalUsermodel(newUser);
    this.baseTDG.create(newModelIn, newUser);
  }

  public update(_id: string, updatedValue: any) {
    return this.baseTDG.update(_id, updatedValue);
  }

  public delete(_id: string) {
    return this.baseTDG.delete(_id);
  }
}
