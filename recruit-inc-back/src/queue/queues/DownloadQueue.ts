import { AbstractQueue } from './AbstractQueue';
import { DownloadClient } from '../clients/DownloadClient';
import { RequiredClientInformation } from '../RequiredClientInformation';
import { mongoose } from 'mongoose';
import { DownloadQueueTDG } from "../../data-source/table-data-gateway/downloadQueueTDG";
import { DownloadQueueModel } from "../../domain/model/DownloadQueueModel";
import { DownloadQueueFinder } from "../../data-source/finder/DownloadQueueFinder";

export class DownloadQueue extends AbstractQueue {
  private queue: DownloadClient[];
  private static _instance: DownloadQueue;

  private constructor() {
    super();
    this.queue = [];
  }

  public static get_instance() {
    return this._instance || (this._instance = new this());
  }

  public enqueue(prospect: RequiredClientInformation) {
    let download: DownloadClient = new DownloadClient(prospect);
    if (this.queue){
    }else{
        this.queue = [];
    }
    this.queue.push(download);
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

  public processNextQuery(): any {
    try {
      this.queue[0].executeQuery();
      //remove the first object from the queue
      this.dequeue();
    }
    catch(e) {
    }  }

  public async saveToDatabase() {

    let queueID = "downloadQueueID";

    //create tdg
    let downloadQueueTDG: DownloadQueueTDG = new DownloadQueueTDG();

    //delete what was there before
    let deleteSuccess: boolean = await downloadQueueTDG.delete(queueID);

    let newDownloadQueueModel: DownloadQueueModel = {
      _id: queueID,
      queue: this.queue,
    };

    //store download Queue in the database
    await downloadQueueTDG.create(newDownloadQueueModel, queueID);

  }
  public async loadFromDatabase() {

    //create a download queue finder
    let downloadFinder: DownloadQueueFinder = new DownloadQueueFinder();

    //Find all download queues (only 1) and load it
    let newDownloadQueueModel: DownloadQueueModel = await downloadFinder.findAll();

    //load the queue from db to this queue
    this.queue = newDownloadQueueModel.queue;

  }
}
