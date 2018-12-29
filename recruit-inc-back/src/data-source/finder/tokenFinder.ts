import { BaseFinder } from './baseFinder';
import { TokenModel } from '../schema/tokenSchema';
import { ITokenModel } from '../../domain/model/ITokenModel';
import { Types } from 'mongoose';
import { Platform } from '../../domain/model/ITokenModel';

export class ApplicantFinder {
  private baseFinder: BaseFinder;

  constructor() {
    this.baseFinder = new BaseFinder(TokenModel);
  }

  public findById(_id: string): Promise<ITokenModel> {
    return new Promise((resolve: any, reject: any) => {
      TokenModel.findOne(Types.ObjectId(_id), (error: any, obj: any) => {
        if (error) reject(error.name + ': ' + error.message);
        obj ? resolve(obj) : resolve();
      });
    });
  }

  public findByPlatform(platform: Platform): Promise<ITokenModel> {
    return new Promise((resolve: any, reject: any) => {
      TokenModel.find({ platform: platform }, (error: any, obj: any) => {
        if (error) reject(error.name + ': ' + error.message);
        obj ? resolve(obj) : resolve();
      });
    });
  }

  public findByAccessToken(AccessToken: string): Promise<ITokenModel> {
    return new Promise((resolve: any, reject: any) => {
      TokenModel.findOne(
        { AccessToken: AccessToken },
        (error: any, obj: any) => {
          if (error) reject(error.name + ': ' + error.message);
          obj ? resolve(obj) : resolve();
        }
      );
    });
  }

  public findByRefreshToken(RefreshToken: string): Promise<ITokenModel> {
    return new Promise((resolve: any, reject: any) => {
      TokenModel.findOne(
        { RefreshToken: RefreshToken },
        (error: any, obj: any) => {
          if (error) reject(error.name + ': ' + error.message);
          obj ? resolve(obj) : resolve();
        }
      );
    });
  }

  public findByExpiryDate(ExpiryDate: string): Promise<ITokenModel> {
    return new Promise((resolve: any, reject: any) => {
      TokenModel.findOne({ ExpiryDate: ExpiryDate }, (error: any, obj: any) => {
        if (error) reject(error.name + ': ' + error.message);
        obj ? resolve(obj) : resolve();
      });
    });
  }

  public findAll(): Promise<ITokenModel> {
    return new Promise((resolve: any, reject: any) => {
      TokenModel.find({}, (error: any, obj: any) => {
        if (error) reject(error.name + ': ' + error.message);
        obj ? resolve(obj) : resolve();
      });
    });
  }
}
