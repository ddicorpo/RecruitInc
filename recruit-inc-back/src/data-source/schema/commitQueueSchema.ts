import { ApplicantSchema } from './applicantSchema';
import { prop, Ref, Typegoose } from 'typegoose';
import { mongoose } from 'mongoose';
import { Model, Schema } from 'mongoose';
import { CommitQueueModel } from "../../domain/model/CommitQueueModel";
import { commitClientSchema } from "./commitClientSchema";


export class commitQueueSchema extends Typegoose implements CommitQueueModel{
    @prop()
    _id?: mongoose.Types.ObjectId;

    @prop({ ref: commitClientSchema })
    queue: Ref<commitClientSchema[]>;

}

export const commitQueueModel: Model<CommitQueueModel> = ApplicantSchema.getModel(commitQueueSchema, 'commitQueue');