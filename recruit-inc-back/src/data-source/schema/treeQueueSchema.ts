import { ApplicantSchema } from './applicantSchema';
import { prop, Ref, Typegoose } from 'typegoose';
import { mongoose } from 'mongoose';
import { Model, Schema } from 'mongoose';
import { TreeQueueModel } from "../../domain/model/TreeQueueModel";
import { treeClientSchema } from "./treeClientSchema";


export class treeQueueSchema extends Typegoose implements TreeQueueModel{
    @prop()
    _id?: mongoose.Types.ObjectId;

    @prop({ ref: treeClientSchema })
    queue: Ref<treeClientSchema[]>;

}

export const treeQueueModel: Model<TreeQueueModel> = ApplicantSchema.getModel(treeQueueSchema, 'treeQueue');