import { BaseTDG } from './baseTDG';
import { Types, Model } from 'mongoose';
import {filesAffectedByQueueModel} from "../schema/filesAffectedByQueueSchema";
import {FilesAffectedByQueueModel} from "../../domain/model/FilesAffectedByQueueModel";

export class FilesAffectedByQueueTDG {
    private baseTDG: BaseTDG;

    constructor() {
        this.baseTDG = new BaseTDG(filesAffectedByQueueModel);
    }

    public create(filesAffectedByQueueAttr: FilesAffectedByQueueModel, id?: string): Promise<FilesAffectedByQueueModel> {
        filesAffectedByQueueAttr._id = null;
        if (id != null) {
            filesAffectedByQueueAttr._id = Types.ObjectId(id);
        } else {
            filesAffectedByQueueAttr._id = Types.ObjectId();
        }

        const newfilesAffectedByQueueModel : Model<FilesAffectedByQueueModel> = new filesAffectedByQueueModel(filesAffectedByQueueAttr);

        try {
            return this.baseTDG.create(newfilesAffectedByQueueModel, filesAffectedByQueueAttr);
        } catch (Exception) {
            throw new Error('Error while creating filesAffectedByQueue queue model');
        }
    }

    public update(_id: string, updatedValue: FilesAffectedByQueueModel): Promise<boolean> {
        try {
            const filesAffectedByQueueModelToUpdate: Model<FilesAffectedByQueueModel> = new filesAffectedByQueueModel(updatedValue);
            return this.baseTDG.update(Types.ObjectId(_id), filesAffectedByQueueModelToUpdate);
        } catch (Exception) {
            throw new Error('Error while updating filesAffectedByQueue Model');
        }
    }

    public delete(_id: string): Promise<boolean> {
        try {
            return this.baseTDG.delete(Types.ObjectId(_id));
        } catch (Exception) {
            throw new Error('Error while deleting filesAffectedByQueue Model');
        }
    }
}