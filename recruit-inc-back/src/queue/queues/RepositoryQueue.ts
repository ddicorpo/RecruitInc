import { AbstractQueue } from './AbstractQueue';
import { RepositoryClient } from '../clients/RepositoryClient';
import { mongoose } from 'mongoose';
import { RequiredClientInformation } from '../RequiredClientInformation';
import { RepositoryQueueTDG } from "../../data-source/table-data-gateway/repositoryQueueTDG";
import { RepositoryQueueModel } from "../../domain/model/RepositoryQueueModel";
import { MongoConnectionFactory } from "../../data-source/db-registry/mongo/MongoConnectionFactory";
import { RepositoryQueueFinder } from "../../data-source/finder/RepositoryQueueFinder";

export class RepositoryQueue extends AbstractQueue {
  private queue: RepositoryClient[];
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

    this.queue.push(repo);
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

  public processNextQuery() {
    try {
      this.queue[0].executeQuery();
      //remove the first object from the queue
      this.dequeue();
    }
      catch(e) {
    }
  }

  public async saveToDatabase() {

    // Establish connection
    let myFactory: MongoConnectionFactory = new MongoConnectionFactory();
    myFactory.defaultInitialization();
    // Start connection
    myFactory.getConnection();

    let queueID = "repoQueueID"

    //create tdg
    let repoQueueTDG: RepositoryQueueTDG = new RepositoryQueueTDG();

    //delete what was there before
    let deleteSuccess: boolean = await repoQueueTDG.delete(queueID);

    let newRepositoryQueueModel: RepositoryQueueModel = {
      _id: queueID,
      queue: this.queue,
    };

    //store repository Queue in the database
    await repoQueueTDG.create(newRepositoryQueueModel, queueID);

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
    let repoFinder: RepositoryQueueFinder = new RepositoryQueueFinder();
    //Find all repo queues (only 1) and load it
    let newRepositoryQueueModel: RepositoryQueueModel = await repoFinder.findAll();
    //load the queue from db to this queue
    this.queue = newRepositoryQueueModel.queue;

    //close connection to db
    mongoose.connection.close();

  }
}
