import { AbstractQueue } from './AbstractQueue';
import { FilesAffectedByClient } from '../clients/FilesAffectedByClient';
import { RequiredClientInformation } from '../RequiredClientInformation';
import { mongoose } from 'mongoose';
import { FilesAffectedByQueueTDG } from "../../data-source/table-data-gateway/filesAffectedByQueueTDG";
import { FilesAffectedByQueueModel } from "../../domain/model/FilesAffectedByQueueModel";
import { FilesAffectedByQueueFinder } from "../../data-source/finder/FilesAffectedByQueueFinder";
import { IGithubUser } from "../../data-extraction/github/api-entities/IGithubUser";
import { Types } from 'mongoose';

export class FilesAffectedByQueue extends AbstractQueue {
  private queue: FilesAffectedByClient[];
  private static _instance: FilesAffectedByQueue;

  private constructor() {
    super();
    this.queue = [];
  }

  public static get_instance() {
    return this._instance || (this._instance = new this());
  }

  public enqueue(prospect: RequiredClientInformation) {
    let filesAffected: FilesAffectedByClient = new FilesAffectedByClient(
      prospect
    );
    if (this.queue){
    }else{
        this.queue = [];
    }

    this.queue.push(filesAffected);
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
    catch(error) {
        throw error;
    }  }

  public async saveToDatabase() {

    let queueID = Types.ObjectId();

    //create tdg
    let filesQueueTDG: FilesAffectedByQueueTDG = new FilesAffectedByQueueTDG();
    let filesFinder: FilesAffectedByQueueFinder = new FilesAffectedByQueueFinder();
    let oldFilesQueueModel: FilesAffectedByQueueModel[] = await filesFinder.findAll();

    if (oldFilesQueueModel.length === 1){
    //delete what was there before
    let deleteSuccess: boolean = await filesQueueTDG.delete(oldFilesQueueModel[0]._id);
    }

    let newFilesQueueModel: FilesAffectedByQueueModel = {
      queue: this.queue,
    };

    //store files affected by Queue in the database
    await filesQueueTDG.create(newFilesQueueModel);

  }
  public async loadFromDatabase() {
    //create a files affected by queue finder
    let filesFinder: FilesAffectedByQueueFinder = new FilesAffectedByQueueFinder();

    //Find all files affected by queues (only 1) and load it
    let newFilesQueueModel: FilesAffectedByQueueModel[] = await filesFinder.findAll();

    if (newFilesQueueModel.length === 0)
        return; //When nothing is in the database don't set this.queue
    //load the queue from db to this queue
    this.queue = newFilesQueueModel[0].queue;
    //Fixes TypeError: this.queue[0].executeQuery is not a function
    for (let i: number = 0; i < this.queue.length; i++){
        let user: IGithubUser = {login: this.queue[i].login};
        //console.log("User.login: ", user.login);
        this.queue[i] = new FilesAffectedByClient(new RequiredClientInformation(user, this.queue[i].repository, this.queue[i].owner, null, this.queue[i].commitId, null, null));
    }

  }
}
