import { AbstractQueue } from './AbstractQueue';
import { CommitClient } from '../clients/CommitClient';
import { RequiredClientInformation } from '../RequiredClientInformation';
import { mongoose } from 'mongoose';
import { CommitQueueTDG } from '../../data-source/table-data-gateway/commitQueueTDG';
import { CommitQueueModel } from '../../domain/model/CommitQueueModel';
import { CommitQueueFinder } from '../../data-source/finder/CommitQueueFinder';
import { IGithubUser } from '../../data-extraction/github/api-entities/IGithubUser';
import { Types } from 'mongoose';

export class CommitQueue extends AbstractQueue {
  private queue: CommitClient[];
  private static _instance: CommitQueue;

  public constructor() {
    super();
    this.queue = [];
  }

  public static get_instance() {
    return this._instance || (this._instance = new this());
  }

  public enqueue(prospect: RequiredClientInformation) {
    let commit: CommitClient = new CommitClient(prospect);
    if (this.queue) {
    } else {
      this.queue = [];
    }

    this.queue.push(commit);
  }
  public dequeue() {
    return this.queue.shift();
  }

  public getUsername(): string {
    if (!this.isEmpty()) {
      return this.queue[0].prospect.user.login;
    } else {
      return '';
    }
  }

  public isEmpty() {
    if (this.queue === undefined || this.queue.length === 0) {
      return true;
    }
    return false;
  }

  public size() {
    return this.queue.length;
  }

  public async processNextQuery(token: string) {
    try {
      await this.queue[0].executeQuery(token);
      //remove the first object from the queue
      this.dequeue();
    } catch (error) {
      throw error;
    }
  }

  public async saveToDatabase() {
    let queueID = Types.ObjectId();

    //create tdg
    let commitQueueTDG: CommitQueueTDG = new CommitQueueTDG();
    let commitFinder: CommitQueueFinder = new CommitQueueFinder();
    let oldCommitQueueModel: CommitQueueModel[] = await commitFinder.findAll();

    if (oldCommitQueueModel.length === 1) {
      //delete what was there before
      let deleteSuccess: boolean = await commitQueueTDG.delete(
        oldCommitQueueModel[0]._id
      );
    }

    let newCommitQueueModel: CommitQueueModel = {
      queue: this.queue,
    };

    //store commit Queue in the database
    await commitQueueTDG.create(newCommitQueueModel);
  }
  public async loadFromDatabase() {
    //create a commit queue finder
    let commitFinder: CommitQueueFinder = new CommitQueueFinder();

    //Find all commit queues (only 1) and load it
    let newCommitQueueModel: CommitQueueModel[] = await commitFinder.findAll();

    if (newCommitQueueModel.length === 0) return;
    //load the queue from db to this queue
    this.queue = newCommitQueueModel[0].queue;
    //Fixes TypeError: this.queue[0].executeQuery is not a function
    for (let i: number = 0; i < this.queue.length; i++) {
      let user: IGithubUser = this.queue[i].prospect.user; //untested
      //console.log("User.login: ", user.login);
      this.queue[i] = new CommitClient(
        new RequiredClientInformation(
          user,
          this.queue[i].repository,
          this.queue[i].owner,
          null,
          null,
          null,
          this.queue[i].projectUrl
        )
      );
    }
  }
}
