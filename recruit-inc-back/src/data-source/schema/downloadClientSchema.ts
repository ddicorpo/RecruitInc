import { ApplicantSchema } from './applicantSchema';
import { prop, Typegoose } from 'typegoose';
import { mongoose } from 'mongoose';
import { Model, Schema } from 'mongoose';
import { DownloadClientModel } from "../../domain/model/DownloadClientModel";


export class downloadClientSchema extends Typegoose implements DownloadClientModel{
    @prop()
    _id?: mongoose.Types.ObjectId;

    @prop()
    owner: string;

    @prop()
    repository: string;

    @prop()
    path: string;

}

export const downloadClientModel: Model<DownloadClientModel> = ApplicantSchema.getModel(downloadClientSchema, 'downloadClient');