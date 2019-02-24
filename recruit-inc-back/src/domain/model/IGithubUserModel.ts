import mongoose from 'mongoose';
import { IGithubUser } from '../../data-extraction/github/api-entities/IGithubUser';
import { ScanningStatus } from '../../data-source/schema/githubUserSchema';
/**
 * Typegoose is including schema and model in one class
 */
export interface IGithubUserModel {
  _id?: mongoose.Types.ObjectId;
  githubUser: IGithubUser;
  location: string;
  scanningStatus: ScanningStatus;
}
