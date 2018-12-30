import { IDataEntry } from '../../matching-algo/data-model/input-model/IDataEntry';
import { IGitProjectInput } from '../../matching-algo/data-model/input-model/IGitProjectInput';
import { prop, Typegoose } from 'typegoose';
import { mongoose } from 'mongoose';

export class DataEntrySchema extends Typegoose implements IDataEntry {
  @prop()
  _id?: mongoose.Types.ObjectId;

  @prop()
  projectInputs: IGitProjectInput[];
}

export const DataEntryModel = new DataEntrySchema().getModelForClass(
  DataEntrySchema,
  {
    schemaOptions: { collection: 'dataEntry' },
  }
);
