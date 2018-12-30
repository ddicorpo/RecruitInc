import 'mocha';
import { MongoConnectionFactory } from '../../src/data-source/db-registry/mongo/MongoConnectionFactory';
import { UserTDG } from '../../src/data-source/table-data-gateway/userTDG';
import { IUserModel } from '../../src/domain/model/IUserModel';
import { UserFinder } from '../../src/data-source/finder/userFinder';
import { expect } from 'chai';
import { Types } from 'mongoose';
/**
 * This is an integration test user
 */

xdescribe('Integration Test => User', () => {
  //Replace this Id by a known user Id
  const userId: string = '5c1b2f79becbc9672038e63c';
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
    let myFactory: MongoConnectionFactory = new MongoConnectionFactory();
    // Start connection
    myFactory.getConnection();
    // Reset database
  });

  it('Test mongo create user', async () => {
    //Given: database clean and user data set
    //When
    let createdUser: IUserModel = await userTDG.create(newUser, userId);

    //Then
    expect(newUser.email).to.equal(createdUser.email);
  });

  it('Test mongo Find By Id', async () => {
    await userFinder.findById(userId).then(doc => {
      let userFound: IUserModel = doc;
      console.log('Return Email: ' + userFound.email);
      expect(newUser.email).to.equal(userFound.email);
    });
  });
  it('Test mongo Update User: update user', async () => {
    // GIVEN

    //Then
    newUser._id = Types.ObjectId(userId);
    newUser.firstName = 'Victor';
    let updatedUser: boolean = await userTDG.update(userId, newUser);
    expect(updatedUser).to.be.equal(true);
  });

  it('Test mongo delete User: delete user', async () => {
    // GIVEN
    let deleteSuccess: boolean = await userTDG.delete(userId);
    //Then
    expect(deleteSuccess).to.be.equal(true);
  });
});
