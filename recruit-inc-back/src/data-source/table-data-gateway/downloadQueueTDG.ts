import { BaseTDG } from './baseTDG';
import { Types, Model } from 'mongoose';
import { downloadQueueModel } from "../schema/downloadQueueSchema";
import { DownloadQueueModel } from "../../domain/model/DownloadQueueModel";

export class downloadQueueTDG {
    private baseTDG: BaseTDG;

    constructor() {
        this.baseTDG = new BaseTDG(downloadQueueModel);
    }

    public create(downloadQueueAttr: DownloadQueueModel, id?: string): Promise<DownloadQueueModel> {
        downloadQueueAttr._id = null;
        if (id != null) {
            downloadQueueAttr._id = Types.ObjectId(id);
        } else {
            downloadQueueAttr._id = Types.ObjectId();
        }

        const newDownloadQueueModel : Model<DownloadQueueModel> = new downloadQueueModel(downloadQueueAttr);

        try {
            return this.baseTDG.create(newDownloadQueueModel, downloadQueueAttr);
        } catch (Exception) {
            throw new Error('Error while creating download queue model');
        }
    }

    public update(_id: string, updatedValue: DownloadQueueModel): Promise<boolean> {
        try {
            const downloadQueueModelToUpdate: Model<DownloadQueueModel> = new downloadQueueModel(updatedValue);
            return this.baseTDG.update(Types.ObjectId(_id), downloadQueueModelToUpdate);
        } catch (Exception) {
            throw new Error('Error while updating download Model');
        }
    }

    public delete(_id: string): Promise<boolean> {
        try {
            return this.baseTDG.delete(Types.ObjectId(_id));
        } catch (Exception) {
            throw new Error('Error while deleting download Model');
        }
    }
}