import { prop, Typegoose } from 'typegoose';
import { mongoose } from 'mongoose';
import { Model, Schema } from 'mongoose';
import { IQuestionsModel } from '../../domain/model/IQuestionModel';
import { IAnswersModel } from '../../domain/model/IAnswersModel';

export class questionsSchema extends Typegoose implements IQuestionsModel {
  @prop()
  _id?: mongoose.Types.ObjectId;

  @prop()
  type: string;

  @prop()
  question: string;

  @prop()
  answers: Array<IAnswersModel>;

  public static getModel(schema: Schema, collection: string) {
    return new schema().getModelForClass(schema, {
      schemaOptions: { collection: collection },
    });
  }
}

//TODO: Add Model
export const questionsModel: Model<IQuestionsModel> = questionsSchema.getModel(
  questionsSchema,
  'questions'
);
