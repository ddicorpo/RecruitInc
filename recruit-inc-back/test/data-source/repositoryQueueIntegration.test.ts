import 'mocha';
import { MongoConnectionFactory } from '../../src/data-source/db-registry/mongo/MongoConnectionFactory';
import { expect } from 'chai';
import { RepositoryQueueModel } from "../../src/domain/model/RepositoryQueueModel";
import { RepositoryQueueTDG } from "../../src/data-source/table-data-gateway/repositoryQueueTDG";
import { Types } from 'mongoose';
import * as mongoose from 'mongoose';
import { RepositoryClient } from "../../src/queue/clients/RepositoryClient";
import { IGithubUser } from "../../src/data-extraction/github/api-entities/IGithubUser";
import { RequiredClientInformation } from "../../src/queue/RequiredClientInformation";
import { RepositoryQueueFinder } from "../../src/data-source/finder/RepositoryQueueFinder";
/**
 * This is a integration test for Repository Queue,
 * the Queue holds an array of Queue Clients that are saved in a special table
 */
describe.only('Integration Test => Repository Queue ', () => {
    const queueId: string = '5c1fb0fd4cb3ae14244028d3';

    const newUser: IGithubUser = {
        login: "bill nye",
        createdAt: '',
        url: '',
        email: '',
    };

    const prospect: RequiredClientInformation = new RequiredClientInformation(newUser,"bill", "nye", "the", "science", "guy");
    prospect.repoToken = "fake token";

    const newRepoClient: RepositoryClient = new RepositoryClient(prospect);

    const newQueue = [];
    newQueue.push(newRepoClient);

    const newRepoQueue: RepositoryQueueModel = {
        _id: Types.ObjectId(queueId),
        queue: newQueue,
    };

    const repoQueueTDG: RepositoryQueueTDG = new RepositoryQueueTDG();
    const repoQueueFinder: RepositoryQueueFinder = new RepositoryQueueFinder();

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

    it('Test mongo create HR user', async () => {
        //Given: database clean and user data set
        //When
        let createdRepoQueue: RepositoryQueueModel = await repoQueueTDG.create(newRepoQueue, queueId);

        //Then
        expect("bill nye").to.equal(newRepoQueue.queue[0].prospect.user.login);
    });

    it('Test mongo update HR', async () => {
        // Then
        newRepoQueue.queue[0].prospect.user.login = 'BigRob';
        let updatedUser: boolean = await repoQueueTDG.update(queueId, newRepoQueue);
        expect(updatedUser).to.be.equal(true);
    });

    it('Test mongo delete User: HR delete user', async () => {
        // GIVEN
        let deleteSuccess: boolean = await repoQueueTDG.delete(queueId);
        //Then
        expect(deleteSuccess).to.be.equal(true);
    });
});
