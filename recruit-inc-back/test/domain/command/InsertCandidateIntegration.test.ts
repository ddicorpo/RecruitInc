import 'mocha';
import { InsertCandidateCommand } from '../../../src/domain/command/InsertCandidateCommand';
import {
  IApplicantModel,
  UserType,
} from '../../../src/domain/model/IApplicantModel';
import { Platform } from '../../../src/domain/model/IGitDataModel';
import { expect } from 'chai';
import { MongoConnectionFactory } from '../../../src/data-source/db-registry/mongo/MongoConnectionFactory';
import * as mongoose from 'mongoose';
require('dotenv').config(); //Get environment variables

xdescribe('Test Insert Candidate Command', () => {
  const newApplicant: IApplicantModel = {
    platformUsername: 'testUserInsert',
    platformEmail: 'testUserInsert@blah.com',
    iGit: {
      IGitData: [],
      IToken: {
        platform: Platform.Github,
        AccessToken: 'RobertBob',
        RefreshToken: '',
        ExpiryDate: '',
      },
    },
    userType: UserType.Candidate,
  };

  before(() => {
    // Establish connection
    let myFactory: MongoConnectionFactory = new MongoConnectionFactory();
    myFactory.defaultInitialization();
    // Start connection
    myFactory.getConnection();
  });
  it('Test insert Candidate', async () => {
    const command: InsertCandidateCommand = new InsertCandidateCommand();
    await command.insertCandidate(newApplicant).then(result => {
      expect(result).to.equal(true);
    });
  });

  after(() => {
    mongoose.connection.close();
  });
});
