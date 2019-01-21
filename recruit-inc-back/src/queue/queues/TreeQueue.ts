import { AbstractQueue } from './AbstractQueue';
import { TreeClient } from '../clients/TreeClient';
import { RequiredClientInformation } from '../RequiredClientInformation';
import { mongoose } from 'mongoose';
import {MongoConnectionFactory} from "../../data-source/db-registry/mongo/MongoConnectionFactory";
import { TreeQueueTDG } from "../../data-source/table-data-gateway/treeQueueTDG";
import { TreeQueueModel } from "../../domain/model/TreeQueueModel";
import { TreeQueueFinder } from "../../data-source/finder/TreeQueueFinder";

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
    this.queue.push(tree);
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

    let queueID = "treeQueueID";

    //create tdg
    let treeQueueTDG: TreeQueueTDG = new TreeQueueTDG();

    //delete what was there before
    let deleteSuccess: boolean = await treeQueueTDG.delete(queueID);

    let newTreeQueueModel: TreeQueueModel = {
      _id: queueID,
      queue: this.queue,
    };

    //store repository Queue in the database
    await treeQueueTDG.create(newTreeQueueModel, queueID);

    //close connection to db
    mongoose.connection.close();
  }
  public async loadFromDatabase() {

    // Establish connection
    let myFactory: MongoConnectionFactory = new MongoConnectionFactory();
    myFactory.defaultInitialization();

    // Start connection
    myFactory.getConnection();

    //create a repo queue finder
    let treeFinder: TreeQueueFinder = new TreeQueueFinder();

    //Find all tree queues (only 1) and load it
    let newTreeQueueModel: TreeQueueModel = await treeFinder.findAll();

    //load the queue from db to this queue
    this.queue = newTreeQueueModel.queue;

    //close connection to db
    mongoose.connection.close();

  }
}
