import mongoose from 'mongoose';
import { IGithubUser } from '../../data-extraction/github/api-entities/IGithubUser';
/**
 * Typegoose is including schema and model in one class
 */
export interface IGithubUsersModel {
  _id?: mongoose.Types.ObjectId;
  githubUsers: IGithubUser[];
  location: string;
}
