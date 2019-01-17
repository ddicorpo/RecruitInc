import { ApplicantSchema } from './applicantSchema';
import { prop, Typegoose } from 'typegoose';
import { mongoose } from 'mongoose';
import { Model, Schema } from 'mongoose';
import { DownloadQueueModel } from "../../domain/model/DownloadQueueModel";
import { DownloadClient } from "../../queue/clients/DownloadClient";



export class downloadQueueSchema extends Typegoose implements DownloadQueueModel{
    @prop()
    _id?: mongoose.Types.ObjectId;

    @prop()
    queue: DownloadClient[];

}

export const downloadQueueModel: Model<DownloadQueueModel> = ApplicantSchema.getModel(downloadQueueSchema, 'downloadQueue');