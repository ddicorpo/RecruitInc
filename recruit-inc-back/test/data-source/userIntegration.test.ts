import 'mocha';
import { MongoConnectionFactory } from '../../src/data-source/db-registry/mongo/MongoConnectionFactory';
import { UserTDG } from '../../src/data-source/table-data-gateway/userTDG';
import { IUserModel } from '../../src/domain/model/IUserModel';
import { UserModel, UserSchema } from '../../src/data-source/schema/userSchema';
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

  it('Test mongo create user, verify if created', () => {
    const userTDG: UserTDG = new UserTDG();
    //Then
    userTDG.create(newUser);
  });

  it('Test mongo Update User: create user, verify if created, update user', () => {
    // GIVEN
    const userTDG: UserTDG = new UserTDG();
    //Then
    userTDG.create(newUser);
  });

  it('Test mongo delete User: create user, verify if created, delete user', () => {
    // GIVEN
    //When
    const userTDG: UserTDG = new UserTDG();
    //Then
    userTDG.create(newUser);
  });
});
