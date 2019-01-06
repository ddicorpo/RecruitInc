import 'mocha';
import { GitTDG } from '../../src/data-source/table-data-gateway/gitTDG';
import { IGitModel } from '../../src/domain/model/IGitModel';
import { Platform } from '../../src/domain/model/IGitDataModel';
import { GitFinder } from '../../src/data-source/finder/GitFinder';
import { expect } from 'chai';
import * as mongoose from 'mongoose';
import { IGitDataModel } from '../../src/domain/model/IGitDataModel';
import { MongoConnectionFactory } from '../../src/data-source/db-registry/mongo/MongoConnectionFactory';

require('dotenv').config(); //Get environment variables

xdescribe('Test mongo GitObj', () => {
  const newGitData: IGitDataModel = {
    dataEntry: {
      projectInputs: [],
    },
    gitProjectSummary: {
      totalOutput: [],
      projectsOutput: [],
    },
    lastKnownInfoDate: new Date(2018, 12, 23).toString(),
    platform: Platform.Github,
  };
  const newGitData2: IGitDataModel = {
    dataEntry: {
      projectInputs: [],
    },
    gitProjectSummary: {
      totalOutput: [],
      projectsOutput: [],
    },
    lastKnownInfoDate: new Date(2018, 10, 13).toString(),
    platform: Platform.Github,
  };
  const newGitData3: IGitDataModel = {
    dataEntry: {
      projectInputs: [],
    },
    gitProjectSummary: {
      totalOutput: [],
      projectsOutput: [],
    },
    lastKnownInfoDate: new Date(2018, 11, 17).toString(),
    platform: Platform.Gitlab,
  };

  const newGit: IGitModel = {
    IGitData: [newGitData],
    IToken: {
      platform: Platform.Github,
      AccessToken: '',
      RefreshToken: '',
      ExpiryDate: '',
    },
  };
  const newGit2: IGitModel = {
    IGitData: [newGitData2],
    IToken: {
      platform: Platform.Gitlab,
      AccessToken: '',
      RefreshToken: '',
      ExpiryDate: '',
    },
  };
  const newGit3: IGitModel = {
    IGitData: [newGitData3],
    IToken: {
      platform: Platform.Bitbucket,
      AccessToken: '',
      RefreshToken: '',
      ExpiryDate: '',
    },
  };
  const gitTDG: GitTDG = new GitTDG();
  const gitFinder: GitFinder = new GitFinder();

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

  it('Test mongo create git object', async () => {
    let createdGitobj: IGitModel = await gitTDG.create(newGit);
    expect(newGit.IToken.platform).to.equal(createdGitobj.IToken.platform);
    //Insert other gitObj
    await gitTDG.create(newGit2);
    await gitTDG.create(newGit3);
  });

  it('Test mongo findAll and then delete', async () => {
    let gitObjFound: IGitModel;
    //Find all gitObj
    await gitFinder.findAll().then(doc => {
      gitObjFound = doc;
    });
    //Delete the gitDatas that were found
    for (let i: number = 0; i < 3; i++) {
      let deleteSuccess: boolean = await gitTDG.delete(gitObjFound[i]._id);
      expect(deleteSuccess).to.be.equal(true);
    }
  });
});
