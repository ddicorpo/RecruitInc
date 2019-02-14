import mongoose from 'mongoose';
import { IGithubUser } from '../../data-extraction/github/api-entities/IGithubUser';
/**
 * Typegoose is including schema and model in one class
 */
export interface IGithubUserModel {
  _id?: mongoose.Types.ObjectId;
  githubUser: IGithubUser;
  location: string;
}
