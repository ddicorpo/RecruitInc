import { BaseTDG } from './baseTDG';
import { ITokenModel } from '../../domain/model/ITokenModel';
import { TokenModel } from '../schema/tokenSchema';
import { Types } from 'mongoose';

export class GitDataTDG {
  private baseTDG: BaseTDG;

  constructor() {
    this.baseTDG = new BaseTDG(TokenModel);
  }

  public create(tokenAttr: ITokenModel): Promise<ITokenModel> {
    tokenAttr._id = Types.ObjectId();
    const newTokenModel = new TokenModel(tokenAttr);

    try {
      return this.baseTDG.create(newTokenModel, tokenAttr);
    } catch (Exception) {
      throw new Error('Error while creating token object');
    }
  }

  public update(_id: string, updatedValue: ITokenModel): Promise<boolean> {
    try {
      const TokenModelToUpdate = new TokenModel(updatedValue);
      return this.baseTDG.update(Types.ObjectId(_id), TokenModelToUpdate);
    } catch (Exception) {
      throw new Error('Error while creating token object');
    }
  }

  public delete(_id: string): Promise<boolean> {
    try {
      return this.baseTDG.delete(Types.ObjectId(_id));
    } catch (Exception) {
      throw new Error('Error while creating token object');
    }
  }
}
