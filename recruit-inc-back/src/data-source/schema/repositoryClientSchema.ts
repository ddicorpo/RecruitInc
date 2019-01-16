import { ApplicantSchema } from './applicantSchema';
import { prop, Ref, Typegoose } from 'typegoose';
import { mongoose } from 'mongoose';
import { Model, Schema } from 'mongoose';
import { requiredClientInformationSchema } from "./requiredClientInformationSchema";
import { RepositoryClientModel } from "../../domain/model/RepositoryClientModel";


export class repositoryClientSchema extends Typegoose implements RepositoryClientModel{
    @prop()
    _id?: mongoose.Types.ObjectId;

    @prop()
    accessToken: string;

    @prop()
    username: string;

    @prop({ ref: requiredClientInformationSchema })
    prospect: Ref<requiredClientInformationSchema>;

}

export const repositoryClientModel: Model<RepositoryClientModel> = ApplicantSchema.getModel(repositoryClientSchema, 'repositoryClient');