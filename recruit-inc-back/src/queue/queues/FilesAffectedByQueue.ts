import { AbstractQueue } from './AbstractQueue';
import { FilesAffectedByClient } from '../clients/FilesAffectedByClient';
import { RequiredClientInformation } from '../RequiredClientInformation';
import { mongoose } from 'mongoose';
import { MongoConnectionFactory } from "../../data-source/db-registry/mongo/MongoConnectionFactory";
import { FilesAffectedByQueueTDG } from "../../data-source/table-data-gateway/filesAffectedByQueueTDG";
import { FilesAffectedByQueueModel } from "../../domain/model/FilesAffectedByQueueModel";
import { FilesAffectedByQueueFinder } from "../../data-source/finder/FilesAffectedByQueueFinder";

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

    this.queue.push(filesAffected);
  }

  public dequeue() {
    return this.queue.shift();
  }

  public isEmpty() {
    return this.queue == [];
  }

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

    // Establish connection
    let myFactory: MongoConnectionFactory = new MongoConnectionFactory();
    myFactory.defaultInitialization();
    // Start connection
    myFactory.getConnection();

    let queueID = "filesQueueID";

    //create tdg
    let filesQueueTDG: FilesAffectedByQueueTDG = new FilesAffectedByQueueTDG();

    //delete what was there before
    let deleteSuccess: boolean = await filesQueueTDG.delete(queueID);

    let newFilesQueueModel: FilesAffectedByQueueModel = {
      _id: queueID,
      queue: this.queue,
    };

    //store files affected by Queue in the database
    await filesQueueTDG.create(newFilesQueueModel, queueID);

    //close connection to db
    mongoose.connection.close();
  }
  public async loadFromDatabase() {

    // Establish connection
    let myFactory: MongoConnectionFactory = new MongoConnectionFactory();
    myFactory.defaultInitialization();

    // Start connection
    myFactory.getConnection();

    //create a files affected by queue finder
    let filesFinder: FilesAffectedByQueueFinder = new FilesAffectedByQueueFinder();

    //Find all files affected by queues (only 1) and load it
    let newFilesQueueModel: FilesAffectedByQueueModel = await filesFinder.findAll();

    //load the queue from db to this queue
    this.queue = newFilesQueueModel.queue;

    //close connection to db
    mongoose.connection.close();

  }
}
