/**
 * Typegoose is including schema and model in one class
 */
import mongoose from 'mongoose';
import { IGitDataModel } from './IGitDataModel';

export interface IGitModel {
  _id?: mongoose.Types.ObjectId;
  IGitData: IGitDataModel[];
  IToken: string;
}
