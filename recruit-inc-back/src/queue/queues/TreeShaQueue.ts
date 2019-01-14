import { AbstractQueue } from './AbstractQueue';
import {TreeShaClient} from "../clients/TreeShaClient";

export class TreeShaQueue extends AbstractQueue {
    private queue: TreeShaClient[];
    private  static _instance: TreeShaQueue;
    private constructor(){
        super();
        this.queue = [];
    };
    public static get_instance(){
        return this._instance || (this._instance = new this());
    }

    public enqueue(treeSha: TreeShaClient) {
        this.queue.push(treeSha);
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
