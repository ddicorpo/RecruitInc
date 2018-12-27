import { prop, Ref, Typegoose } from 'typegoose';
import { IGitDataModel } from '../../domain/model/IGitDataModel';
import { Platform } from '../../domain/model/IGitDataModel';
import { DataEntrySchema } from './dataEntrySchema'
import { IDataEntry } from '../../matching-algo/data-model/input-model/IDataEntry';
import { IGitProjectSummary } from '../../matching-algo/data-model/output-model/IGitProjectSummary'
import { mongoose } from 'mongoose';


export class GitDataSchema extends Typegoose implements IGitDataModel {
  @prop()
  _id?: mongoose.Types.ObjectId;

  @prop({ ref: DataEntrySchema })
  dataEntry: Ref<DataEntrySchema>;
//  @prop()
//  iDataEntry: IDataEntry;

  @prop()
  iGitProjectSummary: IGitProjectSummary;

  @prop()
  lastKnownInfoDate: string;

  @prop({ required: true, enum: Platform })
  platform: Platform;

}

export const GitDataModel = new GitDataSchema().getModelForClass(GitDataSchema, {
  schemaOptions: { collection: 'gitData' },
});
