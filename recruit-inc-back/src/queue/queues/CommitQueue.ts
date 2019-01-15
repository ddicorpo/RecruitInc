import { AbstractQueue } from './AbstractQueue';
import { CommitClient } from '../clients/CommitClient';
import { RequiredClientInformation } from '../RequiredClientInformation';

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

  //TODO: implement save to db feature
  public saveToDatabase() {}
  public loadFromDatabase() {}
}
