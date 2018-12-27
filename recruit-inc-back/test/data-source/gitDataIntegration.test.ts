import 'mocha';
import { MongoConnectionFactory } from '../../src/data-source/db-registry/mongo/MongoConnectionFactory';
import { GitDataTDG } from '../../src/data-source/table-data-gateway/gitDataTDG';
import { IGitDataModel } from '../../src/domain/model/IGitDataModel';
import { Platform } from '../../src/domain/model/IGitDataModel';
import { GitDataFinder } from '../../src/data-source/finder/gitDataFinder';
import { IGitProjectInput } from '../../src/matching-algo/data-model/input-model/IGitProjectInput';
import { DataEntrySchema } from '../../src/data-source/schema/dataEntrySchema';
import { IDataEntry } from '../../src/matching-algo/data-model/input-model/IDataEntry';
import { expect, assert } from 'chai';
import { Types } from 'mongoose';
import * as mongoose from 'mongoose';

require('dotenv').config(); //Get environment variables


describe.only('Test mongo GitData', () => {
    const newDataEntry: IDataEntry = {
        projectInputs: []
    }
    const newDataEntry2: IDataEntry = {
        projectInputs: []
    }
    const newDataEntry3: IDataEntry = {
        projectInputs: []
    }
    const newGitData: IGitDataModel = {
        dataEntry: newDataEntry,
        iGitProjectSummary: {
            totalOutput: [],
            projectsOutput: []
        },
        lastKnownInfoDate: new Date(2018, 12, 23).toString() ,
        platform: Platform.Github,
    }
    //newGitData.dataEntry._id = mongoose.Types.ObjectId;
    const newGitData2: IGitDataModel = {
        dataEntry: newDataEntry2,
        iGitProjectSummary: {
            totalOutput: [],
            projectsOutput: []
        },
        lastKnownInfoDate: new Date(2018, 10, 13).toString() ,
        platform: Platform.Github,
    }
    //newGitData2.dataEntry.projectInputs = [];
    //newGitData.dataEntry._id = mongoose.Types.ObjectId;
    const newGitData3: IGitDataModel = {
        dataEntry: newDataEntry3,
        iGitProjectSummary: {
            totalOutput: [],
            projectsOutput: []
        },
        lastKnownInfoDate: new Date(2018, 11, 17).toString() ,
        platform: Platform.Gitlab,
    }
    //newGitData3.dataEntry.projectInputs = [];
    //newGitData.dataEntry._id = mongoose.Types.ObjectId;
    const gitDataTDG: GitDataTDG = new GitDataTDG();
    const gitDataFinder: GitDataFinder = new GitDataFinder();

  before(function (done){
  mongoose.connect(`${process.env.DB_HOST}/${process.env.DB_NAME}`, {useNewUrlParser: true}); //Connect to database
  const db = mongoose.connection;

  db.on('error', console.error.bind(console, 'connection error'));

  db.once('open', function(){
      console.log('We are connected to the database');
      done();
  });

  });
    

  after(() => {
  mongoose.connection.close();
  console.log(mongoose.connection.readyState);
  });


  it('Test mongo create gitData', async () => {
    let createdGitData: IGitDataModel = await gitDataTDG.create(newGitData);
    expect(newGitData.lastKnownInfoDate).to.equal(createdGitData.lastKnownInfoDate);
    //Insert other gitDatas
    await gitDataTDG.create(newGitData2);
    await gitDataTDG.create(newGitData3);
    });

  xit('Test mongo Find By Last Known Info Date', async () => {
    await gitDataFinder.findByLastKnownInfoDate(newGitData.lastKnownInfoDate).then(doc => {
      let gitDataFound: IGitDataModel = doc;
      console.log(gitDataFound);
      expect(newGitData.lastKnownInfoDate).to.equal(gitDataFound[0].lastKnownInfoDate);
      expect(newGitData.platform).to.equal(gitDataFound[0].platform);
    });
  });

  xit('Test mongo Find By Platform', async () => {
    await gitDataFinder.findByPlatform(newGitData3.platform).then(doc => {
      let gitDataFound: IGitDataModel = doc;
      console.log(gitDataFound);
      expect(newGitData3.platform).to.equal(gitDataFound[0].platform);
      expect(newGitData3.lastKnownInfoDate).to.equal(gitDataFound[0].lastKnownInfoDate);
      console.log(new Date(gitDataFound[0].lastKnownInfoDate));
    });
  });


  xit('Test mongo findAll and delete', async () => {
      let gitDatasFound: IGitDataModel;
      //Find all gitDatas
    await gitDataFinder.findAll().then(doc => {
      gitDatasFound = doc;
      
    });
    //Delete the gitDatas that were found
      for (let i: number = 0; i < 3; i++){
        let deleteSuccess: boolean = await gitDataTDG.delete(gitDatasFound[i]._id);
        expect(deleteSuccess).to.be.equal(true);
      }
  });
});
