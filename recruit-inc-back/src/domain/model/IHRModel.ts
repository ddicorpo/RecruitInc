/**
 * Typegoose is including schema and model in one class
 */
import { mongoose } from 'mongoose';
import { IUserModel } from './IUserModel';

export interface IHRModel {
  _id?: mongoose.Type.ObjectId;
  userRef: IUserModel;
}
