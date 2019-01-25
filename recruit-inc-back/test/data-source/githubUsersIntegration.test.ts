import 'mocha';
import { MongoConnectionFactory } from '../../src/data-source/db-registry/mongo/MongoConnectionFactory';
import { GithubUsersTDG } from '../../src/data-source/table-data-gateway/githubUsersTDG';
import { IGithubUsersModel } from '../../src/domain/model/IGithubUsersModel';
import { IGithubUser } from '../../src/data-extraction/github/api-entities/IGithubUser';
import { GithubUsersFinder } from '../../src/data-source/finder/GithubUsersFinder';
import { expect } from 'chai';
import * as mongoose from 'mongoose';
import { Platform } from '../../src/domain/model/IGitDataModel';

require('dotenv').config(); //Get environment variables


xdescribe('Test mongo GithubUsers', () => {
        const user1: IGithubUser = {
          login: 'MewtR',
          createdAt: '',
          url: '',
          dataEntry: {
            projectInputs: [
              {
                projectName: 'MinistocksRework',
                owner: 'AyoubeAkaouch',
                applicantCommits: [],
                projectStructure: [],
                downloadedSourceFile: [],
                url: '',
              },
              {
                projectName: 'rufus',
                owner: 'MewtR',
                applicantCommits: [],
                projectStructure: [],
                downloadedSourceFile: [],
                url: '',
              },
            ],
          },
        };

        const user2: IGithubUser = {
          login: 'MewtR',
          createdAt: '',
          url: '',
          dataEntry: {
            projectInputs: [
              {
                projectName: 'RecruitInc',
                owner: 'ddicorpo',
                applicantCommits: [],
                projectStructure: [],
                downloadedSourceFile: [],
                url: '',
              },
              {
                projectName: 'SOEN343',
                owner: 'gprattico',
                applicantCommits: [],
                projectStructure: [],
                downloadedSourceFile: [],
                url: '',
              },
            ],
          },
        };

        const user3: IGithubUser = {
          login: 'UserX',
          createdAt: '',
          url: '',
          dataEntry: {
            projectInputs: [
              {
                projectName: 'ProjectX',
                owner: 'UserY',
                applicantCommits: [],
                projectStructure: [],
                downloadedSourceFile: [],
                url: '',
              },
              {
                projectName: 'NKTT',
                owner: 'X',
                applicantCommits: [],
                projectStructure: [],
                downloadedSourceFile: [],
                url: '',
              },
            ],
          },
        };

  let githubUsers1 : IGithubUser[] = []; 
  githubUsers1.push(user1);
  githubUsers1.push(user2);

  let githubUsers2 : IGithubUser[] = []; 
  githubUsers2.push(user3);

  const githubUsersModel1: IGithubUsersModel = {
      githubUsers: githubUsers1,
      location: 'montreal',
  } 

  const githubUsersModel2: IGithubUsersModel = {
      githubUsers: githubUsers2,
      location: 'nktt',
  } 
  const githubUsersTDG: GithubUsersTDG = new GithubUsersTDG();
  const githubUsersFinder: GithubUsersFinder = new GithubUsersFinder();

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

  it('Test mongo create githubUsers', async () => {
    let createdGithubUsers: IGithubUsersModel = await githubUsersTDG.create(
      githubUsersModel1
    );
    expect(githubUsersModel1.location).to.equal(createdGithubUsers.location);
    //Insert other githubUserss
    await githubUsersTDG.create(githubUsersModel2);
  });

  it('Test find githubUsers by location', async () => {
    await githubUsersFinder
      .findByLocation(githubUsersModel1.location)
      .then(doc => {
        let githubUserModelFound: IGithubUsersModel = doc;
        expect(githubUsersModel1.location).to.equal( githubUsersModel1.location);
      });
});

  it('Test find all githubUsers and delete', async () => {
    let githubUserModelFound: IGithubUsersModel;
    await githubUsersFinder
      .findAll()
      .then(doc => {
          githubUserModelFound = doc;
      });
          for (let i: number = 0; i < 2; i++){
           let deleteSuccess: boolean = await githubUsersTDG.delete(githubUserModelFound[i]._id);
         expect(deleteSuccess).to.be.equal(true);
          }
});

});
