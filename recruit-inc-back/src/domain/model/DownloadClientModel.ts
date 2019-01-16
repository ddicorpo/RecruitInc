import { mongoose } from 'mongoose';

export interface DownloadClientModel {
    _id?: mongoose.Types.ObjectId;
    owner: string;
    repository: string;
    path: string;
}