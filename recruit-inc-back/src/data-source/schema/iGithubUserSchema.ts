import { ApplicantSchema } from './applicantSchema';
import { prop, Ref, Typegoose } from 'typegoose';
import { mongoose } from 'mongoose';
import { Model, Schema } from 'mongoose';
import { IGithubUser } from "../../data-extraction/github/api-entities/IGithubUser";
import { newDataEntrySchema } from "./newDataEntrySchema";


export class iGithubUserSchema extends Typegoose implements IGithubUser{
    @prop()
    _id?: mongoose.Types.ObjectId;

    @prop()
    login: string;

    @prop()
    id?: string; //Base64 obfuscated unique ID

    @prop()
    location?: string;

    @prop()
    languages?: {
        name: string;
    };

    @prop({ ref: newDataEntrySchema })
    dataEntry?: Ref<newDataEntrySchema[]>;

    @prop()
    email?: string;

    @prop()
    company?: string;

    @prop()
    isHireable?: boolean;

    @prop()
    url: string;

    @prop()
    websiteUrl?: string;

    @prop()
    createdAt: string;


}

export const iGithubUserModel: Model<IGithubUser> = ApplicantSchema.getModel(iGithubUserSchema, 'iGithubUser');