import { BaseTDG } from './baseTDG';
import { repositoryQueueModel } from "../schema/repositoryQueueSchema";
import { Types, Model } from 'mongoose';
import { RepositoryQueueModel } from "../../domain/model/RepositoryQueueModel";

export class RepositoryQueueTDG {
    private baseTDG: BaseTDG;

    constructor() {
        this.baseTDG = new BaseTDG(repositoryQueueModel);
    }

    public create(repositoryQueueAttr: RepositoryQueueModel, id?: string): Promise<RepositoryQueueModel> {
        repositoryQueueAttr._id = null;
        if (id != null) {
            repositoryQueueAttr._id = Types.ObjectId(id);
        } else {
            repositoryQueueAttr._id = Types.ObjectId();
        }

        const newRepositoryQueueModel : Model<RepositoryQueueModel> = new repositoryQueueModel(repositoryQueueAttr);

        try {
            return this.baseTDG.create(newRepositoryQueueModel, repositoryQueueAttr);
        } catch (Exception) {
            throw new Error('Error while creating Repository queue model');
        }
    }

    public update(_id: string, updatedValue: RepositoryQueueModel): Promise<boolean> {
        try {
            const repositoryQueueModelToUpdate: Model<RepositoryQueueModel> = new repositoryQueueModel(updatedValue);
            return this.baseTDG.update(Types.ObjectId(_id), repositoryQueueModelToUpdate);
        } catch (Exception) {
            throw new Error('Error while updating repository Model');
        }
    }

    public delete(_id: string): Promise<boolean> {
        try {
            return this.baseTDG.delete(Types.ObjectId(_id));
        } catch (Exception) {
            throw new Error('Error while deleting repository Model');
        }
    }
}
