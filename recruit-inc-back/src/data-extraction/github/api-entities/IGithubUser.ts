import { IDataEntry } from '../../../matching-algo/data-model/input-model/IDataEntry';
import { IGithubProjectInput } from '../../../matching-algo/data-model/input-model/IGithubProjectInput';
import { IGitProjectSummary } from '../../../matching-algo/data-model/output-model/IGitProjectSummary';

export interface IGithubUser {
  login: string;
  id?: string; //Base64 obfuscated unique ID
  location?: string;
  languages?: {
    name: string;
  };
  dataEntry?: {
    projectInputs: IGithubProjectInput[];
  };
  projectSummary?: IGitProjectSummary;
  email?: string;
  company?: string;
  isHireable?: boolean;
  url?: string;
  websiteUrl?: string;
  createdAt?: string;
  cursor?: string; //used for pagination
}
