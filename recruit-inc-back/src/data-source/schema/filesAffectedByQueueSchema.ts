import { ApplicantSchema } from './applicantSchema';
import { prop, Ref, Typegoose } from 'typegoose';
import { mongoose } from 'mongoose';
import { Model, Schema } from 'mongoose';
import { FilesAffectedByQueueModel } from "../../domain/model/FilesAffectedByQueueModel";
import { filesAffectedFilesClientSchema } from "./filesAffectedFilesClientSchema";


export class filesAffectedFilesQueueSchema extends Typegoose implements FilesAffectedByQueueModel{
    @prop()
    _id?: mongoose.Types.ObjectId;

    @prop({ ref: filesAffectedFilesClientSchema })
    queue: Ref<filesAffectedFilesClientSchema[]>;

}

export const filesAffectedByQueueModel: Model<FilesAffectedByQueueModel> = ApplicantSchema.getModel(filesAffectedFilesQueueSchema, 'filesAffectedByQueue');