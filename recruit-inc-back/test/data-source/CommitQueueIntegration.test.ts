import 'mocha';
import { MongoConnectionFactory } from '../../src/data-source/db-registry/mongo/MongoConnectionFactory';
import { expect } from 'chai';
import { Types } from 'mongoose';
import * as mongoose from 'mongoose';
import { IGithubUser } from '../../src/data-extraction/github/api-entities/IGithubUser';
import { RequiredClientInformation } from '../../src/queue/RequiredClientInformation';
import { CommitClient } from '../../src/queue/clients/CommitClient';
import { CommitQueueModel } from '../../src/domain/model/CommitQueueModel';
import { CommitQueueTDG } from '../../src/data-source/table-data-gateway/commitQueueTDG';
import { CommitQueueFinder } from '../../src/data-source/finder/CommitQueueFinder';
/**
 * This is a integration test for Commit Queue,
 * the Queue holds an array of Queue Clients that are saved in a special table
 */
xdescribe('Integration Test => Commit Queue ', () => {
  const queueId: string = '5c1fb0fd4cb3ae14244028d3';

  const newUser: IGithubUser = {
    login: 'bill nye',
    createdAt: '',
    url: '',
    email: '',
  };

  const prospect: RequiredClientInformation = new RequiredClientInformation(
    newUser,
    'bill',
    'nye',
    'the',
    'science',
    'guy',
    'projectUrl'
  );
  prospect.repoToken = 'fake token';

  const newCommitClient: CommitClient = new CommitClient(prospect);

  const newQueue = [];
  newQueue.push(newCommitClient);

  const newCommitQueue: CommitQueueModel = {
    _id: Types.ObjectId(queueId),
    queue: newQueue,
  };

  const commitQueueTDG: CommitQueueTDG = new CommitQueueTDG();
  const commitQueueFinder: CommitQueueFinder = new CommitQueueFinder();

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

  it('Test mongo create commit queue', async () => {
    //Given: database clean and user data set
    //When
    let createdCommitQueue: CommitQueueModel = await commitQueueTDG.create(
      newCommitQueue,
      queueId
    );

    //Then
    expect('bill nye').to.equal(newCommitQueue.queue[0].prospect.user.login);
  });

  it('Test mongo update commit queue', async () => {
    // Then
    newCommitQueue.queue[0].prospect.user.login = 'BigRob';
    let updatedUser: boolean = await commitQueueTDG.update(
      queueId,
      newCommitQueue
    );
    expect(updatedUser).to.be.equal(true);
  });

  it('Test mongo delete commit queue', async () => {
    // GIVEN
    let deleteSuccess: boolean = await commitQueueTDG.delete(queueId);
    //Then
    expect(deleteSuccess).to.be.equal(true);
  });
});
