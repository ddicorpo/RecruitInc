import { BaseTDG } from './baseTDG';
import { UserModel, User } from '../../domain/model/userModel';

export class userTDG {
  private base: BaseTDG;
  constructor() {
    this.base = new BaseTDG(UserModel);
  }

  public create(userValue: User) {}

  public static update(UserModel: any) {}

  public static delete(UserModel: any) {}
}
