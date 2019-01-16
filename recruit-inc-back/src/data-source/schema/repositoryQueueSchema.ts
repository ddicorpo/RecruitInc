import { ApplicantSchema } from './applicantSchema';
import { prop, Ref, Typegoose } from 'typegoose';
import { mongoose } from 'mongoose';
import { Model, Schema } from 'mongoose';
import { RepositoryQueueModel } from "../../domain/model/RepositoryQueueModel";
import { repositoryClientSchema } from "./repositoryClientSchema";


export class repositoryQueueSchema extends Typegoose implements RepositoryQueueModel{
    @prop()
    _id?: mongoose.Types.ObjectId;

    @prop({ ref: repositoryClientSchema})
    queue: Ref<repositoryClientSchema[]>;

}

export const repositoryQueueModel: Model<RepositoryQueueModel> = ApplicantSchema.getModel(repositoryQueueSchema, 'repositoryQueue');