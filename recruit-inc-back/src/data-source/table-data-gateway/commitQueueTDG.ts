import { BaseTDG } from './baseTDG';
import { Types, Model } from 'mongoose';
import { commitQueueModel } from "../schema/commitQueueSchema";
import { CommitQueueModel } from "../../domain/model/CommitQueueModel";

export class commitQueueTDG {
    private baseTDG: BaseTDG;

    constructor() {
        this.baseTDG = new BaseTDG(commitQueueModel);
    }

    public create(commitQueueAttr: CommitQueueModel, id?: string): Promise<CommitQueueModel> {
        commitQueueAttr._id = null;
        if (id != null) {
            commitQueueAttr._id = Types.ObjectId(id);
        } else {
            commitQueueAttr._id = Types.ObjectId();
        }

        const newCommitQueueModel : Model<CommitQueueModel> = new commitQueueModel(commitQueueAttr);

        try {
            return this.baseTDG.create(newCommitQueueModel, commitQueueAttr);
        } catch (Exception) {
            throw new Error('Error while creating Commit queue model');
        }
    }

    public update(_id: string, updatedValue: CommitQueueModel): Promise<boolean> {
        try {
            const commitQueueModelToUpdate: Model<CommitQueueModel> = new commitQueueModel(updatedValue);
            return this.baseTDG.update(Types.ObjectId(_id), commitQueueModelToUpdate);
        } catch (Exception) {
            throw new Error('Error while updating Commit Model');
        }
    }

    public delete(_id: string): Promise<boolean> {
        try {
            return this.baseTDG.delete(Types.ObjectId(_id));
        } catch (Exception) {
            throw new Error('Error while deleting Commit Model');
        }
    }
}
