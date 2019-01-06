/**
 * Typegoose is including schema and model in one class
 */

import { prop, Typegoose } from 'typegoose';
import { IGitModel } from '../../domain/model/IGitModel';
import { IGitDataModel } from '../../domain/model/IGitDataModel';
import { mongoose } from 'mongoose';
import { ITokenModel } from '../../domain/model/ITokenModel';
import { ApplicantSchema } from './applicantSchema';
import { Model, Schema } from 'mongoose';

export class GitSchema extends Typegoose implements IGitModel {
  @prop()
  _id?: mongoose.Types.ObjectId;

  @prop({ required: true })
  IGitData: IGitDataModel[];

  @prop({ required: true })
  IToken: ITokenModel;
}

export const GitModel: Model<IGitModel> =  ApplicantSchema.getModel(GitSchema, 'git');
