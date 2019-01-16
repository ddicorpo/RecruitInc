import { mongoose } from 'mongoose';

export interface FilesAffectedByModel {
    _id?: mongoose.Types.ObjectId;
    owner: string;
    repository: string;
    commitId: string;
}