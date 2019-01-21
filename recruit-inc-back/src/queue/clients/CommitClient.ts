import { IGithubClient } from './IGithubClient';
import { RequiredClientInformation } from '../RequiredClientInformation';
import { GithubUserCommits } from '../../data-extraction/github/githubUserCommits';
import { FilesAffectedByQueue } from "../queues/FilesAffectedByQueue";

export class CommitClient implements IGithubClient {
  private _owner: string;
  private _repository: string;
  private _userId: string;
  private _prospect: RequiredClientInformation;

  public constructor(propsect: RequiredClientInformation) {
    this._owner = propsect.repoOwner;
    this._repository = propsect.repoName;
    this._userId = propsect.user.id;
    this._prospect = propsect;
  }

  async executeQuery() {
    let commits: GithubUserCommits = new GithubUserCommits();

    let allCommits = await commits.getCommits(
      this._repository,
      this._owner,
      this._userId
    );
    //pull the filesAffectedByQueue instance, so that we can populate its queue in this method
    let filesAffected = FilesAffectedByQueue.get_instance();

    //Loop through all commits to update RequiredClientInformation and pass to files affected queue
    for (let singleCommit of allCommits) {
      this._prospect.commitId = singleCommit.id;
      //pass the updated requiredInfo package to the filesAffectedQueue
      filesAffected.enqueue(this._prospect);
    }

    //TODO: Save to database
  }


  get owner(): string {
    return this._owner;
  }

  set owner(value: string) {
    this._owner = value;
  }

  get repository(): string {
    return this._repository;
  }

  set repository(value: string) {
    this._repository = value;
  }

  get userId(): string {
    return this._userId;
  }

  set userId(value: string) {
    this._userId = value;
  }

  get prospect(): RequiredClientInformation {
    return this._prospect;
  }

  set prospect(value: RequiredClientInformation) {
    this._prospect = value;
  }
}
