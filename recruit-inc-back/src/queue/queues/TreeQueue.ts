import { AbstractQueue } from './AbstractQueue';
import { TreeClient } from '../clients/TreeClient';
import { RequiredClientInformation } from '../RequiredClientInformation';

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

  //TODO: implement save to db feature
  public saveToDatabase() {}
}
