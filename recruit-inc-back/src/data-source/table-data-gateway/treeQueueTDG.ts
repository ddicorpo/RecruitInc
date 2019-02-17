import { BaseTDG } from './baseTDG';
import { Types, Model } from 'mongoose';
import { treeQueueModel } from "../schema/treeQueueSchema";
import { TreeQueueModel } from "../../domain/model/TreeQueueModel";

export class TreeQueueTDG {
    private baseTDG: BaseTDG;

    constructor() {
        this.baseTDG = new BaseTDG(treeQueueModel);
    }

    public create(treeQueueAttr: TreeQueueModel, id?: string): Promise<TreeQueueModel> {
        treeQueueAttr._id = null;
        if (id != null) {
            treeQueueAttr._id = Types.ObjectId(id);
        } else {
            treeQueueAttr._id = Types.ObjectId();
        }

        const newTreeQueueModel : Model<TreeQueueModel> = new treeQueueModel(treeQueueAttr);

        try {
            return this.baseTDG.create(newTreeQueueModel, treeQueueAttr);
        } catch (Exception) {
            throw new Error('Error while creating tree queue model');
        }
    }

    public update(_id: string, updatedValue: TreeQueueModel): Promise<boolean> {
        try {
            const treeQueueModelToUpdate: Model<TreeQueueModel> = new treeQueueModel(updatedValue);
            return this.baseTDG.update(Types.ObjectId(_id), treeQueueModelToUpdate);
        } catch (Exception) {
            throw new Error('Error while updating tree Model');
        }
    }

    public delete(_id: string): Promise<boolean> {
        try {
            return this.baseTDG.delete(Types.ObjectId(_id));
        } catch (Exception) {
            throw new Error('Error while deleting tree Model');
        }
    }
}