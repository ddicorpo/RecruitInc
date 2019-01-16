import { ApplicantSchema } from './applicantSchema';
import { prop, Ref, Typegoose } from 'typegoose';
import { mongoose } from 'mongoose';
import { Model, Schema } from 'mongoose';
import { DownloadQueueModel } from "../../domain/model/DownloadQueueModel";
import { downloadClientSchema } from "./downloadClientSchema";


export class downloadQueueSchema extends Typegoose implements DownloadQueueModel{
    @prop()
    _id?: mongoose.Types.ObjectId;

    @prop({ ref: downloadClientSchema })
    queue: Ref<downloadClientSchema[]>;

}

export const downloadQueueModel: Model<DownloadQueueModel> = ApplicantSchema.getModel(downloadQueueSchema, 'downloadQueue');