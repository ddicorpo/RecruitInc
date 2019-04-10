import mongoose from 'mongoose';
import { IAnswersModel } from './IAnswersModel';

export interface IQuestionsModel {
  _id?: mongoose.Types.ObjectId;
  type: string;
  question: string;
  answers: IAnswersModel[];
}
