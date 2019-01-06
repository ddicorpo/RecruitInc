import { prop, Ref, Typegoose } from 'typegoose';
import { IGitDataModel } from '../../domain/model/IGitDataModel';
import { Platform } from '../../domain/model/IGitDataModel';
import { DataEntrySchema } from './dataEntrySchema';
import { GitProjectSummarySchema } from './gitProjectSummarySchema';
import { ApplicantSchema } from './applicantSchema';
import { mongoose } from 'mongoose';
import { Model, Schema } from 'mongoose';

export class GitDataSchema extends Typegoose implements IGitDataModel {
  @prop()
  _id?: mongoose.Types.ObjectId;

  @prop({ ref: DataEntrySchema })
  dataEntry: Ref<DataEntrySchema>;

  @prop({ ref: GitProjectSummarySchema })
  gitProjectSummary: Ref<GitProjectSummarySchema>;

  @prop()
  lastKnownInfoDate: string;

  @prop({ required: true, enum: Platform })
  platform: Platform;
}

export const GitDataModel: Model<IGitDataModel> = ApplicantSchema.getModel(GitDataSchema, 'gitData');
