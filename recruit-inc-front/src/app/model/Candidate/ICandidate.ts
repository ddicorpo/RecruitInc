import { IProjectSummary } from './IProjectSummary';
export interface ICandidate {
  isFilter: boolean;
  username: string;
  profileLink: string;
  userType: string;
  email?: string;
  ProjectSummary: IProjectSummary;
}
