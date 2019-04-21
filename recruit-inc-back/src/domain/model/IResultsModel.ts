import mongoose from 'mongoose';
import { IGroupModel } from './IGroupModel';

export interface IResultsModel {
  _id?: mongoose.Types.ObjectId;
  fullName: string;
  total: number;
  group: IGroupModel[];
}
