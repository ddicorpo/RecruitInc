import { AbstractQueue } from './AbstractQueue';
import {DownloadClient} from "../clients/DownloadClient";

export class DownloadQueue extends AbstractQueue {
    private queue: DownloadClient[];
    private  static _instance: DownloadQueue;
    private constructor(){
        super();
        this.queue = [];
    };
    public static get_instance(){
        return this._instance || (this._instance = new this());
    }

    public enqueue(download: DownloadClient) {
        this.queue.push(download);
    }
    public dequeue() {return this.queue.pop();
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
