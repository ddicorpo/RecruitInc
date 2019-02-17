import { mongoose } from 'mongoose';
import { DownloadClient } from "../../queue/clients/DownloadClient";


export interface DownloadQueueModel {
    _id?: mongoose.Types.ObjectId;
    queue: DownloadClient[];
}