import { mongoose } from 'mongoose';
import { FilesAffectedByClient } from "../../queue/clients/FilesAffectedByClient";

export interface FilesAffectedByQueueModel {
    _id?: mongoose.Types.ObjectId;
    queue: FilesAffectedByClient[];
}