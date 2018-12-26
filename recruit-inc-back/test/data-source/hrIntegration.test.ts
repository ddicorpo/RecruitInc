import 'mocha';
import { MongoConnectionFactory } from '../../src/data-source/db-registry/mongo/MongoConnectionFactory';
import { expect } from 'chai';
import { Types } from 'mongoose';
import { IUserModel } from '../../src/domain/model/IUserModel';
import { HRTDG } from '../../src/data-source/table-data-gateway/hrTDG';
import { HRFinder } from '../../src/data-source/finder/hrFinder';
import { IHRModel } from '../../src/domain/model/IHRModel';
/**
 * This is a integration test for HR,
 * the HR data is a User saved in a special table
 */
describe('Integration Test => HR ', () => {
  const userId: string = '2a1eljja3911nsiunainaaw';
  const hrId: string = '1had8j3eacgh82j8aaiij';
  const newUser: IUserModel = {
    _id: userId,
    username: 'PaulPaul69',
    firstName: 'Paul',
    lastName: 'Loop',
    hashedPassword: 'eion20939230k2309k209ke2309e3902ke0k2e09k',
    email: 'superPaul@gmail.com',
  };

  const newHR: IHRModel = {
    _id: hrId,
    userRef: newUser,
  };

  const hrTDG: HRTDG = new HRTDG();
  const hrFinder: HRFinder = new HRFinder();

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

  it('Test mongo create HR user', async () => {
    //Given: database clean and user data set
    //When
    const createdHR: IHRModel = await hrTDG.create(newHR);

    //Then
    expect(newUser.email).to.equal(createdHR.userRef.email);
  });

  it('Test mongo Find HR By Id', async () => {
    await hrFinder.findById(userId).then(doc => {
      let HRFound: IHRModel = doc;
      console.log('Return Email: ' + HRFound.userRef.email);
      expect(newUser.email).to.equal(HRFound.userRef.email);
    });
  });
  it('Test mongo update HR', async () => {
    // Then
    newHR.userRef.firstName = 'BigRob';
    let updatedUser: boolean = await hrTDG.update(userId, newHR);
    expect(updatedUser).to.be.equal(true);
  });

  it('Test mongo delete User: HR delete user', async () => {
    // GIVEN
    let deleteSuccess: boolean = await hrTDG.delete(userId);
    //Then
    expect(deleteSuccess).to.be.equal(true);
  });
});
