import { ApplicantSchema } from './applicantSchema';
import { prop, Typegoose } from 'typegoose';
import { mongoose } from 'mongoose';
import { Model, Schema } from 'mongoose';
import { ISingleFileCommit } from "../../matching-algo/data-model/input-model/ISingleFileCommit";


export class iSingleFileCommitSchema extends Typegoose implements ISingleFileCommit {
    @prop()
    _id?: mongoose.Types.ObjectId;

    @prop()
    filePath: string;

    @prop()
    lineAdded: number;

    @prop()
    lineDeleted: number;

}

export const iSingleFileCommitModel: Model<ISingleFileCommit> = ApplicantSchema.getModel(iSingleFileCommitSchema, 'iSingleFileCommit');