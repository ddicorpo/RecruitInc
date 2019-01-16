import { ApplicantSchema } from './applicantSchema';
import { prop, Ref, Typegoose } from 'typegoose';
import { mongoose } from 'mongoose';
import { Model, Schema } from 'mongoose';
import { ICommit } from "../../matching-algo/data-model/input-model/ICommit";
import { iSingleFileCommitSchema } from "./iSingleFileCommitSchema";


export class iCommitSchema extends Typegoose implements ICommit{
    @prop()
    _id?: mongoose.Types.ObjectId;

    @prop()
    id: string;

    @prop()
    numberOfFileAffected: number;

    @prop({ ref: iSingleFileCommitSchema })
    files: Ref<iSingleFileCommitSchema[]>;
}

export const ICommitModel: Model<ICommit> = ApplicantSchema.getModel(iCommitSchema, 'iCommit');