import { mongoose } from 'mongoose';
import { DownloadClientModel } from "./DownloadClientModel";

export interface DownloadQueueModel {
    _id?: mongoose.Types.ObjectId;
    queue: DownloadClientModel[];
}