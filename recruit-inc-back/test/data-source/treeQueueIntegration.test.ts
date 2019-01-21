import 'mocha';
import { MongoConnectionFactory } from '../../src/data-source/db-registry/mongo/MongoConnectionFactory';
import { expect } from 'chai';
import { Types } from 'mongoose';
import * as mongoose from 'mongoose';
import { IGithubUser } from "../../src/data-extraction/github/api-entities/IGithubUser";
import { RequiredClientInformation } from "../../src/queue/RequiredClientInformation";
import { TreeClient } from "../../src/queue/clients/TreeClient";
import { TreeQueueModel } from "../../src/domain/model/TreeQueueModel";
import { TreeQueueTDG } from "../../src/data-source/table-data-gateway/treeQueueTDG";
import { TreeQueueFinder } from "../../src/data-source/finder/TreeQueueFinder";
/**
 * This is a integration test for Tree Queue,
 * the Queue holds an array of Queue Clients that are saved in a special table
 */
xdescribe('Integration Test => Tree Queue ', () => {
    const queueId: string = '5c1fb0fd4cb3ae14244028d3';

    const newUser: IGithubUser = {
        login: "bill nye",
        createdAt: '',
        url: '',
        email: '',
    };

    const prospect: RequiredClientInformation = new RequiredClientInformation(newUser,"bill", "nye", "the", "science", "guy");
    prospect.repoToken = "fake token";

    const newTreeClient: TreeClient = new TreeClient(prospect);

    const newQueue = [];
    newQueue.push(newTreeClient);

    const newTreeQueue: TreeQueueModel = {
        _id: Types.ObjectId(queueId),
        queue: newQueue,
    };

    const treeQueueTDG: TreeQueueTDG = new TreeQueueTDG();
    const treeQueueFinder: TreeQueueFinder = new TreeQueueFinder();

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

    it('Test mongo create Tree Queue', async () => {
        //Given: database clean and user data set
        //When
        let createdTreeQueue: TreeQueueModel = await treeQueueTDG.create(newTreeQueue, queueId);

        //Then
        expect("bill nye").to.equal(newTreeQueue.queue[0].prospect.user.login);
    });

    it('Test mongo update Tree Queue', async () => {
        // Then
        newTreeQueue.queue[0].prospect.user.login = 'BigRob';
        let updatedUser: boolean = await treeQueueTDG.update(queueId, newTreeQueue);
        expect(updatedUser).to.be.equal(true);
    });

    it('Test mongo delete Tree Queue', async () => {
        // GIVEN
        let deleteSuccess: boolean = await treeQueueTDG.delete(queueId);
        //Then
        expect(deleteSuccess).to.be.equal(true);
    });
});
