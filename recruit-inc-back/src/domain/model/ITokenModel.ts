import mongoose from 'mongoose';
/**
 * Typegoose is including schema and model in one class
 */
export interface ITokenModel {
  _id?: mongoose.Types.ObjectId;
  platform: Platform;
  AccessToken: string;
  RefreshToken: string;
  ExpiryDate: string;
}

export enum Platform {
  Github = 'Github',
  Gitlab = 'Gitlab',
  Bitbucket = 'Bitbucket',
}
