/**
 * Typegoose is including schema and model in one class
 */
import { prop, Typegoose } from 'typegoose';
import { mongoose } from 'mongoose';
import { ApplicantSchema } from './applicantSchema';
import { Model, Schema } from 'mongoose';
import { ICronModel } from '../../domain/model/ICronModel';

export class CronSchema extends Typegoose implements ICronModel {
  @prop()
  _id?: mongoose.Types.ObjectId;

  @prop({ required: true })
  location: string;

  @prop({ required: true })
  number_scanned: number;

  @prop({ required: true })
  total_number: number;

  @prop({ required: true })
  cron_pattern: string;

  @prop({ required: true })
  status: string;
}

export const CronModel: Model<ICronModel> = ApplicantSchema.getModel(
  CronSchema,
  'cronData'
);
