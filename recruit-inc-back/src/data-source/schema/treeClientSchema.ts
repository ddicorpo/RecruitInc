import { ApplicantSchema } from './applicantSchema';
import { prop, Ref, Typegoose } from 'typegoose';
import { mongoose } from 'mongoose';
import { Model, Schema } from 'mongoose';
import { requiredClientInformationSchema } from "./requiredClientInformationSchema";
import { TreeClientModel } from "../../domain/model/TreeClientModel";


export class treeClientSchema extends Typegoose implements TreeClientModel{
    @prop()
    _id?: mongoose.Types.ObjectId;

    @prop()
    owner: string;

    @prop()
    repository: string;

    @prop({ ref: requiredClientInformationSchema })
    prospect: Ref<requiredClientInformationSchema>;

}

export const treeClientModel: Model<TreeClientModel> = ApplicantSchema.getModel(treeClientSchema, 'treeClient');