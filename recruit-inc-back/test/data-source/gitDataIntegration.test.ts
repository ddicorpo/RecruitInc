import 'mocha';
import { MongoConnectionFactory } from '../../src/data-source/db-registry/mongo/MongoConnectionFactory';
import { GitDataTDG } from '../../src/data-source/table-data-gateway/gitDataTDG';
import { DataEntryTDG } from '../../src/data-source/table-data-gateway/dataEntryTDG';
import { GitProjectSummaryTDG } from '../../src/data-source/table-data-gateway/gitProjectSummaryTDG';
import { IGitDataModel } from '../../src/domain/model/IGitDataModel';
import { Platform } from '../../src/domain/model/IGitDataModel';
import { GitDataFinder } from '../../src/data-source/finder/gitDataFinder';
import { IDataEntry } from '../../src/matching-algo/data-model/input-model/IDataEntry';
import { IGitProjectSummary } from '../../src/matching-algo/data-model/output-model/IGitProjectSummary';
import { expect } from 'chai';
import * as mongoose from 'mongoose';

require('dotenv').config(); //Get environment variables

xdescribe('Test mongo GitData', () => {
  const newDataEntry: IDataEntry = {
    projectInputs: [],
  };
  const newDataEntry2: IDataEntry = {
    projectInputs: [],
  };
  const newDataEntry3: IDataEntry = {
    projectInputs: [],
  };
  const newGitProjectSummary: IGitProjectSummary = {
    totalOutput: [],
    projectsOutput: [],
  };
  const newGitProjectSummary2: IGitProjectSummary = {
    totalOutput: [],
    projectsOutput: [],
  };
  const newGitProjectSummary3: IGitProjectSummary = {
    totalOutput: [],
    projectsOutput: [],
  };
  const newGitData: IGitDataModel = {
    dataEntry: newDataEntry,
    gitProjectSummary: newGitProjectSummary,
    lastKnownInfoDate: new Date(2018, 12, 23).toString(),
    platform: Platform.Github,
  };

  const newGitData2: IGitDataModel = {
    dataEntry: newDataEntry2,
    gitProjectSummary: newGitProjectSummary,
    lastKnownInfoDate: new Date(2018, 10, 13).toString(),
    platform: Platform.Github,
  };

  const newGitData3: IGitDataModel = {
    dataEntry: newDataEntry3,
    gitProjectSummary: newGitProjectSummary,
    lastKnownInfoDate: new Date(2018, 11, 17).toString(),
    platform: Platform.Gitlab,
  };

  const dataEntryTDG: DataEntryTDG = new DataEntryTDG();
  const gitProjectSummaryTDG: GitProjectSummaryTDG = new GitProjectSummaryTDG();
  const gitDataTDG: GitDataTDG = new GitDataTDG();
  const gitDataFinder: GitDataFinder = new GitDataFinder();

  before(() => {
    // Establish connection
    let myFactory: MongoConnectionFactory = new MongoConnectionFactory();
    myFactory.defaultInitialization();
    // Start connection
    myFactory.getConnection();
  });

  after(() => {
    mongoose.connection.close();
    console.log(mongoose.connection.readyState);
  });

  it('Test mongo create gitData', async () => {
    await dataEntryTDG.create(newDataEntry, '5c25533e11ad520c5f2a13d4');
    await dataEntryTDG.create(newDataEntry2, '5c25533e11ad520c5f2a13d5');
    await dataEntryTDG.create(newDataEntry3, '5c25533e11ad520c5f2a13d6');
    await gitProjectSummaryTDG.create(
      newGitProjectSummary,
      '5c2570a175692a0944090430'
    );
    await gitProjectSummaryTDG.create(
      newGitProjectSummary2,
      '5c2570a175692a0944090431'
    );
    await gitProjectSummaryTDG.create(
      newGitProjectSummary3,
      '5c2570a175692a0944090432'
    );
    let createdGitData: IGitDataModel = await gitDataTDG.create(newGitData);
    expect(newGitData.lastKnownInfoDate).to.equal(
      createdGitData.lastKnownInfoDate
    );
    //Insert other gitDatas
    await gitDataTDG.create(newGitData2);
    await gitDataTDG.create(newGitData3);
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
      console.log(gitDataFound);
      console.log(new Date(gitDataFound[0].lastKnownInfoDate));
      expect(newGitData.platform).to.equal(gitDataFound[0].platform);
    });
  });

  it('Test mongo findAll and delete', async () => {
    let gitDatasFound: IGitDataModel;
    let deleteSuccess: boolean;
    //Find all gitDatas
    await gitDataFinder.findAll().then(doc => {
      gitDatasFound = doc;
    });
    //Delete the gitDatas that were found
    for (let i: number = 0; i < 3; i++) {
      deleteSuccess = await gitDataTDG.delete(gitDatasFound[i]._id);
      expect(deleteSuccess).to.be.equal(true);
    }
    //Delete the dataEntry entries
    await dataEntryTDG.delete('5c25533e11ad520c5f2a13d4');
    await dataEntryTDG.delete('5c25533e11ad520c5f2a13d5');
    await dataEntryTDG.delete('5c25533e11ad520c5f2a13d6');
    await gitProjectSummaryTDG.delete('5c2570a175692a0944090430');
    await gitProjectSummaryTDG.delete('5c2570a175692a0944090431');
    await gitProjectSummaryTDG.delete('5c2570a175692a0944090432');
  });
});
