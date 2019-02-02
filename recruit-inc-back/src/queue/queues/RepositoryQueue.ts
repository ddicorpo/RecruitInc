import { AbstractQueue } from './AbstractQueue';
import { RepositoryClient } from '../clients/RepositoryClient';
import { mongoose } from 'mongoose';
import { RequiredClientInformation } from '../RequiredClientInformation';
import { RepositoryQueueTDG } from "../../data-source/table-data-gateway/repositoryQueueTDG";
import { RepositoryQueueModel } from "../../domain/model/RepositoryQueueModel";
import { RepositoryQueueFinder } from "../../data-source/finder/RepositoryQueueFinder";
import { Types } from 'mongoose';

export class RepositoryQueue extends AbstractQueue {
  public queue: RepositoryClient[];
  private static _instance: RepositoryQueue;

  private constructor() {
    super();
    this.queue = [];
  }

  public static get_instance() {
    return this._instance || (this._instance = new this());
  }

  public enqueue(prospect: RequiredClientInformation) {
    let repo: RepositoryClient = new RepositoryClient(prospect);

    if (this.queue){
    }else{
        this.queue = [];
    }
    this.queue.push(repo);
  }

  public dequeue() {
    return this.queue.shift();
  }

  public isEmpty() {
    if(this.queue === undefined || this.queue.length == 0){
      return true;
    }
    return false;
  }

  public size() {
    return this.queue.length;
  }

  public processNextQuery() {
    try {
      this.queue[0].executeQuery();
      //remove the first object from the queue
      this.dequeue();
    }
      catch(e) {
          //console.log("processNextQuery error: ", e);
    }
  }

  public async saveToDatabase() {

    let queueID = Types.ObjectId();
    let repoFinder: RepositoryQueueFinder = new RepositoryQueueFinder();
    let oldRepositoryQueueModel: RepositoryQueueModel[] = await repoFinder.findAll();

    let repoQueueTDG: RepositoryQueueTDG = new RepositoryQueueTDG();
    if (oldRepositoryQueueModel.length === 1){
    //create tdg
    //delete what was there before
    let deleteSuccess: boolean = await repoQueueTDG.delete(oldRepositoryQueueModel[0]._id);
    }

    let newRepositoryQueueModel: RepositoryQueueModel = {
      queue: this.queue,
    };

    //store repository Queue in the database
    await repoQueueTDG.create(newRepositoryQueueModel);

  }

  public async loadFromDatabase() {

    //create a repo queue finder
    let repoFinder: RepositoryQueueFinder = new RepositoryQueueFinder();
    //Find all repo queues (only 1) and load it
    //findAll returns an array
    let newRepositoryQueueModel: RepositoryQueueModel[] = await repoFinder.findAll();
    //load the queue from db to this queue
    //console.log("newRepositoryQueueModel: ", newRepositoryQueueModel);
    if (newRepositoryQueueModel.length === 0)
        return; //When nothing is in the database don't set this.queue
    this.queue = newRepositoryQueueModel[0].queue;

  }
}
