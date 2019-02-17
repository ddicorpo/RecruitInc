/**
 * Typegoose is including schema and model in one class
 */
import { prop, Typegoose } from 'typegoose';
import { mongoose } from 'mongoose';
import { ApplicantSchema } from './applicantSchema';
import { Model, Schema } from 'mongoose';
import { ICronModel, Status } from '../../domain/model/ICronModel';

export class CronSchema extends Typegoose implements ICronModel {
  @prop()
  _id?: mongoose.Types.ObjectId;

  @prop({unique: true, required: true })
  location: string;

  @prop({ required: true })
  number_scanned: number;

  @prop({ required: true })
  total_number: number;

  @prop()
  cron_pattern: string;

  @prop({ required: true })
  status: Status;

  @prop()
  lastCreatedAt: string;

  @prop()
  cursor: string;
}

export const CronModel: Model<ICronModel> = ApplicantSchema.getModel(
  CronSchema,
  'cronData'
);
