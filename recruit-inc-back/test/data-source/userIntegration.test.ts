import 'mocha';
import { MongoConnectionFactory } from '../../src/data-source/db-registry/mongo/MongoConnectionFactory';
import { UserTDG } from '../../src/data-source/table-data-gateway/userTDG';
import { IUserModel } from '../../src/domain/model/IUserModel';
import { UserFinder } from '../../src/data-source/finder/userFinder';
import { expect, assert } from 'chai';
import { UserModel } from '../../src/data-source/schema/userSchema';
import { Types } from 'mongoose';
/**
 * This is an integration test user
 */

describe('Test mongo User', () => {
  const newUser: IUserModel = {
    username: 'Gilbert49',
    firstName: 'Gil',
    lastName: 'Foobar',
    hashedPassword: 'blablabla',
    email: 'megaGil@gmail.com',
  };
  const userTDG: UserTDG = new UserTDG();
  const userFinder: UserFinder = new UserFinder();
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
    //When
    // Start connection
    myFactory.getConnection();
    // Reset database
  });

  it('Test mongo create user, verify if created', async () => {
    //Given: database clean and user data set
    //When
    // let createdUser: IUserModel = await userTDG.create(newUser);

    //Then
    //let userFound: IUserModel = await userFinder.findById("5c1b2f79becbc9672038e63c");

    await UserModel.findOne({ _id: Types.ObjectId('5c1b10791e82272c899ec15a') })
      .then(doc => {
        let d: IUserModel = doc;
        console.log('EMAIL ' + d.email);
      })
      .catch(err => {
        console.log(err);
      });

    // let foundEmail : string;
    // userFound.then((user) =>{
    //   foundEmail = user.email;
    // });
    //console.log("Original Email: " + createdUser.email)
    // console.log("Return Email: " + userFound.email);

    // expect(foundEmail).to.equal(createdUser.email);
  });

  xit('Test mongo Update User: create user, verify if created, update user', async () => {
    // GIVEN
    let createdUser: IUserModel = await userTDG.create(newUser);

    //Then
    let foundUser: IUserModel = await userFinder.findByUsername(
      createdUser.username
    );
    assert(newUser.email === foundUser.email);
    foundUser.firstName = 'Victor';
    let updatedUser: boolean = await userTDG.update(foundUser._id, foundUser);
    expect(updatedUser).to.be.equal(true);
  });

  xit('Test mongo delete User: create user, verify if created, delete user', async () => {
    // GIVEN
    let createdUser: IUserModel = await userTDG.create(newUser);
    //Then
    let foundUser: IUserModel = await userFinder.findByUsername(
      createdUser.username
    );
    expect(newUser.email).to.be.equal(foundUser.email);
  });
});
