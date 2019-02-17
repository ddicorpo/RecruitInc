import { ApplicantSchema } from './applicantSchema';
import { prop, Typegoose } from 'typegoose';
import { mongoose } from 'mongoose';
import { Model, Schema } from 'mongoose';
import { FilesAffectedByQueueModel } from "../../domain/model/FilesAffectedByQueueModel";
import { FilesAffectedByClient } from "../../queue/clients/FilesAffectedByClient";



export class filesAffectedFilesQueueSchema extends Typegoose implements FilesAffectedByQueueModel{
    @prop()
    _id?: mongoose.Types.ObjectId;

    @prop()
    queue: FilesAffectedByClient[];

}

export const filesAffectedByQueueModel: Model<FilesAffectedByQueueModel> = ApplicantSchema.getModel(filesAffectedFilesQueueSchema, 'filesAffectedByQueue');