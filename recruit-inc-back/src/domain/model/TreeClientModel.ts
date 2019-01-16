import { mongoose } from 'mongoose';
import { RequiredClientInformation } from "../../queue/RequiredClientInformation";

export interface TreeClientModel {
    _id?: mongoose.Types.ObjectId;
    owner: string;
    repository: string;
    prospect: RequiredClientInformation;
}