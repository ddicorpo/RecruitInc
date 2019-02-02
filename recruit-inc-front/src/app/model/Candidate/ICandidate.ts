import { IProjectSummary } from './IProjectSummary';
import {IGitProjectInput} from "./IGitProjectInput";
export interface ICandidate {
  isFilter: boolean;
  username: string;
  profileLink: string;
  userType: string;
  email?: string;
  projectSummary: IProjectSummary;
  projectInputs : IGitProjectInput[];
}
