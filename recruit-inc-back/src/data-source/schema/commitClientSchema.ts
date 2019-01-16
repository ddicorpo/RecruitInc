import { ApplicantSchema } from './applicantSchema';
import { prop, Ref, Typegoose } from 'typegoose';
import { mongoose } from 'mongoose';
import { Model, Schema } from 'mongoose';
import { CommitClientModel } from "../../domain/model/CommitClientModel";
import { requiredClientInformationSchema } from "./requiredClientInformationSchema";


export class commitClientSchema extends Typegoose implements CommitClientModel{
    @prop()
    _id?: mongoose.Types.ObjectId;

    @prop()
    owner: string;

    @prop()
    repository: string;

    @prop()
    userId: string;

    @prop({ ref: requiredClientInformationSchema })
    prospect: Ref<requiredClientInformationSchema>;

}

export const commitClientModel: Model<CommitClientModel> = ApplicantSchema.getModel(commitClientSchema, 'commitClient');