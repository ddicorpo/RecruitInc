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


describe.only('Test mongo GithubUsers', () => {
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
              },
              {
                projectName: 'rufus',
                owner: 'MewtR',
                applicantCommits: [],
                projectStructure: [],
                downloadedSourceFile: [],
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
              },
              {
                projectName: 'SOEN343',
                owner: 'gprattico',
                applicantCommits: [],
                projectStructure: [],
                downloadedSourceFile: [],
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
              },
              {
                projectName: 'NKTT',
                owner: 'X',
                applicantCommits: [],
                projectStructure: [],
                downloadedSourceFile: [],
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
      .findBy(newApplicant.platformEmail)
      .then(doc => {
        let applicantFound: IApplicantModel = doc;
        console.log('Return platformEmail: ' + applicantFound.platformEmail);
        expect(newApplicant.platformEmail).to.equal(
          applicantFound.platformEmail
        );
        expect(newApplicant.platformUsername).to.equal(
          applicantFound.platformUsername
        );
      });
  });

});
