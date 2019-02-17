import { ApplicantSchema } from './applicantSchema';
import { prop, Typegoose } from 'typegoose';
import { mongoose } from 'mongoose';
import { Model, Schema } from 'mongoose';
import { CommitQueueModel } from "../../domain/model/CommitQueueModel";
import { CommitClient } from "../../queue/clients/CommitClient";



export class commitQueueSchema extends Typegoose implements CommitQueueModel{
    @prop()
    _id?: mongoose.Types.ObjectId;

    @prop()
    queue: CommitClient[];

}

export const commitQueueModel: Model<CommitQueueModel> = ApplicantSchema.getModel(commitQueueSchema, 'commitQueue');