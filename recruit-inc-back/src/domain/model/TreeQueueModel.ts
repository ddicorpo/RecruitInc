import { mongoose } from 'mongoose';
import { TreeClient } from "../../queue/clients/TreeClient";

export interface TreeQueueModel {
    _id?: mongoose.Types.ObjectId;
    queue: TreeClient[];
}