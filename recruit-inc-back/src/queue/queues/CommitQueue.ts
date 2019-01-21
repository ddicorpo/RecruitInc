import { AbstractQueue } from './AbstractQueue';
import { CommitClient } from '../clients/CommitClient';
import { RequiredClientInformation } from '../RequiredClientInformation';
import { mongoose } from 'mongoose';
import { MongoConnectionFactory } from "../../data-source/db-registry/mongo/MongoConnectionFactory";
import { CommitQueueTDG } from "../../data-source/table-data-gateway/commitQueueTDG";
import { CommitQueueModel } from "../../domain/model/CommitQueueModel";
import { CommitQueueFinder } from "../../data-source/finder/CommitQueueFinder";

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

    this.queue.push(commit);
  }
  public dequeue() {
    return this.queue.pop();
  }

  public isEmpty() {
    return this.queue == [];
  }

  public size() {
    return this.queue.length;
  }

  public processNextQuery(): any {
    this.dequeue().executeQuery();
  }

  public async saveToDatabase() {

    // Establish connection
    let myFactory: MongoConnectionFactory = new MongoConnectionFactory();
    myFactory.defaultInitialization();
    // Start connection
    myFactory.getConnection();

    let queueID = "commitQueueID";

    //create tdg
    let commitQueueTDG: CommitQueueTDG = new CommitQueueTDG();

    //delete what was there before
    let deleteSuccess: boolean = await commitQueueTDG.delete(queueID);

    let newCommitQueueModel: CommitQueueModel = {
      _id: queueID,
      queue: this.queue,
    };

    //store commit Queue in the database
    await commitQueueTDG.create(newCommitQueueModel, queueID);

    //close connection to db
    mongoose.connection.close();
  }
  public async loadFromDatabase() {

    // Establish connection
    let myFactory: MongoConnectionFactory = new MongoConnectionFactory();
    myFactory.defaultInitialization();

    // Start connection
    myFactory.getConnection();

    //create a commit queue finder
    let commitFinder: CommitQueueFinder = new CommitQueueFinder();

    //Find all commit queues (only 1) and load it
    let newCommitQueueModel: CommitQueueModel = await commitFinder.findAll();

    //load the queue from db to this queue
    this.queue = newCommitQueueModel.queue;

    //close connection to db
    mongoose.connection.close();

  }
}
