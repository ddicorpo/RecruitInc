import 'mocha';
import { MongoConnectionFactory } from '../../src/data-source/db-registry/mongo/MongoConnectionFactory';
import { expect } from 'chai';
import { IUserModel } from '../../src/domain/model/IUserModel';
import { HRTDG } from '../../src/data-source/table-data-gateway/hrTDG';
import { HRFinder } from '../../src/data-source/finder/hrFinder';
import { IHRModel } from '../../src/domain/model/IHRModel';
import { UserTDG } from '../../src/data-source/table-data-gateway/userTDG';
import { Types } from 'mongoose';
import { UserModel } from '../../src/data-source/schema/userSchema';
/**
 * This is a integration test for HR,
 * the HR data is a User saved in a special table
 */
xdescribe('Integration Test => HR ', () => {
  const userId: string = '5c1fb0fd4cb3ae14288028d9';
  const hrId: string = '5c1fb0fd4cb3ae14244028d3';
  const newUser: IUserModel = {
    username: 'PaulPaul69',
    firstName: 'Paul',
    lastName: 'Loop',
    hashedPassword: 'eion20939230k2309k209ke2309e3902keS',
    email: 'superPaul@gmail.com',
  };

  const newHR: IHRModel = {
    _id: Types.ObjectId(hrId),
    userRef: newUser,
  };

  const hrTDG: HRTDG = new HRTDG();
  const hrFinder: HRFinder = new HRFinder();
  const userTDG: UserTDG = new UserTDG();

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

  // afterEach(() => {
  //   try{
  //      userTDG.delete(hrId);
  //   }catch(Exception){
  //     throw new Error("Problem while remvoing user")
  //   }

  // });

  it('Test mongo create HR user', async () => {
    //Given: database clean and user data set
    //When
    const createdUser: IUserModel = await userTDG.create(newUser);
    newHR.userRef = createdUser;
    let createdHR: IHRModel = await hrTDG.create(newHR, hrId);

    //Then
    expect(newUser.email).to.equal(createdHR.userRef.email);
  });

  xit('Test mongo Find HR By Id', async () => {
    await hrFinder.findById(userId).then(doc => {
      let HRFound: IHRModel = doc;
      console.log('Return Email: ' + HRFound.userRef.email);
      expect(newUser.email).to.equal(HRFound.userRef.email);
    });
  });
  xit('Test mongo update HR', async () => {
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
