import { IGithubUser } from '../../data-extraction/github/api-entities/IGithubUser';
import { IGithubUserModel } from '../../domain/model/IGithubUserModel';
import { ApplicantSchema } from './applicantSchema';
import { prop, Typegoose } from 'typegoose';
import { mongoose } from 'mongoose';
import { Model, Schema } from 'mongoose';

export class GithubUserSchema extends Typegoose implements IGithubUserModel {
  @prop()
  _id?: mongoose.Types.ObjectId;

  @prop()
  githubUser: IGithubUser;

  @prop({ unique: true })
  location: string;
}

export const GithubUserModel: Model<
  IGithubUserModel
> = ApplicantSchema.getModel(GithubUserSchema, 'githubUsers');
