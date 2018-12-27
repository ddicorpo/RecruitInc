import 'mocha';
import { MongoConnectionFactory } from '../../src/data-source/db-registry/mongo/MongoConnectionFactory';
import { GitDataTDG } from '../../src/data-source/table-data-gateway/gitDataTDG';
import { IGitDataModel } from '../../src/domain/model/IGitDataModel';
import { Platform } from '../../src/domain/model/IGitDataModel';
import { GitDataFinder } from '../../src/data-source/finder/gitDataFinder';
import { expect, assert } from 'chai';
import { Types } from 'mongoose';
import { dataEntry } from '../matching-algo/data-model/javascript-example/GitProjectInputExample';
import { projectOutput } from '../matching-algo/data-model/javascript-example/GitProjectOutputExample';

require('dotenv').config(); //Get environment variables

describe('Test mongo GitData', () => {
  const newGitData: IGitDataModel = {
    iDataEntry: dataEntry,
    iGitProjectSummary: projectOutput,
    lastKnownInfoDate: new Date(2018, 12, 23).toString(),
    platform: Platform.Github,
  };
  let targetIdToDelete: Types.ObjectId = null;
  const gitDataTDG: GitDataTDG = new GitDataTDG();
  const gitDataFinder: GitDataFinder = new GitDataFinder();

  beforeEach(() => {
    // Establish connection
    const dbOption =
      '-shard-00-00-celgm.mongodb.net:27017,cluster0-shard-00-01-celgm.mongodb.net:27017,' +
      "'cluster0-shard-00-02-celgm.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true ";
    let myFactory: MongoConnectionFactory = new MongoConnectionFactory(
      'mongodb://',
      'admin',
      null,
      'bob',
      'cluster0',
      dbOption,
      true
    );
    // Start connection
    myFactory.getConnection();
  });

  //   after(() => {
  //   mongoose.connection.close();
  //   console.log(mongoose.connection.readyState);
  //   });

  it('Test mongo create gitData', async () => {
    let createdGitData: IGitDataModel = await gitDataTDG.create(newGitData);
    expect(newGitData.lastKnownInfoDate).to.equal(
      createdGitData.lastKnownInfoDate
    );
  });

  it('Test mongo Find By Last Known Info Date', async () => {
    await gitDataFinder
      .findByLastKnownInfoDate(newGitData.lastKnownInfoDate)
      .then(doc => {
        let gitDataFound: IGitDataModel = doc;
        console.log(gitDataFound);
        expect(newGitData.lastKnownInfoDate).to.equal(
          gitDataFound[0].lastKnownInfoDate
        );
        expect(newGitData.platform).to.equal(gitDataFound[0].platform);
      });
  });

  it('Test mongo Find By Platform', async () => {
    await gitDataFinder.findByPlatform(newGitData.platform).then(doc => {
      let gitDataFound: IGitDataModel = doc;
      targetIdToDelete = gitDataFound._id;
      console.log(gitDataFound);
      console.log(new Date(gitDataFound[0].lastKnownInfoDate));
      expect(newGitData.platform).to.equal(gitDataFound[0].platform);
    });
  });

  it('Test mongo findAll and delete', async () => {
    //Delete the gitDatas that were found
    let deleteSuccess: boolean = await gitDataTDG.delete(targetIdToDelete);
    expect(deleteSuccess).to.be.equal(true);
  });
});
