import { IDataEntry } from '../../matching-algo/data-model/input-model/IDataEntry';
import { IGitProjectInput } from '../../matching-algo/data-model/input-model/IGitProjectInput';
import { ApplicantSchema } from './applicantSchema';
import { prop, Typegoose } from 'typegoose';
import { mongoose } from 'mongoose';
import { Model, Schema } from 'mongoose';

export class DataEntrySchema extends Typegoose implements IDataEntry {
  @prop()
  _id?: mongoose.Types.ObjectId;

  @prop()
  projectInputs: IGitProjectInput[];
}

export const DataEntryModel: Model<IDataEntry> = ApplicantSchema.getModel(DataEntrySchema, 'dataEntry');
