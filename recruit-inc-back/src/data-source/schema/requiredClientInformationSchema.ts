import { ApplicantSchema } from './applicantSchema';
import { prop, Ref, Typegoose } from 'typegoose';
import { mongoose } from 'mongoose';
import { Model, Schema } from 'mongoose';
import { iGithubUserSchema } from "./iGithubUserSchema";
import { RequiredClientInformationModel } from "../../domain/model/RequiredClientInformationModel";


export class requiredClientInformationSchema extends Typegoose implements RequiredClientInformationModel{
    @prop()
    _id?: mongoose.Types.ObjectId;

    @prop({ ref: iGithubUserSchema })
    _user: Ref<iGithubUserSchema>;

    @prop()
    _repoName: string;

    @prop()
    _repoOwner: string;

    @prop()
    _repoToken: string;

    @prop()
    _filePath: string;

    @prop()
    _commitId: string;


}

export const requiredClientInformationModel: Model<RequiredClientInformationModel> = ApplicantSchema.getModel(requiredClientInformationSchema, 'requiredClientInformation');