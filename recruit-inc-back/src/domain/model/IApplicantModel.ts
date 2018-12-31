import mongoose from 'mongoose';
import { IGitModel } from './IGitModel';
/**
 * Typegoose is including schema and model in one class
 */
export interface IApplicantModel {
  _id?: mongoose.Types.ObjectId;
  platformUsername: string;
  platformEmail?: string;
  iGit: IGitModel;
  userType: UserType;
}

export enum UserType {
    Applicant = 'Applicant',
    Candidate = 'Candidate',
}
