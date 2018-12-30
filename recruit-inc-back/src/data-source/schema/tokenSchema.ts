/**
 * Typegoose is including schema and model in one class
 */
import { prop, Typegoose } from 'typegoose';
import { mongoose } from 'mongoose';
import { ITokenModel } from '../../domain/model/ITokenModel';
import { Platform } from '../../domain/model/IGitDataModel';

export class TokenSchema extends Typegoose implements ITokenModel {
  @prop()
  _id?: mongoose.Types.ObjectId;

  @prop({ required: true, enum: Platform })
  platform: Platform;

  @prop({ required: true, unique: true })
  AccessToken: string;

  @prop({ required: true, unique: true })
  RefreshToken: string;

  @prop({ required: true, unique: true })
  ExpiryDate: string;
}
// Can pass schema option in statement below
export const TokenModel = new TokenSchema().getModelForClass(TokenSchema, {
  schemaOptions: { collection: 'tokens' },
});
