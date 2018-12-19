import { BaseTDG } from './baseTDG';
import { UserModel } from '../../domain/model/userModel';
/**
 * Inspired by: https://github.com/gsi-manuel/ts-nodejs-express-webpack/blob/master/src/services/province.service.ts
 * This class will be used to update/delete/create User object
 * The class is using BaseTDG to do transaction allowing uniform transaction handling
 * and logging
 */
export class userTDG {
  private baseTDG: BaseTDG;

  constructor() {
    this.baseTDG = new BaseTDG(UserModel);
  }

  public create(userValue: any) {
    const attr = { code: userValue.code };
    const newUser = {
      code: userValue.code,
      name: userValue.name,
    };
    const user = new UserModel(newUser);
    return this.baseTDG.create(user, attr);
  }

  public update(_id: string, updatedValue: any) {
    return this.baseTDG.update(_id, updatedValue);
  }

  public delete(_id: string) {
    return this.baseTDG.delete(_id);
  }
}
