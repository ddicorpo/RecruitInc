import { ApplicantSchema } from './applicantSchema';
import { prop, Typegoose } from 'typegoose';
import { mongoose } from 'mongoose';
import { Model, Schema } from 'mongoose';
import { TreeQueueModel } from "../../domain/model/TreeQueueModel";
import {TreeClient} from "../../queue/clients/TreeClient";



export class treeQueueSchema extends Typegoose implements TreeQueueModel{
    @prop()
    _id?: mongoose.Types.ObjectId;

    @prop()
    queue: TreeClient[];

}

export const treeQueueModel: Model<TreeQueueModel> = ApplicantSchema.getModel(treeQueueSchema, 'treeQueue');