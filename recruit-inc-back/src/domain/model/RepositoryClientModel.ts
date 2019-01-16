import { mongoose } from 'mongoose';
import { RequiredClientInformation } from "../../queue/RequiredClientInformation";

export interface RepositoryClientModel {
    _id?: mongoose.Types.ObjectId;
    accessToken: string;
    username: string;
    prospect: RequiredClientInformation;
}