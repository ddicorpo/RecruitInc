import { AbstractQueue } from './AbstractQueue';
import { FilesAffectedByClient } from '../clients/FilesAffectedByClient';
import { RequiredClientInformation } from '../RequiredClientInformation';

export class FillesAffectedByQueue extends AbstractQueue {
  private queue: FilesAffectedByClient[];
  private static _instance: FillesAffectedByQueue;

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
