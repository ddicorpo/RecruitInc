import { BaseFinder } from './BaseFinder';
import { Types } from 'mongoose';
import { treeQueueModel } from "../schema/treeQueueSchema";
import { TreeQueueModel } from "../../domain/model/TreeQueueModel";


/**
 * Inspired by: https://github.com/gsi-manuel/ts-nodejs-express-webpack/blob/master/src/services/province.service.ts
 * This class will be used to find/find all and other find User object
 * The class is using BaseFinder to do transaction allowing uniform transaction handling
 * and logging
 * *************************************************************
 * NOTE: This class doesn't include logic it's only transaction
 * *************************************************************
 */
export class TreeQueueFinder {
    private baseFinder: BaseFinder = new BaseFinder(treeQueueModel);
    /**
     * Getting all tree queues
     */
    public findAll(): Promise<TreeQueueModel> {
        return this.baseFinder.findAll();
    }

    //TODO: Add needed method in a close future, e.g. FindByUsername
}
