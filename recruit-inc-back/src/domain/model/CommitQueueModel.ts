import { mongoose } from 'mongoose';
import { CommitClient } from "../../queue/clients/CommitClient";

export interface CommitQueueModel {
    _id?: mongoose.Types.ObjectId;
    queue: CommitClient[];
}