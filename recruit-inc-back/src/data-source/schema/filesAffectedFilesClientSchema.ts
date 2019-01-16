import { ApplicantSchema } from './applicantSchema';
import { prop, Typegoose } from 'typegoose';
import { mongoose } from 'mongoose';
import { Model, Schema } from 'mongoose';
import { FilesAffectedByModel } from "../../domain/model/FilesAffectedByModel";


export class filesAffectedFilesClientSchema extends Typegoose implements FilesAffectedByModel{
    @prop()
    _id?: mongoose.Types.ObjectId;

    @prop()
    owner: string;

    @prop()
    repository: string;

    @prop()
    commitId: string;

}

export const filesAffectedByClientModel: Model<FilesAffectedByModel> = ApplicantSchema.getModel(filesAffectedFilesClientSchema, 'filesAffectedByClient');