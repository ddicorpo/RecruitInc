import { IGithubClient } from './IGithubClient';
import { RequiredClientInformation } from '../RequiredClientInformation';
import { GithubRepoStructure } from '../../data-extraction/github/githubRepoStructure';

export class TreeClient implements IGithubClient {
  private owner: string;
  private repository: string;

  public constructor(prospect: RequiredClientInformation) {
    this.owner = prospect.repoOwner;
    this.repository = prospect.repoName;
  }

  executeQuery() {
    let repoStructure: GithubRepoStructure = new GithubRepoStructure();

    repoStructure.getRepoStructure(this.owner, this.repository);

    //TODO: Save to database
    //TODO: Populate the downloads queue
  }
}
