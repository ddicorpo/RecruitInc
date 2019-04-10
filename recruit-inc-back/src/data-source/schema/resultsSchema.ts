import { prop, Typegoose } from 'typegoose';
import { mongoose } from 'mongoose';
import { Model, Schema } from 'mongoose';
import { IResultsModel } from '../../domain/model/IResultsModel';
import { IGroupModel } from '../../domain/model/IGroupModel';

export class resultsSchema extends Typegoose implements IResultsModel {
  @prop()
  _id?: mongoose.Types.ObjectId;

  @prop()
  fullName: string;

  @prop()
  total: number;

  @prop()
  group: Array<IGroupModel>;

  public static getModel(schema: Schema, collection: string) {
    return new schema().getModelForClass(schema, {
      schemaOptions: { collection: collection },
    });
  }
}

export const resultsModel: Model<IResultsModel> = resultsSchema.getModel(
  resultsSchema,
  'results'
);
