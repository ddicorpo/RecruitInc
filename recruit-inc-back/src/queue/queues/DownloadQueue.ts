import { AbstractQueue } from './AbstractQueue';
import { DownloadClient } from '../clients/DownloadClient';
import { RequiredClientInformation } from '../RequiredClientInformation';
import { mongoose } from 'mongoose';
import { DownloadQueueTDG } from '../../data-source/table-data-gateway/downloadQueueTDG';
import { DownloadQueueModel } from '../../domain/model/DownloadQueueModel';
import { DownloadQueueFinder } from '../../data-source/finder/DownloadQueueFinder';
import { IGithubUser } from '../../data-extraction/github/api-entities/IGithubUser';
import { Types } from 'mongoose';

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
    if (this.queue) {
    } else {
      this.queue = [];
    }
    this.queue.push(download);
  }
  public dequeue() {
    return this.queue.shift();
  }

  public getUsername(): string {
    if (!this.isEmpty()) {
      return this.queue[0].login;
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

  public async processNextQuery() {
    try {
      await this.queue[0].executeQuery();
      //remove the first object from the queue
      this.dequeue();
    } catch (error) {
      throw error;
    }
  }

  public async saveToDatabase() {
    let queueID = Types.ObjectId();
    //create tdg
    let downloadQueueTDG: DownloadQueueTDG = new DownloadQueueTDG();
    let downloadFinder: DownloadQueueFinder = new DownloadQueueFinder();
    let oldDownloadQueueModel: DownloadQueueModel[] = await downloadFinder.findAll();

    if (oldDownloadQueueModel.length === 1) {
      //delete what was there before
      let deleteSuccess: boolean = await downloadQueueTDG.delete(
        oldDownloadQueueModel[0]._id
      );
    }

    let newDownloadQueueModel: DownloadQueueModel = {
      queue: this.queue,
    };

    //store download Queue in the database
    await downloadQueueTDG.create(newDownloadQueueModel);
  }
  public async loadFromDatabase() {
    //create a download queue finder
    let downloadFinder: DownloadQueueFinder = new DownloadQueueFinder();

    //Find all download queues (only 1) and load it
    let newDownloadQueueModel: DownloadQueueModel[] = await downloadFinder.findAll();

    if (newDownloadQueueModel.length === 0) return;
    //load the queue from db to this queue
    this.queue = newDownloadQueueModel[0].queue;
    for (let i: number = 0; i < this.queue.length; i++) {
      let user: IGithubUser = { login: this.queue[i].login };
      //console.log("User.login: ", user.login);
      this.queue[i] = new DownloadClient(
        new RequiredClientInformation(
          user,
          this.queue[i].repository,
          this.queue[i].owner,
          this.queue[i].path,
          null,
          null,
          null
        )
      );
    }
  }
}
