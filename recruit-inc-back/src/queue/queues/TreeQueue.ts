import { AbstractQueue } from './AbstractQueue';
import { TreeClient } from '../clients/TreeClient';
import { RequiredClientInformation } from '../RequiredClientInformation';
import { mongoose } from 'mongoose';
import { TreeQueueTDG } from '../../data-source/table-data-gateway/treeQueueTDG';
import { TreeQueueModel } from '../../domain/model/TreeQueueModel';
import { TreeQueueFinder } from '../../data-source/finder/TreeQueueFinder';
import { IGithubUser } from '../../data-extraction/github/api-entities/IGithubUser';
import { Types } from 'mongoose';

export class TreeQueue extends AbstractQueue {
  private queue: TreeClient[];
  private static _instance: TreeQueue;

  private constructor() {
    super();
    this.queue = [];
  }

  public static get_instance() {
    return this._instance || (this._instance = new this());
  }

  public enqueue(prospect: RequiredClientInformation) {
    let tree: TreeClient = new TreeClient(prospect);
    if (!this.queue) {
      this.queue = [];
    }
    this.queue.push(tree);
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
    if (this.queue === undefined || this.queue.length == 0) {
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
    let treeFinder: TreeQueueFinder = new TreeQueueFinder();
    let oldTreeQueueModel: TreeQueueModel[] = await treeFinder.findAll();

    //create tdg
    let treeQueueTDG: TreeQueueTDG = new TreeQueueTDG();
    if (oldTreeQueueModel.length === 1) {
      //delete what was there before
      let deleteSuccess: boolean = await treeQueueTDG.delete(
        oldTreeQueueModel[0]._id
      );
    }

    let newTreeQueueModel: TreeQueueModel = {
      queue: this.queue,
    };

    //store tree Queue in the database
    await treeQueueTDG.create(newTreeQueueModel);
  }
  public async loadFromDatabase() {
    //create a tree queue finder
    let treeFinder: TreeQueueFinder = new TreeQueueFinder();

    //Find all tree queues (only 1) and load it
    let newTreeQueueModel: TreeQueueModel[] = await treeFinder.findAll();

    if (newTreeQueueModel.length === 0) return; //no tree queue in database -> stop here
    //load the queue from db to this queue
    this.queue = newTreeQueueModel[0].queue;
    for (let i: number = 0; i < this.queue.length; i++) {
      let user: IGithubUser = this.queue[i].prospect.user; //untested
      //console.log("User.login: ", user.login);
      this.queue[i] = new TreeClient(
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
