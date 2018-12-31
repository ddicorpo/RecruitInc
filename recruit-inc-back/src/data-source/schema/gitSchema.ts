/**
 * Typegoose is including schema and model in one class
 */

import { prop, Typegoose } from 'typegoose';
import { IGitModel } from '../../domain/model/IGitModel';
import { IGitDataModel } from '../../domain/model/IGitDataModel';
import { mongoose } from 'mongoose';
import { ITokenModel } from '../../domain/model/ITokenModel';

export class GitSchema extends Typegoose implements IGitModel {
  @prop()
  _id?: mongoose.Types.ObjectId;

  @prop({ required: true })
  IGitData: IGitDataModel[];

  @prop({ required: true })
  IToken: ITokenModel;
}

// Can pass schema option in statement below
export const GitModel = new GitSchema().getModelForClass(GitSchema, {
  schemaOptions: { collection: 'git' },
});
