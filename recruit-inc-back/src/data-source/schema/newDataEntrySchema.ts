import { ApplicantSchema } from './applicantSchema';
import { prop, Ref, Typegoose } from 'typegoose';
import { mongoose } from 'mongoose';
import { Model, Schema } from 'mongoose';
import { IDataEntry } from "../../matching-algo/data-model/input-model/IDataEntry";
import { iGithubProjectInputSchema } from "./iGithubProjectInputSchema";


export class newDataEntrySchema extends Typegoose implements IDataEntry{
    @prop()
    _id?: mongoose.Types.ObjectId;

    @prop({ ref: iGithubProjectInputSchema })
    projectInputs: Ref<iGithubProjectInputSchema[]>;

}

export const NewDataEntryModel: Model<IDataEntry> = ApplicantSchema.getModel(newDataEntrySchema, 'newDataEntry');