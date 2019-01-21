import 'mocha';
import { MongoConnectionFactory } from '../../src/data-source/db-registry/mongo/MongoConnectionFactory';
import { expect } from 'chai';
import { Types } from 'mongoose';
import * as mongoose from 'mongoose';
import { IGithubUser } from "../../src/data-extraction/github/api-entities/IGithubUser";
import { RequiredClientInformation } from "../../src/queue/RequiredClientInformation";
import { FilesAffectedByClient } from "../../src/queue/clients/FilesAffectedByClient";
import { FilesAffectedByQueueTDG } from "../../src/data-source/table-data-gateway/filesAffectedByQueueTDG";
import { FilesAffectedByQueueFinder } from "../../src/data-source/finder/FilesAffectedByQueueFinder";
import { FilesAffectedByQueueModel } from "../../src/domain/model/FilesAffectedByQueueModel";
/**
 * This is a integration test for filesAffectedBy Queue,
 * the Queue holds an array of Queue Clients that are saved in a special table
 */
xdescribe('Integration Test => filesAffectedBy Queue ', () => {
    const queueId: string = '5c1fb0fd4cb3ae14244028d3';

    const newUser: IGithubUser = {
        login: "bill nye",
        createdAt: '',
        url: '',
        email: '',
    };

    const prospect: RequiredClientInformation = new RequiredClientInformation(newUser,"bill", "nye", "the", "science", "guy");
    prospect.repoToken = "fake token";

    const newFilesClient: FilesAffectedByClient = new FilesAffectedByClient(prospect);

    const newQueue = [];
    newQueue.push(newFilesClient);

    const newFilesQueue: FilesAffectedByQueueModel = {
        _id: Types.ObjectId(queueId),
        queue: newQueue,
    };

    const filesQueueTDG: FilesAffectedByQueueTDG = new FilesAffectedByQueueTDG();
    const filesQueueFinder: FilesAffectedByQueueFinder = new FilesAffectedByQueueFinder();

    before(() => {
        // Establish connection
        let myFactory: MongoConnectionFactory = new MongoConnectionFactory();
        myFactory.defaultInitialization();
        // Start connection
        myFactory.getConnection();
    });

    after(() => {
        mongoose.connection.close();
    });

    it('Test mongo create filesAffectedBy queue', async () => {
        //Given: database clean and user data set
        //When
        let createdFilesQueue: FilesAffectedByQueueModel = await filesQueueTDG.create(newFilesQueue, queueId);

        //Then
        expect("nye").to.equal(newFilesQueue.queue[0].owner);
    });

    it('Test mongo update filesAffectedBy queue', async () => {
        // Then
        newFilesQueue.queue[0].owner = 'BigRob';
        let updatedUser: boolean = await filesQueueTDG.update(queueId, newFilesQueue);
        expect(updatedUser).to.be.equal(true);
    });

    it('Test mongo delete filesAffectedBy queue', async () => {
        // GIVEN
        let deleteSuccess: boolean = await filesQueueTDG.delete(queueId);
        //Then
        expect(deleteSuccess).to.be.equal(true);
    });
});
