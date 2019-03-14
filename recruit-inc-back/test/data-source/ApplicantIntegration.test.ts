import 'mocha';
import { MongoConnectionFactory } from '../../src/data-source/db-registry/mongo/MongoConnectionFactory';
import { ApplicantTDG } from '../../src/data-source/table-data-gateway/applicantTDG';
import { IApplicantModel } from '../../src/domain/model/IApplicantModel';
import { UserType } from '../../src/domain/model/IApplicantModel';
import { ApplicantFinder } from '../../src/data-source/finder/ApplicantFinder';
import { expect } from 'chai';
import * as mongoose from 'mongoose';
import { Platform } from '../../src/domain/model/IGitDataModel';

require('dotenv').config(); //Get environment variables

/*
 * 
To get this test to work:
1) add DB_HOST=mongodb://169.45.50.135:<YOUR DB PORT (on the server)> to .env
2) add DB_NAME=test to .env
3) add NODE_ENV=production to .env
4) Remove 'x' from in front of the 'describe'
*/
xdescribe('Test mongo Applicant', () => {
  const newApplicant: IApplicantModel = {
    platformUsername: 'testUser',
    platformEmail: 'testUser@blah.com',
    iGit: {
      IGitData: [],
      IToken: {
        platform: Platform.Github,
        AccessToken: '',
        RefreshToken: '',
        ExpiryDate: '',
      },
    },
    userType: UserType.Applicant,
  };
  const newApplicant2: IApplicantModel = {
    platformUsername: 'testUser2',
    platformEmail: 'testUser2@blah.com',
    iGit: {
      IGitData: [],
      IToken: {
        platform: Platform.Github,
        AccessToken: '',
        RefreshToken: '',
        ExpiryDate: '',
      },
    },
    userType: UserType.Applicant,
  };
  const newApplicant3: IApplicantModel = {
    platformUsername: 'testUser3',
    platformEmail: 'testUser3@blah.com',
    iGit: {
      IGitData: [],
      IToken: {
        platform: Platform.Github,
        AccessToken: '',
        RefreshToken: '',
        ExpiryDate: '',
      },
    },
    userType: UserType.Candidate,
  };
  const applicantTDG: ApplicantTDG = new ApplicantTDG();
  const applicantFinder: ApplicantFinder = new ApplicantFinder();

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

  it('Test mongo create applicant', async () => {
    let createdApplicant: IApplicantModel = await applicantTDG.create(
      newApplicant
    );
    expect(newApplicant.platformEmail).to.equal(createdApplicant.platformEmail);
    //Insert other applicants
    await applicantTDG.create(newApplicant2);
    await applicantTDG.create(newApplicant3);
  });

  it('Test mongo Find Applicant By Email', async () => {
    await applicantFinder
      .findByPlatformEmail(newApplicant.platformEmail)
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

  it('Test mongo Find Applicant By Username', async () => {
    await applicantFinder
      .findByPlatformUsername(newApplicant2.platformUsername)
      .then(doc => {
        let applicantFound: IApplicantModel = doc;
        console.log(
          'Return platformUsername: ' + applicantFound.platformUsername
        );
        expect(newApplicant2.platformEmail).to.equal(
          applicantFound.platformEmail
        );
        expect(newApplicant2.platformUsername).to.equal(
          applicantFound.platformUsername
        );
      });
  });

  it('Test mongo Find Applicant By Usertype', async () => {
    await applicantFinder.findByUserType(UserType.Candidate).then(doc => {
      let applicantsFound: IApplicantModel = doc;
      console.log(applicantsFound);
      expect(newApplicant3.platformEmail).to.equal(
        applicantsFound[0].platformEmail
      );
      expect(newApplicant3.platformUsername).to.equal(
        applicantsFound[0].platformUsername
      );
    });
  });

  it('Test mongo findAll and delete', async () => {
    let applicantsFound: IApplicantModel;
    //Find all applicants
    await applicantFinder.findAll().then(doc => {
      applicantsFound = doc;
    });
    //Delete the applicants that were found
    for (let i: number = 0; i < 3; i++) {
      let deleteSuccess: boolean = await applicantTDG.delete(
        applicantsFound[i]._id
      );
      expect(deleteSuccess).to.be.equal(true);
    }
  });
});