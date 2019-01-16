import { ApplicantSchema } from './applicantSchema';
import { prop, Typegoose } from 'typegoose';
import { mongoose } from 'mongoose';
import { Model, Schema } from 'mongoose';
import { IProjectStructure } from "../../matching-algo/data-model/input-model/IProjectStructure";

export class iProjectStructureSchema extends Typegoose implements IProjectStructure {
    @prop()
    _id?: mongoose.Types.ObjectId;

    @prop()
    fileId: string;

    @prop()
    fileName: string;

    @prop()
    filePath: string;

}

export const iProjectStructureModel: Model<IProjectStructure> = ApplicantSchema.getModel(iProjectStructureSchema, 'iProjectStructure');