import { ApplicantSchema } from './applicantSchema';
import { prop, Typegoose } from 'typegoose';
import { mongoose } from 'mongoose';
import { Model, Schema } from 'mongoose';
import { ISourceFiles } from "../../matching-algo/data-model/input-model/ISourceFiles";

export class iSourceFilesSchema extends Typegoose implements ISourceFiles {
    @prop()
    _id?: mongoose.Types.ObjectId;

    @prop()
    filename: string;

    @prop()
    repoFilePath: string;

    @prop()
    localFilePath: string;

}

export const iSourceFilesModel: Model<ISourceFiles> = ApplicantSchema.getModel(iSourceFilesSchema, 'iSourceFiles');