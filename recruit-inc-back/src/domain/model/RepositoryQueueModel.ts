import { mongoose } from 'mongoose';
import { RepositoryClient } from "../../queue/clients/RepositoryClient";

export interface RepositoryQueueModel {
    _id?: mongoose.Types.ObjectId;
    queue: RepositoryClient[];
}