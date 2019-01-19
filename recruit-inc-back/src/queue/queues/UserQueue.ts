import { AbstractQueue } from './AbstractQueue';
import { RequiredClientInformation } from '../RequiredClientInformation';
import { UserClient } from "../clients/UserClient";

export class UserQueue extends AbstractQueue {
    private queue: UserClient[];
    private static _instance: UserQueue;

    public constructor() {
        super();
        this.queue = [];
    }

    public static get_instance() {
        return this._instance || (this._instance = new this());
    }

    public enqueue(prospect: RequiredClientInformation) {
        let userFinder: UserClient  = new UserClient(prospect);

        this.queue.push(userFinder);
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