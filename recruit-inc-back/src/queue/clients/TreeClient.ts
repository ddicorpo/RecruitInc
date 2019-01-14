import { IGithubClient } from './IGithubClient';
import { IGithubUser } from '../../data-extraction/github/api-entities/IGithubUser';
import { RequiredClientInformation } from '../RequiredClientInformation';

export class TreeClient implements IGithubClient {
  private owner: string;
  private repository: string;
  private treeSha: string;

  public constructor(prospect: RequiredClientInformation) {
    this.owner = prospect.repoOwner;
    this.repository = prospect.repoName;
    this.treeSha = prospect.treeSha;
  }

  executeQuery() {}
}
