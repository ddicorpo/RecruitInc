import { AbstractQueue } from './AbstractQueue';
import { CommitClient } from '../clients/CommitClient';
import { RequiredClientInformation } from '../RequiredClientInformation';
import { mongoose } from 'mongoose';
import { CommitQueueTDG } from "../../data-source/table-data-gateway/commitQueueTDG";
import { CommitQueueModel } from "../../domain/model/CommitQueueModel";
import { CommitQueueFinder } from "../../data-source/finder/CommitQueueFinder";
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
    if (this.queue){
    }else{
        this.queue = [];
    }

    this.queue.push(commit);
  }
  public dequeue() {
    return this.queue.shift();
  }

  public isEmpty() {
    if(this.queue === undefined || this.queue.length == 0){
      return true;
    }
    return false;  }

  public size() {
    return this.queue.length;
  }

  public async processNextQuery() {
    try {
      await this.queue[0].executeQuery();
      //remove the first object from the queue
      this.dequeue();
    }
    catch(e) {
    }
  }

  public async saveToDatabase() {

    let queueID = Types.ObjectId();

    //create tdg
    let commitQueueTDG: CommitQueueTDG = new CommitQueueTDG();
    let commitFinder: CommitQueueFinder = new CommitQueueFinder();
    let oldCommitQueueModel: CommitQueueModel[] = await commitFinder.findAll();

    if (oldCommitQueueModel.length === 1){
    //delete what was there before
    let deleteSuccess: boolean = await commitQueueTDG.delete(oldCommitQueueModel[0]._id);
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

    if (newCommitQueueModel.length === 0)
        return;
    //load the queue from db to this queue
    this.queue = newCommitQueueModel[0].queue;


  }
}
