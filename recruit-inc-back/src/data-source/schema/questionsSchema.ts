import { prop, Typegoose } from 'typegoose';
import { mongoose } from 'mongoose';
import { Model, Schema } from 'mongoose';
import { ApplicantSchema } from './applicantSchema';
import { IQuestionsModel } from '../../domain/model/IQuestionModel';
import { IAnswersModel } from '../../domain/model/IAnswersModel';

export class questionsSchema extends Typegoose {
  @prop()
  _id?: mongoose.Types.ObjectId;

  @prop()
  type: string;

  @prop()
  question: string;

  @prop()
  answers: Array<IAnswersModel>;
}
//TODO: Add Model
export const questionsModel: Model<IQuestionsModel> = ApplicantSchema.getModel(
  questionsSchema,
  'questions'
);
