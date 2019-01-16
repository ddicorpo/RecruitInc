import { mongoose } from 'mongoose';
import { RequiredClientInformation } from "../../queue/RequiredClientInformation";

export interface CommitClientModel {
    _id?: mongoose.Types.ObjectId;
    owner: string;
    repository: string;
    userId: string;
    prospect: RequiredClientInformation;
}