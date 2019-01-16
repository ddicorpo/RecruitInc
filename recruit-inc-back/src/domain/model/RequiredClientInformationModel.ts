import { IGithubUser} from "../../data-extraction/github/api-entities/IGithubUser";
import { mongoose } from 'mongoose';

export interface RequiredClientInformationModel {
    _id?: mongoose.Types.ObjectId;
    _user: IGithubUser;
    _repoName: string;
    _repoOwner: string;
    _repoToken: string;
    _filePath: string;
    _commitId: string;
}