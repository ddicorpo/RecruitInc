import { IGithubUser } from '../../data-extraction/github/api-entities/IGithubUser';
import { IGithubUsersModel } from '../../domain/model/IGithubUsersModel';
import { ApplicantSchema } from './applicantSchema';
import { prop, Typegoose } from 'typegoose';
import { mongoose } from 'mongoose';
import { Model, Schema } from 'mongoose';

export class GithubUsersSchema extends Typegoose implements IGithubUsersModel {
  @prop()
  _id?: mongoose.Types.ObjectId;

  @prop()
  githubUser: IGithubUser;

  @prop({ unique: true })
  location: string;
}

export const GithubUsersModel: Model<
  IGithubUsersModel
> = ApplicantSchema.getModel(GithubUsersSchema, 'githubUsers');
