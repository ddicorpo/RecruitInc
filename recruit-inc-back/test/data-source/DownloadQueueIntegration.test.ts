import 'mocha';
import { MongoConnectionFactory } from '../../src/data-source/db-registry/mongo/MongoConnectionFactory';
import { expect } from 'chai';
import { Types } from 'mongoose';
import * as mongoose from 'mongoose';
import { IGithubUser } from '../../src/data-extraction/github/api-entities/IGithubUser';
import { RequiredClientInformation } from '../../src/queue/RequiredClientInformation';
import { DownloadClient } from '../../src/queue/clients/DownloadClient';
import { DownloadQueueModel } from '../../src/domain/model/DownloadQueueModel';
import { DownloadQueueTDG } from '../../src/data-source/table-data-gateway/downloadQueueTDG';
import { DownloadQueueFinder } from '../../src/data-source/finder/DownloadQueueFinder';
/**
 * This is a integration test for Download Queue,
 * the Queue holds an array of Queue Clients that are saved in a special table
 */
xdescribe('Integration Test => Download Queue ', () => {
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
    'jfkdsjfkdsf'
  );
  prospect.repoToken = 'fake token';

  const newDownloadClient: DownloadClient = new DownloadClient(prospect);

  const newQueue = [];
  newQueue.push(newDownloadClient);

  const newDownloadQueue: DownloadQueueModel = {
    _id: Types.ObjectId(queueId),
    queue: newQueue,
  };

  const downloadQueueTDG: DownloadQueueTDG = new DownloadQueueTDG();
  const filesQueueFinder: DownloadQueueFinder = new DownloadQueueFinder();

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

  it('Test mongo create Download queue', async () => {
    //Given: database clean and user data set
    //When
    let createdFilesQueue: DownloadQueueModel = await downloadQueueTDG.create(
      newDownloadQueue,
      queueId
    );

    //Then
    expect('nye').to.equal(newDownloadQueue.queue[0].owner);
  });

  it('Test mongo update Download queue', async () => {
    // Then
    newDownloadQueue.queue[0].owner = 'BigRob';
    let updatedUser: boolean = await downloadQueueTDG.update(
      queueId,
      newDownloadQueue
    );
    expect(updatedUser).to.be.equal(true);
  });

  it('Test mongo delete Download queue', async () => {
    // GIVEN
    let deleteSuccess: boolean = await downloadQueueTDG.delete(queueId);
    //Then
    expect(deleteSuccess).to.be.equal(true);
  });
});
