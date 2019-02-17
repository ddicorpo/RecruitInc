import { ApplicantSchema } from './applicantSchema';
import { prop, Typegoose } from 'typegoose';
import { mongoose } from 'mongoose';
import { Model, Schema } from 'mongoose';
import { RepositoryQueueModel } from "../../domain/model/RepositoryQueueModel";
import { RepositoryClient } from "../../queue/clients/RepositoryClient";



export class repositoryQueueSchema extends Typegoose implements RepositoryQueueModel{
    @prop()
    _id?: mongoose.Types.ObjectId;

    @prop()
    queue: RepositoryClient[];

}

export const repositoryQueueModel: Model<RepositoryQueueModel> = ApplicantSchema.getModel(repositoryQueueSchema, 'repositoryQueue');