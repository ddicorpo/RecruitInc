import { TokenModel } from '../schema/tokenSchema';
import { ITokenModel } from '../../domain/model/ITokenModel';
import { Types } from 'mongoose';
import { BaseFinder } from './BaseFinder';
import { Platform } from '../../domain/model/ITokenModel';

export class TokenFinder {
    private baseFinder: BaseFinder = new BaseFinder(TokenModel);
  public findById(_id: string): Promise<ITokenModel> {
      return this.baseFinder.findById(_id);
  }

  public findByPlatform(platform: Platform): Promise<ITokenModel> {
      return this.baseFinder.findBy(this.baseFinder.buildQuery("platform", platform));
  }

  public findByAccessToken(AccessToken: string): Promise<ITokenModel> {
      return this.baseFinder.findOneBy(this.baseFinder.buildQuery("AccessToken", AccessToken));
  }

  public findByRefreshToken(RefreshToken: string): Promise<ITokenModel> {
      return this.baseFinder.findOneBy(this.baseFinder.buildQuery("RefreshToken", RefreshToken));
  }

  public findByExpiryDate(ExpiryDate: string): Promise<ITokenModel> {
      return this.baseFinder.findOneBy(this.baseFinder.buildQuery("ExpiryDate", ExpiryDate));
  }

  public findAll(): Promise<ITokenModel> {
      return this.baseFinder.findAll();
  }
}
