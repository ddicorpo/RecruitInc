import { IGithubUser } from '../../data-extraction/github/api-entities/IGithubUser';
import { IGithubUserModel } from '../../domain/model/IGithubUserModel';
import { ApplicantSchema } from './applicantSchema';
import { prop, Typegoose } from 'typegoose';
import { mongoose } from 'mongoose';
import { Model, Schema } from 'mongoose';

export enum ScanningStatus {
  pending = 'pending',
  started = 'started',
  paused = 'paused',
  completed = 'completed',
  analyzed = 'analyzed',
}

export class GithubUserSchema extends Typegoose implements IGithubUserModel {
  @prop()
  _id?: mongoose.Types.ObjectId;

  @prop()
  githubUser: IGithubUser;

  @prop()
  location: string;

  @prop()
  scanningStatus: ScanningStatus;
}

export const GithubUserModel: Model<
  IGithubUserModel
> = ApplicantSchema.getModel(GithubUserSchema, 'githubUsers');
